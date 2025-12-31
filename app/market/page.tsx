import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import PostRequirementModal from '@/components/PostRequirementModal'
import ServiceRequestModal from '@/components/ServiceRequestModal'

export default async function MarketPage({ searchParams }: { searchParams: { q?: string; city?: string } }) {
    const query = searchParams.q || ''
    const city = searchParams.city || ''

    // 1. Fetch Verified Dealers
    const { data: dealers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'dealer')
        .eq('is_verified', true)

    // 2. Fetch Products
    let productQuery = supabase
        .from('products')
        .select('*, profiles!inner(shop_name, city, is_verified, whatsapp_number)')
        .eq('is_active', true)

    if (query) productQuery = productQuery.ilike('title', `%${query}%`)
    if (city) productQuery = productQuery.ilike('profiles.city', `%${city}%`)

    let { data: products } = await productQuery

    // Demo Fallback
    if (!products || products.length === 0) {
        // Use empty array or dummy if preferred, but for Market page, active live data is better.
        // Keeping dummy for consistency if empty
        products = []
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Marketplace Header */}
            <header style={{ background: '#111', color: 'white', padding: '2rem 1rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/logo.png" alt="Safe Tech India" style={{ height: '50px', objectFit: 'contain' }} />
                        </Link>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link href="/dashboard" className="btn" style={{ background: '#333', color: 'white', fontSize: '0.9rem' }}>Dashboard</Link>
                            {/* Logout would be handled by client component ideally, but simplest is Link to auth/logout route or just keep it simple */}
                        </div>
                    </div>
                    <h1 style={{ marginTop: '2rem', textAlign: 'center' }}>B2B & B2C Marketplace</h1>

                    {/* Search Bar */}
                    <form style={{ maxWidth: '600px', margin: '2rem auto 0', display: 'flex', gap: '0.5rem' }}>
                        <input
                            name="q"
                            placeholder="Search products..."
                            defaultValue={query}
                            className="input-field"
                            style={{ flex: 1, borderRadius: '4px', padding: '0.8rem' }}
                        />
                        <input
                            name="city"
                            placeholder="City"
                            defaultValue={city}
                            className="input-field"
                            style={{ width: '150px', borderRadius: '4px', padding: '0.8rem' }}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
            </header>

            <div className="container" style={{ marginTop: '2rem' }}>
                {/* Post Requirement CTA */}
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, #111 0%, #222 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Can't find what you need? 🕵️‍♂️</h2>
                        <p style={{ opacity: 0.8, maxWidth: '500px' }}>Post your specific requirement for laptops, bulk orders, or parts. Our verified dealers will contact you directly!</p>
                    </div>
                    <div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ServiceRequestModal />
                            <PostRequirementModal />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '3rem' }}>

                {/* Section 1: Verified Dealers */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                        Verified Dealers ({dealers?.length || 0})
                    </h2>

                    {dealers && dealers.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {dealers.map((dealer: any) => (
                                <div key={dealer.id} className="glass-card" style={{ background: 'white', border: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            🏪
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{dealer.shop_name}</h3>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{dealer.city}</div>
                                        </div>
                                        {dealer.is_verified && <span style={{ marginLeft: 'auto', color: 'green', fontSize: '1.2rem' }}>✓</span>}
                                    </div>

                                    <a
                                        href={`https://wa.me/${dealer.whatsapp_number}`}
                                        target="_blank"
                                        className="btn"
                                        style={{ background: '#25D366', color: 'white', width: '100%', textAlign: 'center', display: 'block' }}
                                    >
                                        Message Dealer
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>No verified dealers found.</p>
                    )}
                </section>

                {/* Section 2: Live Inventory */}
                <section>
                    <h2 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                        Live Inventory
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {products?.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {products?.length === 0 && (
                            <p style={{ color: '#666' }}>No products listed matching your search.</p>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}
