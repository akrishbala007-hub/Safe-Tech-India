import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InspectionReport from '@/components/InspectionReport'
import TrustSummary from '@/components/TrustSummary'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*, profiles(shop_name, city)')
        .eq('id', id)
        .single()

    if (!product) {
        return {
            title: 'Product Not Found | Safe Tech India',
        }
    }

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${product.title} - ${product.condition} | Safe Tech India`,
        description: `Buy verified ${product.title} (${product.condition}) from ${product.profiles?.shop_name} in ${product.profiles?.city}. ${product.specs?.processor || ''} ${product.specs?.ram || ''}. Safe Tech Verified.`,
        openGraph: {
            title: `${product.title} | Safe Tech India`,
            description: `Buy verified ${product.title} from ${product.profiles?.shop_name}. Safe Tech Verified Device.`,
            images: [product.image_url || '/logo.png', ...previousImages], // Prefer product image
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()

    if (!product) {
        return <div>Product not found</div>
    }

    // --- DUMMY DATA FALLBACK FOR DEMO (If DB is empty) ---
    const demoInspectionData = {
        "Physical & Cosmetic": { "Body Integrity": true, "Hinge Tension": true, "Screen Condition": true, "Keyboard": true, "Trackpad": true },
        "Internal Hardware": { "Battery Health": true, "SSD Health": true, "Wi-Fi/Bluetooth": true, "Thermal Check": true },
        "Power & Charging": { "Adapter Originality": true, "Charging Port": true, "Battery Backup": true },
        "Software & Performance": { "OS Authenticity": true, "Stress Test": true, "Boot Time": true }
    }

    // Use real data if available, otherwise show demo data for visual verification
    const inspectionData = (product.inspection_data && Object.keys(product.inspection_data).length > 0)
        ? product.inspection_data
        : demoInspectionData

    return (
        <div>
            <Navbar />

            <div className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                    {/* Left: Images */}
                    <div>
                        <div style={{ aspectRatio: '4/3', background: '#222', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Image</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'inline-block', background: '#25D366', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                🛡️ Safe Tech Verified
                            </div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.title}</h1>
                            <p style={{ color: '#666' }}>Provided by: <strong>{product.profiles?.shop_name}</strong> ({product.profiles?.city})</p>
                        </div>

                        <TrustSummary metrics={product.trust_metrics} />

                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>
                                ₹{(product.safe_tech_price || product.price).toLocaleString()}
                            </div>
                            <a
                                href={`https://wa.me/${product.profiles?.whatsapp_number || ''}?text=Hi, I found your ${product.title} (ID: ${product.id}) on Verified IT. Is it available?`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: '#25D366',
                                    color: 'white',
                                    padding: '1rem 2rem',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Chat to Buy
                            </a>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Specifications</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {Object.entries(product.specs || {}).map(([key, val]: [string, any]) => (
                                    <div key={key} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                        <span style={{ color: '#888', textTransform: 'capitalize' }}>{key}: </span>
                                        <strong>{val}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Report Full Width */}
                <div style={{ marginTop: '4rem' }}>
                    <InspectionReport data={inspectionData} />
                </div>

            </div>

            <Footer />
        </div>
    )
}
