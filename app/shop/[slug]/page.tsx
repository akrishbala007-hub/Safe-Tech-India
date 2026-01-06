'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function ShopPage() {
    const params = useParams()
    const router = useRouter()
    const slugOrId = params.slug as string

    const [dealer, setDealer] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        const fetchShopData = async () => {
            if (!slugOrId) return

            setLoading(true)
            try {
                // Determine if input is a valid UUID
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)

                let query = supabase.from('profiles').select('*')

                if (isUuid) {
                    query = query.eq('id', slugOrId)
                } else {
                    query = query.eq('slug', slugOrId)
                }

                const { data: profile, error: profileError } = await query.single()

                if (profileError) {
                    console.error('Supabase profile fetch error:', profileError)
                    throw profileError
                }

                if (!profile) {
                    console.warn('No profile found for:', slugOrId)
                    setLoading(false)
                    return
                }

                setDealer(profile)

                // Check current user ownership
                const { data: { user } } = await supabase.auth.getUser()
                if (user && user.id === profile.id) {
                    setIsOwner(true)
                }

                // 2. Fetch Dealer Products
                const { data: prods, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('dealer_id', profile.id)
                    .order('created_at', { ascending: false })

                if (productsError) throw productsError
                setProducts(prods || [])

            } catch (error) {
                console.error('Error fetching shop data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchShopData()
    }, [slugOrId])

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
            <h2>Loading Shop...</h2>
        </div>
    )

    if (!dealer) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Shop Not Found 😕</h2>
            <button onClick={() => router.push('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Go Home
            </button>
        </div>
    )

    return (
        <div>
            {/* Owner Controls */}
            {isOwner && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 100
                }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn btn-primary"
                        style={{
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            border: '2px solid white'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            )}

            {/* Hero Section */}
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

                {/* Safe Tech India Badge */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    border: '1px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    fontSize: '0.9rem'
                }}>
                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>🛡️</span>
                    <span>Safe Tech India Verified</span>
                </div>

                <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>

                    {/* Safe Tech India Logo - Inverted to remove white bg */}
                    <img
                        src="/logo.png"
                        alt="Safe Tech India"
                        style={{
                            width: '200px',
                            marginBottom: '2rem',
                            filter: 'invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.2))',
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Avatar */}
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        overflow: 'hidden', margin: '0 auto 1.5rem',
                        border: '4px solid var(--primary)',
                        background: '#222'
                    }}>
                        <img
                            src={dealer.avatar_url || 'https://via.placeholder.com/150?text=Shop'}
                            alt={dealer.shop_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>
                        {dealer.shop_name || 'Verified Partner'}
                        {dealer.is_verified && <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontSize: '1.5rem' }} title="Verified">✓</span>}
                    </h1>

                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '500' }}>
                        {dealer.address ? `📍 ${dealer.address}, ${dealer.city}` : dealer.city}
                    </p>

                    {dealer.description && (
                        <p style={{ color: '#ccc', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            {dealer.description}
                        </p>
                    )}

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        {dealer.instagram_link && <SocialBtn href={dealer.instagram_link} icon={<InstagramIcon />} label="Instagram" />}
                        {dealer.facebook_link && <SocialBtn href={dealer.facebook_link} icon={<FacebookIcon />} label="Facebook" />}
                        {dealer.youtube_link && <SocialBtn href={dealer.youtube_link} icon={<YoutubeIcon />} label="YouTube" />}
                        {dealer.whatsapp_number && <SocialBtn href={`https://wa.me/${dealer.whatsapp_number}`} icon={<WhatsAppIcon />} label="WhatsApp" />}
                    </div>

                    {/* Contact Bar & Share */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            display: 'inline-flex', gap: '2rem', background: 'rgba(255,255,255,0.05)',
                            padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {dealer.phone && <span>📞 {dealer.phone}</span>}
                            {dealer.whatsapp_number && <span>📱 {dealer.whatsapp_number}</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    const text = `Check out ${dealer.shop_name} on Safe Tech India!`;
                                    const url = window.location.href;

                                    if (navigator.share) {
                                        navigator.share({ title: dealer.shop_name, text: text, url: url })
                                            .catch(console.error);
                                    } else {
                                        // Fallback
                                        navigator.clipboard.writeText(url);
                                        alert('Shop link copied to clipboard!');
                                    }
                                }}
                                className="btn"
                                style={{
                                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                    color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer'
                                }}
                            >
                                <ShareIcon /> Share Shop
                            </button>

                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${dealer.shop_name} on Safe Tech India: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1.5rem', borderRadius: '50px', textDecoration: 'none'
                                }}
                            >
                                <WhatsAppIcon /> Share via Whatsapp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Section */}
            <div className="container" style={{ padding: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>
                    Available Inventory <span style={{ color: 'var(--primary)', fontSize: '1rem', verticalAlign: 'middle' }}>({products.length})</span>
                </h2>

                {products.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '1.2rem' }}>No products listed currently.</p>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-container">
                                    <img
                                        src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
                                        alt={product.title}
                                        className="product-image"
                                    />
                                    <span className="condition-badge">{product.condition}</span>
                                </div>
                                <div className="product-content">
                                    <div className="product-category">{product.category}</div>
                                    <h3 className="product-title">{product.title}</h3>
                                    <div className="product-price">₹{product.price.toLocaleString()}</div>

                                    {/* Simple contact button for product inquiry */}
                                    <a
                                        href={`https://wa.me/${dealer.whatsapp_number || dealer.phone}?text=Hi, I am interested in ${product.title} listed on Safe Tech India.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}
                                    >
                                        Enquire Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const SocialBtn = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
        style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', textDecoration: 'none',
            transition: 'transform 0.2s',
            backdropFilter: 'blur(5px)'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
        {icon}
    </a>
)

// Icons
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
)
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)
const YoutubeIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.46 19c1.72.46 8.54.46 8.54.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
)
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
)
const ShareIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
)
