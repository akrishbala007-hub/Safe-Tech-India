"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { X, CheckCircle } from 'lucide-react'

interface ContactDealerModalProps {
    product: any
    onClose: () => void
}

export default function ContactDealerModal({ product, onClose }: ContactDealerModalProps) {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        message: `I'm interested in buying: ${product.title}`
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // We use the 'requirements' table for leads
            const { error } = await supabase.from('requirements').insert({
                title: `[Product Inquiry] ${product.title}`,
                description: `CUSTOMER: ${form.name}\nPHONE: ${form.phone}\nMESSAGE: ${form.message}\nPRODUCT_ID: ${product.id}\nDEALER: ${product.profiles?.shop_name || 'Generic'}`,
                budget: product.safe_tech_price || product.price,
                user_name: form.name,
                user_phone: form.phone,
                status: 'open',
                brand: product.category, // Using category as brand for lead tracking
                quantity: 1
            })

            if (error) throw error
            setSubmitted(true)
        } catch (error: any) {
            alert('Error sending inquiry: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <CheckCircle size={60} color="#25D366" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ marginBottom: '1rem' }}>Inquiry Sent!</h2>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>Our team or the dealer will contact you shortly regarding <strong>{product.title}</strong>.</p>
                        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Inquire About Product</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f8f9fa', padding: '1rem', borderRadius: '12px' }}>
                    <img
                        src={product.image_url || 'https://via.placeholder.com/150'}
                        alt={product.title}
                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{product.title}</div>
                        <div style={{ color: '#25D366', fontWeight: 'bold' }}>₹{(product.safe_tech_price || product.price).toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Dealer: {product.profiles?.shop_name || 'Verified Dealer'}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={labelStyle}>Your Name</label>
                        <input
                            required
                            className="input-field"
                            style={{ ...inputStyle, background: 'white', border: '1px solid #ddd' }}
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>WhatsApp Number</label>
                        <input
                            required
                            type="tel"
                            className="input-field"
                            style={{ ...inputStyle, background: 'white', border: '1px solid #ddd' }}
                            placeholder="Enter 10-digit phone number"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Message (Optional)</label>
                        <textarea
                            className="input-field"
                            style={{ ...inputStyle, background: 'white', border: '1px solid #ddd', height: '80px', resize: 'none' }}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', background: '#000', color: '#FECC00' }}
                    >
                        {loading ? 'Sending...' : 'Confirm Inquiry'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
}

const modalStyle: React.CSSProperties = {
    background: 'white',
    padding: '2rem',
    borderRadius: '24px',
    maxWidth: '450px',
    width: '100%',
    color: '#1a1a1a'
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555'
}

const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '10px',
    fontSize: '1rem'
}
