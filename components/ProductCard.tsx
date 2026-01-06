
'use client'

import Link from 'next/link'

export default function ProductCard({ product }: { product: any }) {
    const whatsappUrl = `https://wa.me/${product.profiles.whatsapp_number}?text=Hi, I found your ${product.title} (ID: ${product.id}) on Verified IT. Is it available?`

    return (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: '200px', background: '#222', position: 'relative' }}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Image</div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {product.condition}
                </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                </h3>

                {/* Dealer Info - Shop Name Blurred */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span style={{ filter: 'blur(4px)', userSelect: 'none', opacity: 0.7 }}>{product.profiles.shop_name}</span>
                    {product.profiles.is_verified && <span className="verified-badge" style={{ fontSize: '0.7rem', padding: '2px 4px' }}>✓</span>}
                    <span>{product.profiles.city}</span>
                </div>

                {/* Specs Snippet */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {product.specs.processor && <span style={tagStyle}>{product.specs.processor}</span>}
                    {product.specs.ram && <span style={tagStyle}>{product.specs.ram}</span>}
                    {product.specs.storage && <span style={tagStyle}>{product.specs.storage}</span>}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        ₹{product.price.toLocaleString()}
                    </div>

                    <Link href="/login" className="btn btn-whatsapp" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        Login to Chat
                    </Link>
                </div>
            </div>
        </div>
    )
}

const tagStyle = {
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
}
