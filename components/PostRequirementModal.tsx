'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PostRequirementModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        quantity: 1,
        budget: '',
        description: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('Please login to post a requirement')
                // Redirect logic handled by caller or auth state context preferably
                return
            }

            const { error } = await supabase
                .from('requirements')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    quantity: formData.quantity,
                    budget: formData.budget,
                    description: formData.description
                })

            if (error) throw error

            alert('Requirement Posted Successfully! Dealers will contact you shortly.')
            setIsOpen(false)
            setFormData({ title: '', quantity: 1, budget: '', description: '' })
        } catch (error: any) {
            console.error('Error posting requirement:', error)
            alert('Failed to post requirement: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.8rem 1.5rem' }}
            >
                📢 Post Requirement
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-card" style={{ background: 'white', width: '90%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Tell Us What You Need</h2>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Product Title</label>
                                <input
                                    required
                                    className="input-field"
                                    placeholder="e.g. Dell Latitude 7490"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="input-field"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Total Budget</label>
                                    <input
                                        className="input-field"
                                        placeholder="e.g. 50,000"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Additional Details</label>
                                <textarea
                                    className="input-field"
                                    rows={3}
                                    placeholder="Any specific specs? i5/i7? RAM?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Posting...' : 'Submit Requirement'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
