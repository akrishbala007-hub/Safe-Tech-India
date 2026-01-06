'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<'dealer' | 'user' | 'service_engineer'>('dealer')

    // Form Data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        shopName: '',
        city: '',
        phone: '',
        whatsapp: '',
        gstNumber: ''
    })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const type = params.get('type')
        if (type === 'user') setRole('user')
        if (type === 'service_engineer') setRole('service_engineer')
    }, [])

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?role=${role}`, // Pass role to callback
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (error) alert(error.message)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Basic Validation
        if (!formData.email || !formData.password) {
            alert("Email and Password are required")
            setLoading(false)
            return
        }

        // Role Specific Validation
        if (role === 'dealer' && (!formData.shopName || !formData.city)) {
            alert("Shop Details are required for Dealers")
            setLoading(false)
            return
        }
        if (role === 'user' && !formData.name) {
            alert("Name is required")
            setLoading(false)
            return
        }

        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: role === 'dealer' ? formData.shopName : formData.name,
                    role: role,
                    shop_name: role === 'dealer' ? formData.shopName : null,
                    city: formData.city,
                    phone: formData.phone,
                    whatsapp_number: formData.whatsapp,
                    gst_number: formData.gstNumber
                }
            }
        })

        if (error) {
            console.error('Registration Error:', error)
            alert('Registration Failed: ' + error.message)
            setLoading(false)
            return
        }

        if (data.user) {
            alert('Registration successful! Redirecting to dashboard...')
            // Profile is created by DB trigger handle_new_user()
            // We use window.location.href for a hard reload to ensure session is picked up
            window.location.href = '/dashboard'
        }
    }

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '60px' }} />
                </div>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {role === 'dealer' ? 'Dealer Registration' : role === 'service_engineer' ? 'Service Engineer Sign Up' : 'Buyer Sign Up'}
                </h1>

                {/* Role Switcher */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setRole('dealer')}
                        className="btn"
                        style={{
                            background: role === 'dealer' ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.1)',
                            color: role === 'dealer' ? 'black' : 'black',
                            flex: '1 1 120px'
                        }}
                    >
                        Dealer
                    </button>
                    <button
                        onClick={() => setRole('user')}
                        className="btn"
                        style={{
                            background: role === 'user' ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.1)',
                            color: role === 'user' ? 'black' : 'black',
                            flex: '1 1 120px'
                        }}
                    >
                        Buyer
                    </button>
                    <button
                        onClick={() => setRole('service_engineer')}
                        className="btn"
                        style={{
                            background: role === 'service_engineer' ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.1)',
                            color: role === 'service_engineer' ? 'black' : 'black',
                            flex: '1 1 150px'
                        }}
                    >
                        Engineer
                    </button>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="btn"
                    style={{
                        width: '100%',
                        background: 'white',
                        color: '#333',
                        border: '1px solid #ccc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        marginBottom: '1.5rem'
                    }}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
                    Sign up with Google
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.7 }}>
                    — OR —
                </div>

                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} autoComplete="off">

                    {/* Role Specific Inputs */}
                    {(role === 'user' || role === 'service_engineer') && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    )}

                    {role === 'dealer' && (
                        <input
                            type="text"
                            placeholder="Shop Name"
                            className="input-field"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            required
                        />
                    )}

                    {(role === 'dealer' || role === 'service_engineer') && (
                        <input
                            type="text"
                            placeholder="City"
                            className="input-field"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                    )}

                    {/* Common Inputs */}
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoComplete="off"
                        name="email_reg_new"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                        name="password_reg_new"
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="input-field"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />

                    {role === 'dealer' && (
                        <>
                            <input
                                type="tel"
                                placeholder="WhatsApp Number"
                                className="input-field"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="GST Number"
                                className="input-field"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                required
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        {loading ? 'Creating Account...' : (role === 'dealer' ? 'Register as Dealer' : role === 'service_engineer' ? 'Register as Engineer' : 'Create Free Account')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
                </div>
            </div>
        </div>
    )
}
