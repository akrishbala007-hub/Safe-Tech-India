"use client"

import { useState } from 'react'
import Link from 'next/link'
import { X, Lock } from 'lucide-react'

export default function KnowledgeHub() {
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleReadClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowLoginModal(true)
    }

    return (
        <section style={{ padding: '6rem 1rem', background: '#f8f9fa' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', color: '#1a1a1a' }}>Become a Master Dealer: Insights & Trends</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '4rem' }}>Stay ahead of the curve with our expert guides.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Article 1 - Strategy */}
                    <ArticleCard
                        image="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"
                        category="Strategy"
                        title="How to price your refurbished laptops for maximum profit."
                        onRead={handleReadClick}
                    />

                    {/* Article 2 - Market Trends */}
                    <ArticleCard
                        image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
                        category="Market Trends"
                        title="The 2026 Laptop Market: Why 'Open-Box' is the new 'New'."
                        onRead={handleReadClick}
                    />

                    {/* Article 3 - Marketing */}
                    <ArticleCard
                        image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
                        category="Marketing"
                        title="5 WhatsApp Marketing secrets every computer dealer should know."
                        onRead={handleReadClick}
                    />
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'white', padding: '2.5rem', borderRadius: '24px',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{
                            width: '60px', height: '60px', background: '#FFF4E5', color: '#FDB813',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Lock size={30} />
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Dealer Exclusive Content</h3>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>
                            These market insights are reserved for Verified Dealers. Please login to access the full report.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link href="/login" style={{
                                background: '#1a1a1a', color: 'white', padding: '1rem', borderRadius: '12px',
                                fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem'
                            }}>
                                Login / Register Now
                            </Link>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                No thanks, maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

function ArticleCard({ image, category, title, onRead }: any) {
    return (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={onRead}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={image} alt={category} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="article-img" />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>{category}</span>
                <h3 style={{ fontSize: '1.3rem', margin: '0.5rem 0 1rem', color: '#1a1a1a', lineHeight: '1.4' }}>{title}</h3>
                <span style={{ color: '#007bff', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Read Article →
                </span>
            </div>
        </div>
    )
}
