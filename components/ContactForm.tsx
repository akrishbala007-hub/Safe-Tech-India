'use client'

import { useState } from 'react'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const text = `Hi, I am reaching out from the website.\n\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*City:* ${formData.city}\n*Message:* ${formData.message}`

        const whatsappUrl = `https://wa.me/919600707601?text=${encodeURIComponent(text)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111' }}>Get Expert Help</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Name</label>
                <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Mobile Number</label>
                <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="input-field"
                    placeholder="10-digit Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>City</label>
                <select
                    required
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ background: 'white' }}
                >
                    <option value="">Select your City</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Message</label>
                <textarea
                    rows={4}
                    required
                    className="input-field"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                💬 Talk to Our Team
            </button>
        </form>
    )
}
