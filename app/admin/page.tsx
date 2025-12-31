
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'dealers' | 'requests'>('dealers')

    // Data
    const [dealers, setDealers] = useState<any[]>([])
    const [requests, setRequests] = useState<any[]>([])
    const [engineers, setEngineers] = useState<any[]>([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        // 1. Fetch Dealers & Engineers (Profiles)
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('role', 'admin')
            .order('created_at', { ascending: false })

        if (profiles) {
            setDealers(profiles.filter(p => p.role === 'dealer'))
            setEngineers(profiles.filter(p => p.role === 'service_engineer'))
        }

        // 2. Fetch Service Requests
        const { data: serviceRequests, error: requestsError } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (requestsError) {
            console.error('Error fetching service requests:', requestsError)
        }

        if (serviceRequests) {
            // Fetch user profiles for each request
            const requestsWithProfiles = await Promise.all(
                serviceRequests.map(async (request) => {
                    // Get user profile
                    const { data: userProfile } = await supabase
                        .from('profiles')
                        .select('name, phone')  // Removed 'email' - it's not in profiles table
                        .eq('id', request.user_id)
                        .single()

                    // Get engineer profile if assigned
                    let engineerProfile = null
                    if (request.assigned_engineer_id) {
                        const { data: engineer } = await supabase
                            .from('profiles')
                            .select('name, phone, city')
                            .eq('id', request.assigned_engineer_id)
                            .single()
                        engineerProfile = engineer
                    }

                    return {
                        ...request,
                        profiles: userProfile,
                        engineer: engineerProfile
                    }
                })
            )
            setRequests(requestsWithProfiles)
        }

        setLoading(false)
    }

    const toggleVerification = async (dealerId: string, currentStatus: boolean) => {
        // Use RPC to verify (Admins Only)
        const { error } = await supabase.rpc('toggle_dealer_verification', {
            _dealer_id: dealerId
        })

        if (error) {
            console.error('Verification Error:', error)
            alert('Error updating status: ' + error.message)
        } else {
            // Optimistic update or refresh
            setDealers(dealers.map(d =>
                d.id === dealerId
                    ? { ...d, is_verified: !currentStatus, status: !currentStatus ? 'verified' : 'unverified' }
                    : d
            ))
        }
    }

    const toggleSubscription = async (dealerId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'none' : 'active'
        const { error } = await supabase.rpc('toggle_dealer_subscription', {
            _dealer_id: dealerId,
            _status: newStatus
        })

        if (error) {
            console.error('Subscription Error:', error)
            alert('Error updating subscription: ' + error.message)
        } else {
            setDealers(dealers.map(d =>
                d.id === dealerId
                    ? { ...d, subscription_status: newStatus }
                    : d
            ))
        }
    }

    const assignEngineer = async (requestId: string, engineerId: string) => {
        if (!engineerId) return

        const { error } = await supabase
            .from('service_requests')
            .update({
                assigned_engineer_id: engineerId,
                status: 'assigned'
            })
            .eq('id', requestId)

        if (error) {
            console.error('Assignment Error:', error)
            alert('Error assigning engineer: ' + error.message)
        } else {
            alert('Engineer assigned successfully!')
            // Refresh data
            fetchData()
        }
    }

    if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading Admin Panel...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1>Admin Control Center</h1>
                <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    Log Out
                </button>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-card">
                    <h3>Total Dealers</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dealers.length}</p>
                </div>
                <div className="glass-card">
                    <h3>Verified</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'hsl(var(--success))' }}>
                        {dealers.filter(d => d.is_verified).length}
                    </p>
                </div>
                <div className="glass-card">
                    <h3>Pending</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'hsl(var(--warning))' }}>
                        {dealers.filter(d => !d.is_verified).length}
                    </p>
                </div>
                <div className="glass-card">
                    <h3>Service Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {requests.length}
                    </p>
                </div>
                <div className="glass-card">
                    <h3>Open Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'hsl(var(--warning))' }}>
                        {requests.filter(r => r.status === 'open').length}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <button
                    onClick={() => setActiveTab('dealers')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'dealers' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'dealers' ? '2px solid hsl(var(--primary))' : 'none',
                        color: activeTab === 'dealers' ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginBottom: '-2px'
                    }}
                >
                    Dealers ({dealers.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'requests' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'requests' ? '2px solid hsl(var(--primary))' : 'none',
                        color: activeTab === 'requests' ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginBottom: '-2px'
                    }}
                >
                    Service Requests ({requests.length})
                </button>
            </div>

            {/* Dealers Table */}
            {activeTab === 'dealers' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>Shop Name</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>GST Number</th>
                                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Payment</th>
                                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealers.map((dealer: any) => (
                                <tr key={dealer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{dealer.shop_name}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{dealer.city}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{dealer.phone}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{dealer.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                            {dealer.gst_number || 'N/A'}
                                        </code>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: dealer.is_verified ? 'hsla(var(--success), 0.2)' : 'hsla(var(--warning), 0.2)',
                                            color: dealer.is_verified ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                                        }}>
                                            {dealer.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: dealer.subscription_status === 'active' ? 'hsla(var(--success), 0.2)' : 'hsla(var(--destructive), 0.2)',
                                            color: dealer.subscription_status === 'active' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
                                        }}>
                                            {dealer.subscription_status === 'active' ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => toggleVerification(dealer.id, dealer.is_verified)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem',
                                                fontSize: '0.8rem',
                                                background: dealer.is_verified ? 'hsla(var(--destructive), 0.2)' : 'hsla(var(--success), 0.2)',
                                                color: dealer.is_verified ? 'hsl(var(--destructive))' : 'hsl(var(--success))'
                                            }}
                                        >
                                            {dealer.is_verified ? 'Revoke' : 'Verify'}
                                        </button>
                                        <button
                                            onClick={() => toggleSubscription(dealer.id, dealer.subscription_status)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem',
                                                fontSize: '0.8rem',
                                                background: dealer.subscription_status === 'active' ? 'rgba(255,255,255,0.1)' : 'hsla(var(--primary), 0.2)',
                                                color: dealer.subscription_status === 'active' ? 'white' : 'hsl(var(--primary))'
                                            }}
                                        >
                                            {dealer.subscription_status === 'active' ? 'Mark Unpaid' : 'Mark Paid'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dealers.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No dealers found.</div>}
                </div>
            )}

            {/* Service Requests Table */}
            {activeTab === 'requests' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Assigned Engineer</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request: any) => (
                                <tr key={request.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{request.profiles?.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{request.profiles?.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ maxWidth: '300px' }}>{request.description}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{request.address}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>PIN: {request.pincode}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: request.status === 'open' ? 'hsla(var(--warning), 0.2)' :
                                                request.status === 'assigned' ? 'hsla(var(--primary), 0.2)' :
                                                    'hsla(var(--success), 0.2)',
                                            color: request.status === 'open' ? 'hsl(var(--warning))' :
                                                request.status === 'assigned' ? 'hsl(var(--primary))' :
                                                    'hsl(var(--success))'
                                        }}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {request.engineer ? (
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{request.engineer.name}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{request.engineer.phone}</div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>Not assigned</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {request.status === 'open' && (
                                            <select
                                                onChange={(e) => assignEngineer(request.id, e.target.value)}
                                                className="input-field"
                                                style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign Engineer</option>
                                                {engineers.filter(e => e.is_verified).map((eng: any) => (
                                                    <option key={eng.id} value={eng.id}>
                                                        {eng.name} - {eng.city}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No service requests found.</div>}
                </div>
            )}
        </div>
    )
}

const thStyle = { padding: '1rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }
const tdStyle = { padding: '1rem' }
const btnStyle = {
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
}
