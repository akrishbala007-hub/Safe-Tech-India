'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function RequirementModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        budget: '',
        quantity: 1,
        description: '',
        user_name: '',
        user_phone: '',
        city: ''
    })

    // Pre-fill user data when modal opens or component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isOpen) return // Only fetch when modal is open

            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        user_name: profile.name || '',
                        user_phone: profile.phone || '',
                        city: profile.city || ''
                    }))
                }
            }
        }
        fetchUserData()
    }, [isOpen]) // Run when isOpen changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Get User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert('Please login to post a requirement.')
            setLoading(false)
            return
        }

        // Validation
        if (!formData.user_name || !formData.user_phone || !formData.city) {
            alert('Please provide your Name, Phone and City so dealers can contact you.')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('requirements').insert({
            user_id: user.id,
            title: formData.title,
            brand: formData.brand,
            budget: formData.budget,
            quantity: formData.quantity,
            description: formData.description,
            user_name: formData.user_name,
            user_phone: formData.user_phone,
            city: formData.city,
            status: 'open'
        })

        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            alert('Requirement Posted! Dealers will be notified.')
            setIsOpen(false)
            // Reset core fields but keep contact info for convenience
            setFormData(prev => ({ ...prev, title: '', brand: '', budget: '', quantity: 1, description: '' }))
            setLoading(false)
            window.location.reload()
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="btn" style={{ background: '#ec4899', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontSize: '1.1rem' }}>
                🛍️ Post Buying Requirement
            </button>

            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '500px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🛍️ Post Buying Requirement
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Contact Details Section */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                <h4 style={{ marginBottom: '0.8rem', color: '#ec4899', fontSize: '0.9rem' }}>📞 Contact Details (Required)</h4>
                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="input-field"
                                        value={formData.user_name}
                                        onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                        required
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="input-field"
                                            value={formData.user_phone}
                                            onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className="input-field"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Product Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Need 5x i7 Laptops"
                                    className="input-field"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Brand Preference</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dell, HP, Apple"
                                        className="input-field"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Budget (Approx)</label>
                                    <input
                                        type="text"
                                        placeholder="Min - Max"
                                        className="input-field"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="input-field"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Specifications / Details</label>
                                <textarea
                                    placeholder="e.g. 16GB RAM, 512GB SSD, Touchscreen..."
                                    className="input-field"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#fbcfe8' }}>
                                ℹ️ This request will be broadcast to all verified dealers. They will contact you via WhatsApp/Phone.
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', background: '#ec4899' }}>
                                {loading ? 'Posting...' : 'Post Requirement'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
