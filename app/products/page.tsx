
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const supabase = await createClient()
    const params = await searchParams
    const query = params.q || ''

    let productQuery = supabase
        .from('products')
        .select('*, profiles!inner(shop_name, city, is_verified, whatsapp_number)')
        .eq('is_active', true)

    if (query) productQuery = productQuery.ilike('title', `%${query}%`)

    let { data: products } = await productQuery

    // --- DUMMY DATA FOR DEMO ---
    if (!products || products.length === 0) {
        products = [
            {
                id: 'dummy-1',
                title: 'MacBook Pro M1 2020 (8GB/256GB)',
                category: 'Laptop',
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
                category: 'Laptop',
                condition: 'Refurbished Grade A',
                price: 22500,
                safe_tech_price: 22500,
                image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop',
                specs: { processor: 'i7 8th Gen', ram: '16GB', storage: '512GB SSD', warranty: '1 Month Testing' },
                profiles: { shop_name: 'Lamington Wholesalers', city: 'Mumbai', is_verified: true, whatsapp_number: '919876543210' }
            },
            {
                id: 'dummy-3',
                title: 'HP EliteDisplay 24" IPS Monitor',
                category: 'Monitor',
                condition: 'Refurbished Grade B',
                price: 4500,
                safe_tech_price: 4500,
                image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
                specs: { resolution: '1080p', panel: 'IPS', port: 'HDMI/DP', warranty: '1 Month' },
                profiles: { shop_name: 'Nehru Place Traders', city: 'Delhi', is_verified: true, whatsapp_number: '918888888888' }
            },
            {
                id: 'dummy-4',
                title: 'ThinkPad T480 Touchscreen | 50 Units',
                category: 'Laptop',
                condition: 'Refurbished Grade A+',
                price: 28000,
                safe_tech_price: 28000,
                image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop',
                specs: { processor: 'i5 8th Gen', ram: '16GB', storage: '256GB SSD', warranty: '3 Months' },
                profiles: { shop_name: 'Chennai IT Hub', city: 'Chennai', is_verified: true, whatsapp_number: '917777777777' }
            }
        ]
    }

    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '4rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Live Certified Inventory</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {products?.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1' }}>
                            No active listings found.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
