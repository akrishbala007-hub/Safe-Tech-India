'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userType, setUserType] = useState<'user' | 'dealer' | 'service_engineer' | 'admin'>('user')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
            setLoading(false)
            return
        }

        if (data.user) {
            // Check role to redirect
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            // Verify the user's actual role matches the selected type
            if (profile && profile.role !== userType) {
                alert(`This account is registered as a ${profile.role}, not a ${userType}. Please select the correct user type.`)
                await supabase.auth.signOut()
                setLoading(false)
                return
            }

            // Redirect based on role
            if (profile?.role === 'admin') {
                router.push('/admin')
            } else if (profile?.role === 'user') {
                router.push('/dashboard')
            } else if (profile?.role === 'service_engineer') {
                router.push('/dashboard')
            } else {
                router.push('/dashboard')
            }
        }
    }

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '60px' }} />
                </div>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Sign in to access your dashboard
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* User Type Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            I am a:
                        </label>
                        <select
                            className="input-field"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value as 'user' | 'dealer' | 'service_engineer' | 'admin')}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <option value="user">👤 Regular User (Buyer)</option>
                            <option value="dealer">🏪 Dealer / Seller</option>
                            <option value="service_engineer">🛠️ Service Engineer</option>
                            <option value="admin">🛡️ Admin</option>
                        </select>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: '600' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Don't have an account?
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <Link
                            href="/register?type=user"
                            className="btn"
                            style={{ flex: 1, textAlign: 'center', background: '#2563eb', color: 'white', fontSize: '0.85rem', padding: '0.6rem' }}
                        >
                            Register as User
                        </Link>
                        <Link
                            href="/register"
                            className="btn"
                            style={{ flex: 1, textAlign: 'center', background: 'rgba(255, 255, 255, 0.1)', fontSize: '0.85rem', padding: '0.6rem' }}
                        >
                            Register as Dealer
                        </Link>
                    </div>
                    <Link
                        href="/service-partner"
                        className="btn"
                        style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center', background: '#22c55e', color: 'white', fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                        Register as Service Engineer
                    </Link>
                </div>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    )
}
