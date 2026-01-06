
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import SuggestDealerModal from '@/components/SuggestDealerModal'

export default function AdminDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'dealers' | 'requests' | 'users' | 'leads' | 'engineers'>('dealers')
    const [showSuggestModal, setShowSuggestModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<any>(null)

    // Data
    const [dealers, setDealers] = useState<any[]>([])
    const [serviceRequests, setServiceRequests] = useState<any[]>([]) // Renamed for clarity
    const [productRequirements, setProductRequirements] = useState<any[]>([]) // NEW
    const [engineers, setEngineers] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])

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

        // 1. Fetch Dealers & Engineers & Users (Profiles)
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('role', 'admin')
            .order('created_at', { ascending: false })

        if (profiles) {
            setDealers(profiles.filter(p => p.role === 'dealer'))
            setEngineers(profiles.filter(p => p.role === 'service_engineer'))
            setUsers(profiles.filter(p => p.role === 'user'))
        }

        // 2. Fetch Service Requests
        const { data: sReqs, error: sReqError } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (sReqError) console.error('Error fetching service requests:', sReqError)

        // Manual join fallback if direct select relation fails (it often does if foreign key name is ambiguous)
        // For safety, let's keep the manual mapping or try to optimize. 
        // Actually, let's stick to the manual mapping pattern for reliability in this specific codebase context.

        if (sReqs) {
            const detailedSReqs = await Promise.all(sReqs.map(async (r) => {
                const { data: u } = await supabase.from('profiles').select('name, phone, email').eq('id', r.user_id).single()
                const { data: e } = r.assigned_engineer_id ? await supabase.from('profiles').select('name, phone').eq('id', r.assigned_engineer_id).single() : { data: null }
                return { ...r, profiles: u, engineer: e }
            }))
            setServiceRequests(detailedSReqs)
        }

        // 3. Fetch Product Requirements (Leads)
        const { data: pReqs, error: pReqError } = await supabase
            .from('requirements')
            .select('*')
            .order('created_at', { ascending: false })

        if (pReqError) console.error('Error fetching requirements:', pReqError)

        if (pReqs) {
            const detailedPReqs = await Promise.all(pReqs.map(async (r) => {
                const { data: u } = await supabase.from('profiles').select('name, phone, email').eq('id', r.user_id).single()
                return { ...r, profiles: u }
            }))
            setProductRequirements(detailedPReqs)
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
            // Also update engineers list if applicable
            setEngineers(engineers.map(e =>
                e.id === dealerId
                    ? { ...e, is_verified: !currentStatus }
                    : e
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


    const [suggestTarget, setSuggestTarget] = useState<'service' | 'product'>('service')

    const openSuggestModal = (request: any, type: 'service' | 'product') => {
        setSelectedRequest(request)
        setSuggestTarget(type)
        setShowSuggestModal(true)
    }

    const handleSuggestSubmit = async (selectedDealerIds: string[]) => {
        if (!selectedRequest) return
        console.log('--- STARTING DEALER SUGGESTION ---', { type: suggestTarget, id: selectedRequest.id, dealers: selectedDealerIds })

        try {
            if (suggestTarget === 'service') {
                const { error: insertError } = await supabase
                    .from('request_dealers')
                    .upsert(selectedDealerIds.map(id => ({
                        request_id: selectedRequest.id,
                        dealer_id: id
                    })), { onConflict: 'request_id, dealer_id', ignoreDuplicates: true })

                if (insertError) throw insertError

                const { error: updateError } = await supabase
                    .from('service_requests')
                    .update({ status: 'responded' })
                    .eq('id', selectedRequest.id)

                if (updateError) throw updateError

            } else {
                const insertPayload = selectedDealerIds.map(id => ({
                    requirement_id: selectedRequest.id,
                    dealer_id: id
                }))
                console.log('Requirement Insert Payload:', insertPayload)

                const { error: insertError } = await supabase
                    .from('requirement_dealers')
                    .upsert(insertPayload, { onConflict: 'requirement_id, dealer_id', ignoreDuplicates: true })

                if (insertError) {
                    console.error('Requirement Insert Error:', insertError)
                    throw insertError
                }

                console.log('Updating requirement status to responded...')
                const { error: updateError, data: updateData } = await supabase
                    .from('requirements')
                    .update({ status: 'responded' })
                    .eq('id', selectedRequest.id)
                    .select()

                if (updateError) {
                    console.error('Requirement Update Error:', updateError)
                    throw updateError
                }
                console.log('Update Success Result:', updateData)
            }

            console.log('Successfully processed suggestion')
            setShowSuggestModal(false)
            fetchData()

        } catch (error: any) {
            console.error('DEALER SUGGESTION FAILED:', error)
            alert(`Error Suggesting Dealers:\n${error.message || JSON.stringify(error)}`)
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
                <div className="glass-card" onClick={() => setActiveTab('dealers')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Total Dealers</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dealers.length}</p>
                </div>
                <div className="glass-card" onClick={() => setActiveTab('engineers')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Service Engineers</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'orange' }}>{engineers.length}</p>
                </div>
                <div className="glass-card" onClick={() => setActiveTab('dealers')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Verified Dealers</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'hsl(var(--success))' }}>
                        {dealers.filter(d => d.is_verified).length}
                    </p>
                </div>
                <div className="glass-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</p>
                </div>
                <div className="glass-card" onClick={() => setActiveTab('requests')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Service Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {serviceRequests.length}
                    </p>
                </div>
                <div className="glass-card" onClick={() => setActiveTab('leads')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <h3>Product Leads</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899' }}>
                        {productRequirements.length}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <button
                    onClick={() => setActiveTab('dealers')}
                    style={getTabStyle('dealers', activeTab)}
                >
                    Dealers ({dealers.length})
                </button>
                <button
                    onClick={() => setActiveTab('engineers')}
                    style={getTabStyle('engineers', activeTab)}
                >
                    Engineers ({engineers.length})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    style={getTabStyle('users', activeTab)}
                >
                    Users ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    style={getTabStyle('requests', activeTab)}
                >
                    Service Requests ({serviceRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('leads')}
                    style={getTabStyle('leads', activeTab)}
                >
                    Product Leads ({productRequirements.length})
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
                                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                            background: dealer.is_verified ? 'hsla(var(--success), 0.2)' : 'hsla(var(--warning), 0.2)',
                                            color: dealer.is_verified ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                                        }}>
                                            {dealer.is_verified ? (
                                                <><span>✅</span> Verified</>
                                            ) : (
                                                <><span>⏳</span> Pending</>
                                            )}
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
                                            {dealer.is_verified ? 'Revoke ❌' : 'Approve ✅'}
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

            {/* Users Table */}
            {activeTab === 'users' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Phone Number</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{user.name || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{user.phone || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            {user.address ? `${user.city}` : 'No location info'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', opacity: 0.7 }}>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>}
                </div>
            )}

            {/* Service Requests Table */}
            {activeTab === 'requests' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>User Details</th>
                                <th style={thStyle}>Issue</th>
                                <th style={thStyle}>Address</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Assigned Engineer</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceRequests.map((request: any) => (
                                <tr key={request.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{request.profiles?.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.85rem' }}>📞 {request.profiles?.phone}</div>
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
                                            {request.status.toUpperCase()}
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

                                        {/* Engineer Assignment (Existing) */}
                                        {request.status === 'open' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                                                {/* Suggest Dealers Button */}
                                                <button
                                                    onClick={() => openSuggestModal(request, 'service')}
                                                    className="btn"
                                                    style={{ background: '#3b82f6', color: 'white', fontSize: '0.85rem', padding: '0.5rem' }}
                                                >
                                                    Suggest Dealers 📢
                                                </button>
                                            </div>
                                        )}
                                        {request.status === 'responded' && (
                                            <span style={{ color: 'green', fontSize: '0.9rem' }}>Dealers Suggested ✓</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {serviceRequests.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No service requests found.</div>}
                </div>
            )}

            {/* Product Leads (Requirements) Table */}
            {activeTab === 'leads' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>User Contact</th>
                                <th style={thStyle}>Requirement</th>
                                <th style={thStyle}>Specs & Brand</th>
                                <th style={thStyle}>Budget & Qty</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productRequirements.map((req: any) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{req.user_name || req.profiles?.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.85rem' }}>📞 {req.user_phone || req.profiles?.phone || 'No Phone'}</div>
                                        {req.city && <div style={{ fontSize: '0.8rem', color: '#aaa' }}>📍 {req.city}</div>}
                                        {(!req.user_name && req.profiles?.email) && <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>✉️ {req.profiles.email}</div>}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{req.title}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(req.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {req.brand && <div style={{ fontSize: '0.85rem', color: '#ec4899', marginBottom: '0.2rem' }}>Brand: {req.brand}</div>}
                                        <div style={{ maxWidth: '300px', fontSize: '0.9rem' }}>{req.description}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>₹{req.budget}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {req.quantity}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: req.status === 'open' ? 'green' : 'gray' }}>{req.status?.toUpperCase()}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {req.status === 'open' ? (
                                            <button
                                                onClick={() => openSuggestModal(req, 'product')}
                                                className="btn"
                                                style={{ background: '#ec4899', color: 'white', fontSize: '0.85rem', padding: '0.5rem' }}
                                            >
                                                Suggest Dealers 📢
                                            </button>
                                        ) : (
                                            <span style={{ color: 'green', fontSize: '0.9rem' }}>Dealers Posted ✓</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {productRequirements.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No product leads found.</div>}
                </div>
            )}

            {/* Service Engineers Table */}
            {activeTab === 'engineers' && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {engineers.map((engineer: any) => (
                                <tr key={engineer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{engineer.name || 'Unknown'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>📍 {engineer.city}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>📞 {engineer.phone}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{engineer.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: engineer.is_verified ? 'hsla(var(--success), 0.2)' : 'hsla(var(--warning), 0.2)',
                                            color: engineer.is_verified ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                                        }}>
                                            {engineer.is_verified ? 'Verified ✅' : 'Pending ⏳'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => toggleVerification(engineer.id, engineer.is_verified)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem',
                                                fontSize: '0.8rem',
                                                background: engineer.is_verified ? 'hsla(var(--destructive), 0.2)' : 'hsla(var(--success), 0.2)',
                                                color: engineer.is_verified ? 'hsl(var(--destructive))' : 'hsl(var(--success))'
                                            }}
                                        >
                                            {engineer.is_verified ? 'Revoke ❌' : 'Approve ✅'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {engineers.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No service engineers found.</div>}
                </div>
            )}
            {/* Suggest Modal */}
            {showSuggestModal && selectedRequest && (
                <SuggestDealerModal
                    request={selectedRequest}
                    dealers={dealers.filter(d => d.is_verified)} // Only show verified dealers
                    onClose={() => setShowSuggestModal(false)}
                    onSubmit={handleSuggestSubmit}
                />
            )}
        </div>
    )
}

const thStyle = { padding: '1rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }

const getTabStyle = (tabName: string, activeTab: string) => ({
    padding: '1rem 2rem',
    background: activeTab === tabName ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: 'none',
    borderBottom: activeTab === tabName ? '2px solid hsl(var(--primary))' : 'none',
    color: activeTab === tabName ? 'white' : 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '-2px'
})
