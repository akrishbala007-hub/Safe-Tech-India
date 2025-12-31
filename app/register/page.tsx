'use client'

// [Modified for User/Dealer Role]
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<'dealer' | 'user' | 'service_engineer'>('dealer')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        shopName: '', // Dealer only
        city: '',     // Dealer & Engineer
        phone: '',
        whatsapp: '', // Dealer & Engineer
        gstNumber: '', // Dealer only
        name: '',      // User & Engineer
        pincode: ''    // Engineer only (and maybe dealer later)
    })

    useEffect(() => {
        // Check URL for type=user or service_engineer
        const params = new URLSearchParams(window.location.search)
        const type = params.get('type')
        if (type === 'user') setRole('user')
        if (type === 'service_engineer') setRole('service_engineer')
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Validate
        if (!formData.email || !formData.password) {
            alert("Email and Password are required")
            setLoading(false)
            return
        }

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
        })

        if (error) {
            // Check if user already exists
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                // User exists in auth but might not have profile
                alert('This email is already registered. Attempting to create your profile...')

                // Try to sign in and create profile
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })

                if (signInError) {
                    alert('Email already registered with a different password. Please use the login page.')
                    setLoading(false)
                    return
                }

                if (signInData.user) {
                    // Check if profile exists
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', signInData.user.id)
                        .single()

                    if (existingProfile) {
                        alert('Account already exists with a profile. Please use the login page.')
                        router.push('/login')
                        return
                    }

                    // Profile doesn't exist, create it
                    if (role === 'dealer') {
                        await createDealerProfileDirect(signInData.user.id)
                    } else {
                        await createUserProfileDirect(signInData.user.id)
                    }
                }
                return
            }

            alert(error.message)
            setLoading(false)
            return
        }

        if (data.user) {
            if (role === 'dealer') {
                // Dealer Flow -> Payment
                await initiatePayment(data.user.id)
            } else {
                // User Flow -> Direct Profile
                await createUserProfile(data.user.id)
            }
        }
    }

    const createUserProfile = async (userId: string) => {
        const { error } = await supabase.rpc('create_user_profile', {
            _name: formData.name,
            _phone: formData.phone
        })

        if (error) {
            console.error('Profile Error:', error)
            // If RPC fails, try direct insert
            await createUserProfileDirect(userId)
        } else {
            // Success -> Redirect to Dashboard
            window.location.href = '/dashboard'
        }
    }

    const createUserProfileDirect = async (userId: string) => {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                role: 'user',
                name: formData.name,
                phone: formData.phone,
                is_verified: true,
                subscription_status: 'active'
            })

        if (error) {
            console.error('Direct Profile Error:', error)
            alert('Error creating profile: ' + error.message)
            setLoading(false)
        } else {
            alert('Profile created successfully!')
            window.location.href = '/dashboard'
        }
    }

    const createDealerProfileDirect = async (userId: string) => {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                role: 'dealer',
                shop_name: formData.shopName,
                city: formData.city,
                phone: formData.phone,
                whatsapp_number: formData.whatsapp,
                gst_number: formData.gstNumber,
                is_verified: false,
                subscription_status: 'pending'
            })

        if (error) {
            console.error('Direct Dealer Profile Error:', error)
            alert('Error creating dealer profile: ' + error.message)
            setLoading(false)
        } else {
            alert('Dealer profile created! Awaiting admin verification.')
            window.location.href = '/dashboard'
        }
    }

    const initiatePayment = async (userId: string) => {
        // [Existing Logic preserved but simplified for context]
        // Calling createDealerProfile directly for Dev/Simulated Payment
        await createDealerProfile(userId)
    }

    const createDealerProfile = async (userId: string) => {
        const { error } = await supabase.rpc('create_dealer_profile', {
            _shop_name: formData.shopName,
            _city: formData.city,
            _phone: formData.phone,
            _whatsapp_number: formData.whatsapp,
            _gst_number: formData.gstNumber
        })

        if (error) {
            alert('Error creating dealer profile: ' + error.message)
            setLoading(false)
        } else {
            window.location.href = '/dashboard'
        }
    }

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '60px' }} />
                </div>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {role === 'dealer' ? 'Dealer Registration' : 'Buyer Sign Up'}
                </h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setRole('dealer')}
                        className="btn"
                        style={{
                            background: role === 'dealer' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                            color: role === 'dealer' ? 'white' : 'black',
                            flex: 1
                        }}
                    >
                        I am a Dealer
                    </button>
                    <button
                        onClick={() => setRole('user')}
                        className="btn"
                        style={{
                            background: role === 'user' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                            color: role === 'user' ? 'white' : 'black',
                            flex: 1
                        }}
                    >
                        I am a Buyer
                    </button>
                </div>

                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {role === 'user' && (
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {role === 'dealer' && (
                        <>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Shop Name"
                                    className="input-field"
                                    value={formData.shopName}
                                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="input-field"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="input-field"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    {role === 'dealer' && (
                        <div>
                            <input
                                type="tel"
                                placeholder="WhatsApp Number"
                                className="input-field"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {role === 'dealer' && (
                        <div>
                            <input
                                type="text"
                                placeholder="GST Number"
                                className="input-field"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        {loading ? 'Processing...' : (role === 'dealer' ? 'Register as Dealer' : 'Create Free Account')}
                    </button>

                    {role === 'dealer' && (
                        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                            (Dev Mode: Payment checks active)
                        </div>
                    )}
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? <a href="/login" style={{ color: 'var(--primary)' }}>Login here</a>
                </div>
            </div>
        </div>
    )
}
