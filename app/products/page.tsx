import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string, c?: string }>
}) {
    const supabase = await createClient()
    const { q: query, c: selectedCategory } = await searchParams

    let productQuery = supabase
        .from('products')
        .select('*, profiles!inner(shop_name, city, is_verified, whatsapp_number)')
        .eq('is_active', true)

    if (query) productQuery = productQuery.ilike('title', `%${query}%`)
    if (selectedCategory) productQuery = productQuery.eq('category', selectedCategory)

    let { data: products } = await productQuery

    const categories = [
        { label: 'Refurbished laptops / Desktop', icon: '💻', value: 'Refurbished laptops / Desktop' },
        { label: 'Brand New laptops / Desktop', icon: '✨', value: 'Brand New laptops / Desktop' },
        { label: 'Computer accessories', icon: '✅', value: 'Computer accessories' },
        { label: 'RAM / SSD & Graphics Card', icon: '🛠', value: 'RAM / SSD & Graphics Card' }
    ]

    // --- DUMMY DATA FOR DEMO IF DB IS EMPTY ---
    if (!products || products.length === 0) {
        products = [
            {
                id: 'dummy-1',
                title: 'MacBook Pro M1 2020 (8GB/256GB)',
                category: 'Refurbished laptops / Desktop',
                condition: 'Refurbished Grade A',
                price: 65000,
                safe_tech_price: 65000,
                image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
                specs: { processor: 'M1', ram: '8GB', storage: '256GB SSD', warranty: '6 Months' },
                profiles: { shop_name: 'TechZone India', city: 'Bangalore', is_verified: true, whatsapp_number: '919999999999' }
            },
            {
                id: 'dummy-2',
                title: 'Dell Latitude 7400 | i7 8th Gen | Bulk Available',
                category: 'Refurbished laptops / Desktop',
                condition: 'Refurbished Grade A',
                price: 22500,
                safe_tech_price: 22500,
                image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop',
                specs: { processor: 'i7 8th Gen', ram: '16GB', storage: '512GB SSD', warranty: '1 Month Testing' },
                profiles: { shop_name: 'Lamington Wholesalers', city: 'Mumbai', is_verified: true, whatsapp_number: '919876543210' }
            },
            {
                id: 'dummy-3',
                title: 'Bluetooth Mechanical Keyboard RGB',
                category: 'Computer accessories',
                condition: 'New',
                price: 3500,
                safe_tech_price: 3200,
                image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop',
                specs: { type: 'Mechanical', switches: 'Blue', battery: '4000mAh' },
                profiles: { shop_name: 'PC Master', city: 'Delhi', is_verified: true, whatsapp_number: '918888888888' }
            }
        ]
        // Filter dummy data if needed
        if (selectedCategory) {
            products = products.filter(p => p.category === selectedCategory)
        }
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar />

            {/* Search Header Section */}
            <div style={{ background: '#0a0a0a', padding: '6rem 1rem 4rem', color: 'white', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Browse Verified Inventory
                    </h1>
                    <p style={{ color: '#aaa', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Find certified refurbished and brand new tech from verified dealers.
                    </p>

                    {/* Search Bar */}
                    <form action="/products" style={{ position: 'relative', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="Find i5 Laptops under ₹20,000..."
                            style={{
                                width: '100%',
                                padding: '1.5rem 2rem 1.5rem 3.5rem',
                                borderRadius: '100px',
                                border: 'none',
                                background: '#1c1c1c',
                                color: 'white',
                                fontSize: '1.1rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                outline: 'none'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                            🔍
                        </span>
                        <button type="submit" style={{
                            position: 'absolute',
                            right: '0.6rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#FECC00',
                            color: 'black',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}>Search</button>
                    </form>

                    {/* Quick Tabs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {categories.map((cat) => (
                            <Link
                                key={cat.value}
                                href={`/products?c=${cat.value}`}
                                style={{
                                    textDecoration: 'none',
                                    padding: '1.2rem',
                                    background: selectedCategory === cat.value ? '#FECC00' : '#1c1c1c',
                                    color: selectedCategory === cat.value ? 'black' : 'white',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease',
                                    border: selectedCategory === cat.value ? 'none' : '1px solid #333'
                                }}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '3rem 1rem 6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>
                        {selectedCategory ? selectedCategory : 'All Certified Items'}
                        <span style={{ fontSize: '1rem', color: '#666', marginLeft: '10px', fontWeight: '400' }}>
                            ({products.length} found)
                        </span>
                    </h2>
                    {selectedCategory && (
                        <Link href="/products" style={{ fontSize: '0.9rem', color: '#25D366', fontWeight: 'bold' }}>Clear Filter</Link>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    {products?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {products?.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center', gridColumn: '1/-1', background: 'white', borderRadius: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</h3>
                            <p style={{ color: '#666' }}>Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
