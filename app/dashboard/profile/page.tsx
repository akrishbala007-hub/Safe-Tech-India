'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfileEditor() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    const [form, setForm] = useState({
        shop_name: '',
        description: '',
        address: '',
        city: '',
        phone: '',
        whatsapp_number: '',
        gst_number: '',
        avatar_url: '',
        hero_url: '',
        instagram_link: '',
        facebook_link: '',
        youtube_link: ''
    })

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: prof, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return
            }

            if (prof) {
                setProfile(prof)
                setForm({
                    shop_name: prof.shop_name || '',
                    description: prof.description || '',
                    address: prof.address || '',
                    city: prof.city || '',
                    phone: prof.phone || '',
                    whatsapp_number: prof.whatsapp_number || '',
                    gst_number: prof.gst_number || '',
                    avatar_url: prof.avatar_url || '',
                    hero_url: prof.hero_url || '',
                    instagram_link: prof.instagram_link || '',
                    facebook_link: prof.facebook_link || '',
                    youtube_link: prof.youtube_link || ''
                })
            }
        }
        getProfile()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'hero_url') => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${field}_${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('products').getPublicUrl(filePath)
            setForm(prev => ({ ...prev, [field]: data.publicUrl }))

        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('profiles')
            .update({
                shop_name: form.shop_name,
                description: form.description,
                address: form.address,
                city: form.city,
                phone: form.phone,
                whatsapp_number: form.whatsapp_number,
                // gst_number is usually immutable, but allowing edit if needed
                avatar_url: form.avatar_url,
                hero_url: form.hero_url,
                instagram_link: form.instagram_link,
                facebook_link: form.facebook_link,
                youtube_link: form.youtube_link
            })
            .eq('id', profile.id)

        if (error) {
            alert('Error updating profile: ' + error.message)
        } else {
            alert('Profile updated successfully!')
            router.push('/dashboard')
        }
        setLoading(false)
    }

    if (!profile) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Edit Profile</h1>
                    <button
                        onClick={() => {
                            const path = profile.role === 'service_engineer'
                                ? `/engineer/${profile.slug || profile.id}`
                                : `/shop/${profile.slug || profile.id}`
                            router.push(path)
                        }}
                        className="btn"
                        style={{ background: '#333', fontSize: '0.9rem' }}
                    >
                        View Public Page ↗
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Basic Info */}
                    <Section title="Basic Information">
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
                            <div style={{ flex: '0 0 150px', textAlign: 'center' }}>
                                <div style={{
                                    width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden',
                                    background: '#333', marginBottom: '1rem', border: '2px solid #555'
                                }}>
                                    {form.avatar_url ? (
                                        <img src={form.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                            No Photo
                                        </div>
                                    )}
                                </div>
                                <label className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem', cursor: 'pointer', display: 'block' }}>
                                    {uploading ? 'Uploading...' : 'Change Photo'}
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar_url')} disabled={uploading} />
                                </label>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>{profile.role === 'dealer' ? 'Shop Name' : 'Full Name'}</label>
                                    <input
                                        type="text"
                                        required
                                        style={inputStyle}
                                        value={form.shop_name} // We reuse shop_name column for Engineer Name in profiles table logic
                                        onChange={e => setForm({ ...form, shop_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>{profile.role === 'dealer' ? 'About Us' : 'Bio / Experience'}</label>
                                    <textarea
                                        rows={4}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder={profile.role === 'dealer' ? "Tell customers about your shop..." : "Describe your skills and experience..."}
                                    />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Contact & Address */}
                    <Section title="Contact & Location">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    style={inputStyle}
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>WhatsApp Number</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    value={form.whatsapp_number}
                                    onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Address</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder="Full street address"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input
                                    type="text"
                                    required
                                    style={inputStyle}
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            {profile.role === 'dealer' && (
                                <div>
                                    <label style={labelStyle}>GST Number</label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        value={form.gst_number}
                                        disabled
                                        title="Contact support to change GST"
                                    />
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* Social Links */}
                    <Section title="Social Media">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Instagram Profile URL</label>
                                <input
                                    type="url"
                                    style={inputStyle}
                                    value={form.instagram_link}
                                    onChange={e => setForm({ ...form, instagram_link: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Facebook Page URL</label>
                                <input
                                    type="url"
                                    style={inputStyle}
                                    value={form.facebook_link}
                                    onChange={e => setForm({ ...form, facebook_link: e.target.value })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>YouTube Channel URL</label>
                                <input
                                    type="url"
                                    style={inputStyle}
                                    value={form.youtube_link}
                                    onChange={e => setForm({ ...form, youtube_link: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </Section>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || uploading}
                        style={{ marginTop: '1rem', padding: '1rem' }}
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="btn"
                        style={{ background: 'transparent', border: '1px solid #ccc', color: 'inherit' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{title}</h3>
        {children}
    </div>
)

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'hsl(var(--input-bg))',
    border: '1px solid hsl(var(--border-color))',
    borderRadius: '8px',
    color: 'hsl(var(--primary-dark))',
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none'
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
}
