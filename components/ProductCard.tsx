
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

                {/* Dealer Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>{product.profiles.shop_name}</span>
                    {product.profiles.is_verified && <span className="verified-badge" style={{ fontSize: '0.7rem', padding: '2px 4px' }}>✓</span>}
                    <span>• {product.profiles.city}</span>
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

                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.549 1.992.839 3.033.839 3.18 0 5.765-2.587 5.766-5.766.001-3.18-2.585-5.766-5.766-5.766zm-12 5.766c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12c-3.168 0-6.046-1.226-8.15-3.232l-3.85 1.012 1.028-3.754c-2.28-2.26-3.702-5.385-3.702-8.986l-.026-.005z" /></svg>
                        Chat on WhatsApp
                    </a>
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
