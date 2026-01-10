
'use client'

import Link from 'next/link'

export default function ProductCard({ product }: { product: any }) {
    const whatsappUrl = `https://wa.me/${product.profiles.whatsapp_number}?text=Hi, I found your ${product.title} (ID: ${product.id}) on Verified IT. Is it available?`

    return (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Link href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '200px', background: '#222', position: 'relative' }}>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Image</div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                        {product.condition}
                    </div>
                    {/* Safe Tech Verified Badge (Green) */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#25D366', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                        <span>🛡️ Safe Tech Verified</span>
                    </div>
                </div>
            </Link>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.title}
                    </h3>
                </Link>

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
                    <div style={{ marginBottom: '1rem' }}>
                        {product.safe_tech_price && (
                            <div style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'line-through' }}>
                                ₹{Math.round(product.safe_tech_price * 1.1).toLocaleString()} {/* Fake retail price for effect if wanted, or just don't show */}
                            </div>
                        )}
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                            ₹{(product.safe_tech_price || product.price).toLocaleString()}
                            {product.safe_tech_price && <span style={{ fontSize: '0.8rem', color: '#25D366', marginLeft: '8px' }}>Safe Price</span>}
                        </div>
                    </div>

                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: '#25D366', color: 'white' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        Chat to Buy
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
