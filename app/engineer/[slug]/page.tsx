'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function EngineerPage() {
    const params = useParams()
    const slugOrId = params.slug as string
    const [engineer, setEngineer] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchEngineerData = async () => {
            try {
                // Determine if input is a UUID or a Slug
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)

                let query = supabase.from('profiles').select('*')

                if (isUuid) {
                    query = query.eq('id', slugOrId)
                } else {
                    query = query.eq('slug', slugOrId) // Requires slug column on profiles
                }

                // Also ensure role is service_engineer (or dealer/admin acting as one? strictly service_engineer for this page)
                query = query.eq('role', 'service_engineer')

                const { data: profile, error: profileError } = await query.single()

                if (profileError) throw profileError
                if (!profile) throw new Error("Engineer not found")

                setEngineer(profile)
            } catch (err: any) {
                console.error("Error fetching engineer:", err)
                setError(err.message || 'Failed to load engineer profile.')
            } finally {
                setLoading(false)
            }
        }

        if (slugOrId) {
            fetchEngineerData()
        }
    }, [slugOrId])

    if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>Loading Profile...</div>
    if (error) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center', color: 'red' }}>{error}</div>
    if (!engineer) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>Engineer not found.</div>

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header / Hero */}
            <div style={{
                background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
                padding: '6rem 2rem 4rem',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Logo Watermark */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'url(/logo.png) center/contain no-repeat',
                    opacity: 0.1,
                    pointerEvents: 'none',
                    zIndex: 0,
                    filter: 'invert(1)',
                    mixBlendMode: 'screen'
                }} />

                <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                    {/* Safe Tech India Logo */}
                    <img
                        src="/logo.png"
                        alt="Safe Tech India"
                        style={{
                            width: '150px',
                            marginBottom: '2rem',
                            filter: 'invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.2))',
                            mixBlendMode: 'screen'
                        }}
                    />

                    <div style={{
                        width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden',
                        border: '4px solid white', margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        background: '#fff'
                    }}>
                        <img
                            src={engineer.avatar_url || 'https://via.placeholder.com/150?text=Engineer'}
                            alt={engineer.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white', fontWeight: '800' }}>
                        {engineer.name}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
                        🔧 Certified Service Engineer
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                        📍 {engineer.city}
                    </p>
                    {/* Status Badge */}
                    <div style={{ marginTop: '1rem' }}>
                        <span style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '50px',
                            background: engineer.is_verified ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            color: engineer.is_verified ? '#4ade80' : '#aaa',
                            border: `1px solid ${engineer.is_verified ? '#4ade80' : '#aaa'}`,
                            fontSize: '0.9rem'
                        }}>
                            {engineer.is_verified ? '✅ Verified Engineer' : '⏳ Verification Pending'}
                        </span>
                    </div>

                </div>
            </div>

            {/* Content Section */}
            <div className="container" style={{ maxWidth: '800px', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
                <div className="glass-card" style={{ padding: '2rem' }}>

                    {/* Bio / About */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', color: '#111' }}>About Me</h2>
                        <p style={{ lineHeight: '1.6', color: '#555' }}>
                            {engineer.description || "I am a professional service engineer registered with Safe Tech India, dedicated to providing high-quality repair and maintenance services for your tech devices."}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', color: '#111' }}>Contact Information</h2>
                        <div style={{ display: 'grid', gap: '1rem', color: '#333' }}>
                            {engineer.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📞</span>
                                    <span>{engineer.phone}</span>
                                </div>
                            )}
                            {engineer.address && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                                    <span>{engineer.address}, {engineer.city} - {engineer.pincode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                        {engineer.whatsapp_number && (
                            <a
                                href={`https://wa.me/${engineer.whatsapp_number}?text=Hi ${engineer.name}, I found your profile on Safe Tech India.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.8rem 1.5rem', borderRadius: '50px', textDecoration: 'none', flex: 1, justifyContent: 'center'
                                }}
                            >
                                <WhatsAppIcon /> Chat on WhatsApp
                            </a>
                        )}
                        {engineer.phone && (
                            <a
                                href={`tel:${engineer.phone}`}
                                className="btn"
                                style={{
                                    background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.8rem 1.5rem', borderRadius: '50px', textDecoration: 'none', flex: 1, justifyContent: 'center'
                                }}
                            >
                                📞 Call Now
                            </a>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
)
