'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ServiceRequestModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        description: '',
        address: '',
        pincode: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Get User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert('Please login to request a service.')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('service_requests').insert({
            user_id: user.id,
            description: formData.description,
            address: formData.address,
            pincode: formData.pincode,
            status: 'open'
        })

        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            alert('Service Request Submitted! An admin will assign an engineer shortly.')
            setIsOpen(false)
            setFormData({ description: '', address: '', pincode: '' })
            setLoading(false)
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="btn" style={{ background: '#3b82f6', color: 'white', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛠️ Request Repair
            </button>

            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🛠️ Request Repair Service
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Issue Description</label>
                                <textarea
                                    placeholder="e.g. Laptop screen broken, Motherboard not powering on..."
                                    className="input-field"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Address</label>
                                    <input
                                        type="text"
                                        placeholder="Area / Street"
                                        className="input-field"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="600002"
                                        className="input-field"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#93c5fd' }}>
                                ℹ️ Your request will be sent to verified engineers in your pincode. You will be contacted shortly.
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
