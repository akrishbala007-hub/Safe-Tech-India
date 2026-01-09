'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const ServiceRequestModal = dynamic(() => import('@/components/ServiceRequestModal'), { ssr: false })
const RequirementModal = dynamic(() => import('@/components/RequirementModal'), { ssr: false })

export default function Dashboard() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [requirements, setRequirements] = useState<any[]>([])
    const [serviceTasks, setServiceTasks] = useState<any[]>([])
    const [dealers, setDealers] = useState<any[]>([])
    const [myRequests, setMyRequests] = useState<any[]>([])
    const [myRequirements, setMyRequirements] = useState<any[]>([])

    useEffect(() => {
        const getData = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error('Error getting user:', userError)
                    router.push('/login')
                    return
                }

                if (!user) {
                    console.log('No user found, redirecting to login')
                    router.push('/login')
                    return
                }

                console.log('User authenticated:', user.id)

                const { data: prof, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError) {
                    // ... error handling ...
                    if (profileError.code === 'PGRST116') {
                        alert('Your profile was not found. Please complete the registration process.')
                        router.push('/register')
                        return
                    }
                    alert(`Error loading profile: ${profileError.message}. Please contact support.`)
                    setProfile(null)
                    return
                }

                console.log('Profile loaded:', prof)
                setProfile(prof)

                if (prof.role === 'dealer' || prof.role === 'admin') {
                    // 1. Dealer Logic
                    const { data: prods } = await supabase
                        .from('products')
                        .select('*')
                        .eq('dealer_id', prof.id)
                        .order('created_at', { ascending: false })
                    setProducts(prods || [])

                    const { data: leads } = await supabase
                        .from('requirements')
                        .select('*')
                        .eq('status', 'open')
                        .order('created_at', { ascending: false })
                    setRequirements(leads || [])

                } else if (prof.role === 'service_engineer') {
                    // 2. Engineer Logic
                    const { data: tasks } = await supabase
                        .from('service_requests')
                        .select('*')
                        .eq('assigned_engineer_id', prof.id)
                        .order('created_at', { ascending: false })
                    setServiceTasks(tasks || [])

                } else if (prof.role === 'user') {
                    // 3. User Logic 

                    // A. Fetch Service Requests
                    const { data: requestsData, error: reqError } = await supabase
                        .from('service_requests')
                        .select(`
                            *,
                            request_dealers (
                                profiles (*)
                            )
                        `)
                        .eq('user_id', prof.id)
                        .order('created_at', { ascending: false })

                    if (reqError) console.error('Error fetching requests:', reqError)
                    setMyRequests(requestsData || [])

                    // B. Fetch Buying Requirements
                    const { data: myReqs, error: myReqsError } = await supabase
                        .from('requirements')
                        .select(`
                            *,
                            requirement_dealers (
                                profiles (*)
                            )
                        `)
                        .eq('user_id', prof.id)
                        .order('created_at', { ascending: false })

                    if (myReqsError) console.error('Error fetching requirements:', myReqsError)
                    setMyRequirements(myReqs || [])
                }
            } catch (error) {
                console.error('Unexpected error in getData:', error)
                alert('An unexpected error occurred. Please try logging in again.')
                router.push('/login')
            }
        }
        getData()
    }, [])

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        const { error } = await supabase
            .from('service_requests')
            .update({ status: newStatus })
            .eq('id', taskId)

        if (error) {
            alert('Error updating status')
        } else {
            setServiceTasks(serviceTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
        }
    }

    if (!profile) return <div className="container" style={{ paddingTop: '4rem' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1>Welcome, {profile.shop_name || profile.name || 'Partner'}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div className="verified-badge" style={{
                            background: profile.is_verified ? 'hsla(var(--success), 0.1)' : 'hsla(var(--warning), 0.1)',
                            color: profile.is_verified ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                        }}>
                            {profile.is_verified ? '✓ Verified Partner' : '⚠ Verification Pending'}
                        </div>
                        <span style={{
                            fontSize: '0.8rem',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '20px',
                            color: '#aaa',
                            textTransform: 'uppercase'
                        }}>
                            Role: {profile.role}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {(profile.role === 'dealer' || profile.role === 'admin' || profile.role === 'service_engineer') && (
                        <button
                            onClick={() => router.push('/dashboard/profile')}
                            className="btn"
                            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                        >
                            Edit Profile ✏️
                        </button>
                    )}
                    {profile.role === 'admin' && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="btn"
                            style={{ background: 'hsl(var(--primary))', color: 'black' }}
                        >
                            Admin Panel 🛡️
                        </button>
                    )}
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        Log Out
                    </button>
                </div>
            </header>

            {/* Engineer View */}
            {profile.role === 'service_engineer' && (
                <div className="glass-card">
                    <h3>🛠️ My Service Tasks</h3>
                    <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Service requests assigned to you by Admin.</p>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {serviceTasks.map((task: any) => (
                            <div key={task.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#60a5fa' }}>{task.description}</h4>
                                        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>📍 {task.address} ({task.pincode})</div>
                                    </div>
                                    <span style={{
                                        padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem',
                                        background: task.status === 'completed' ? '#22c55e22' : '#f59e0b22',
                                        color: task.status === 'completed' ? '#22c55e' : '#f59e0b'
                                    }}>
                                        {task.status.toUpperCase()}
                                    </span>
                                </div>

                                {task.status !== 'completed' && (
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'completed')}
                                            className="btn"
                                            style={{ background: '#22c55e', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            Mark Completed
                                        </button>
                                        <a
                                            href={`https://maps.google.com/?q=${task.pincode}`}
                                            target="_blank"
                                            className="btn"
                                            style={{ background: '#333', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            View Map 🗺️
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                        {serviceTasks.length === 0 && <p style={{ opacity: 0.5 }}>No assigned tasks yet. Admin will assign tickets based on your pincode.</p>}
                    </div>
                </div>
            )}

            {/* Regular User View - Request Repair & Dealers */}
            {profile.role === 'user' && (
                <div style={{ display: 'grid', gap: '3rem' }}>
                    {/* Service Request Section */}
                    <div className="glass-card">
                        <h3>🛠️ Need IT Support?</h3>
                        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Request repair or maintenance services from verified service engineers in your area.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <ServiceRequestModal />
                            <RequirementModal />
                        </div>
                    </div>

                    {/* Requests & Suggestions Section */}
                    <div className="glass-card">
                        <h3>📋 My Requests (Service & Buy)</h3>
                        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>View status of your repair requests and buying needs.</p>

                        {/* BUY REQUIREMENTS LIST */}
                        {myRequirements.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: '#ec4899' }}>🛍️ Buying Requirements</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {myRequirements.map((req: any) => (
                                        <div key={req.id} style={{ background: 'rgba(236, 72, 153, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold', color: '#fbcfe8' }}>{req.title}</span>
                                                <span style={{ fontSize: '0.8rem', background: '#333', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Qty: {req.quantity}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ddd' }}>{req.brand ? `[${req.brand}] ` : ''}{req.description}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <span>Budget: ₹{req.budget}</span>
                                                <span style={{ color: req.status === 'open' ? 'green' : 'gray' }}>{req.status.toUpperCase()}</span>
                                            </div>

                                            {/* Suggested Dealers for Requirement */}
                                            {req.requirement_dealers && req.requirement_dealers.length > 0 && (
                                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '0.5rem' }}>View Suggested Dealers:</div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        {req.requirement_dealers.map((rd: any) => {
                                                            const dealer = rd.profiles
                                                            if (!dealer) return null
                                                            return (
                                                                <div key={dealer.id}
                                                                    onClick={() => router.push(`/shop/${dealer.id}`)}
                                                                    style={{
                                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                        padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px',
                                                                        cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)'
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{dealer.shop_name}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{dealer.city} • {dealer.phone}</div>
                                                                    </div>
                                                                    <span style={{ fontSize: '1.2rem' }}>👉</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🛠️ Service / Repair Requests</h4>

                        {myRequests.length === 0 ? (
                            <p style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                You haven't made any requests yet. Use the "Need IT Support?" form above.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {myRequests.map((req: any) => (
                                    <div key={req.id} style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', padding: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{req.description}</h4>
                                                <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span style={{
                                                color: req.status === 'responded' ? '#22c55e' : '#f59e0b',
                                                fontWeight: 'bold', fontSize: '0.9rem'
                                            }}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Suggested Dealers List */}
                                        <div style={{ marginTop: '1rem' }}>
                                            <h5 style={{ marginBottom: '0.8rem', color: 'var(--primary)' }}>Protected/Suggested Dealers:</h5>

                                            {req.request_dealers && req.request_dealers.length > 0 ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                                    {req.request_dealers.map((rd: any) => {
                                                        const dealer = rd.profiles
                                                        if (!dealer) return null
                                                        return (
                                                            <div key={dealer.id} style={{
                                                                background: '#1a1a1a', borderRadius: '8px', padding: '1rem',
                                                                border: '1px solid #333', cursor: 'pointer'
                                                            }}
                                                                onClick={() => router.push(`/shop/${dealer.id}`)}
                                                            >
                                                                <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{dealer.shop_name}</div>
                                                                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{dealer.city} • {dealer.phone}</div>
                                                                <button className="btn" style={{
                                                                    marginTop: '0.5rem', width: '100%', padding: '0.3rem', fontSize: '0.8rem',
                                                                    background: 'rgba(255,255,255,0.1)'
                                                                }}>
                                                                    View Profile
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#888' }}>
                                                    Waiting for Admin to suggest the best dealers for this request...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dealer View */}
            {(profile.role === 'dealer' || profile.role === 'admin') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Quick Stats */}
                    <div className="glass-card">
                        <h3>Lead Counter</h3>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>{requirements.length}</p>
                        <p style={{ color: 'var(--text-muted)' }}>Active Buyer Requests</p>
                    </div>

                    {/* Buyer Requirements Feed */}
                    <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                        <h3>📢 New Buyer Requirements</h3>
                        <p style={{ marginBottom: '1rem', opacity: 0.7 }}>Retail buyers looking for specific products.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {requirements.map((req: any) => (
                                <div key={req.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{req.title}</span>
                                        <span style={{ fontSize: '0.8rem', background: '#333', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Qty: {req.quantity}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{req.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span>Budget: ₹{req.budget}</span>
                                        <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                            {requirements.length === 0 && <p style={{ opacity: 0.5 }}>No active requirements at the moment.</p>}
                        </div>
                    </div>

                    {/* Inventory Actions */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Inventory ({products.length})</h3>
                        </div>

                        {profile.is_verified ? (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginBottom: '1rem' }}
                                onClick={() => router.push('/dashboard/add-product')}
                            >
                                Add New Product
                            </button>
                        ) : (
                            <div style={{ padding: '1rem', background: 'hsla(var(--warning), 0.1)', borderRadius: '8px', color: 'hsl(var(--warning))', marginBottom: '1rem' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>Action Blocked:</span> Waiting for Admin Verification to upload products.
                                </div>
                                {profile.role === 'dealer' && (
                                    <a
                                        href={`https://wa.me/919600707601?text=${encodeURIComponent('Hi, I have registered and want to complete manual payment for verification to upload products.')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{
                                            background: 'hsl(var(--primary))',
                                            color: '#1a1a1a',
                                            fontSize: '0.9rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        💳 Verify & Pay
                                    </a>
                                )}
                            </div>
                        )}

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {products.map(p => (
                                <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
                                    <img src={p.image_url || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{p.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{p.price.toLocaleString()} • {p.condition}</div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/dashboard/edit-product/${p.id}`)}
                                        className="btn"
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#333' }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                            {products.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No products yet.</p>}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}
