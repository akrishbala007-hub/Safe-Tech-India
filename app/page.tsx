import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'

// ... (Metadata stays same)

export const metadata: Metadata = {
  title: 'Safe Tech India | B2B & B2C Marketplace for Computer Dealers',
  description: 'India’s #1 Dedicated Marketplace for Computer Dealers & Wholesalers. Now supporting both B2B bulk orders and B2C retail sales with trust.',
  keywords: ['B2B Computer Marketplace', 'B2C Computer Marketplace India', 'Refurbished Laptop Wholesale', 'Safe Tech India Hardware', 'Computer Dealer Directory'],
}

// ... (Schema stays same)

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Safe Tech India",
  "url": "https://safetechindia.in",
  "logo": "https://safetechindia.in/logo.png",
  "description": "India’s #1 Dedicated Marketplace for Computer Dealers & Wholesalers.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9999999999",
    "contactType": "customer service"
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; city?: string }> }) {
  const supabase = await createClient() // Initialize server client
  const params = await searchParams
  const query = params.q || ''
  const city = params.city || ''

  let productQuery = supabase
    .from('products')
    .select('*, profiles!inner(shop_name, city, is_verified, whatsapp_number)')
    .eq('is_active', true)

  if (query) productQuery = productQuery.ilike('title', `% ${query}% `)
  if (city) productQuery = productQuery.ilike('profiles.city', `% ${city}% `)

  let { data: products } = await productQuery

  // Fetch Verified Dealers
  const { data: dealers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'dealer')
    .eq('is_verified', true)
    .limit(8)

  // Fetch Verified Service Engineers
  let { data: serviceEngineers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'service_engineer')
    .eq('is_verified', true)
    .limit(8)

  // --- DUMMY DATA FOR DEMO ---
  if (!products || products.length === 0) {
    products = [
      {
        id: 'dummy-1',
        title: 'MacBook Pro M1 2020 (8GB/256GB)',
        category: 'Laptop',
        condition: 'Refurbished Grade A',
        price: 65000,
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
        image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop',
        specs: { processor: 'i5 8th Gen', ram: '16GB', storage: '256GB SSD', warranty: '3 Months' },
        profiles: { shop_name: 'Chennai IT Hub', city: 'Chennai', is_verified: true, whatsapp_number: '917777777777' }
      }
    ]
  }

  // Dummy Service Engineers for demo
  if (!serviceEngineers || serviceEngineers.length === 0) {
    serviceEngineers = [
      {
        id: 'eng-1',
        name: 'Rajesh Kumar',
        city: 'Bangalore',
        pincode: '560001',
        phone: '9876543210',
        whatsapp_number: '919876543210',
        is_verified: true,
        role: 'service_engineer'
      },
      {
        id: 'eng-2',
        name: 'Amit Sharma',
        city: 'Delhi',
        pincode: '110001',
        phone: '9876543211',
        whatsapp_number: '919876543211',
        is_verified: true,
        role: 'service_engineer'
      },
      {
        id: 'eng-3',
        name: 'Priya Patel',
        city: 'Mumbai',
        pincode: '400001',
        phone: '9876543212',
        whatsapp_number: '919876543212',
        is_verified: true,
        role: 'service_engineer'
      },
      {
        id: 'eng-4',
        name: 'Vikram Singh',
        city: 'Chennai',
        pincode: '600001',
        phone: '9876543213',
        whatsapp_number: '919876543213',
        is_verified: true,
        role: 'service_engineer'
      }
    ]
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="home-hero" style={{
        padding: '10rem 1rem 4rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FDB813 0%, #FFCD00 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        {/* ... (Background SVG stays same) ... */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.12,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cg stroke='%23000' stroke-width='2' fill='none'%3E%3C!-- Horizontal Lines --%3E%3Cpath d='M50 100h150M250 100h100M400 100h150M600 100h150'/%3E%3Cpath d='M50 200h100M200 200h150M400 200h100M550 200h200'/%3E%3Cpath d='M100 300h150M300 300h200M550 300h150'/%3E%3Cpath d='M50 400h200M300 400h150M500 400h250'/%3E%3Cpath d='M100 500h150M300 500h100M450 500h200'/%3E%3C!-- Vertical Lines --%3E%3Cpath d='M100 50v100M100 200v150'/%3E%3Cpath d='M250 80v120M250 250v100'/%3E%3Cpath d='M400 50v150M400 250v200'/%3E%3Cpath d='M550 100v150M550 300v150'/%3E%3Cpath d='M700 80v170M700 300v150'/%3E%3C!-- Connection Points (Circles) --%3E%3Ccircle cx='100' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='200' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='250' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='400' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='550' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='700' cy='100' r='6' fill='%23000'/%3E%3Ccircle cx='100' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='200' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='350' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='400' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='550' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='250' cy='200' r='6' fill='%23000'/%3E%3Ccircle cx='100' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='250' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='300' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='500' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='550' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='700' cy='300' r='6' fill='%23000'/%3E%3Ccircle cx='100' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='250' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='300' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='450' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='500' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='750' cy='400' r='6' fill='%23000'/%3E%3Ccircle cx='100' cy='500' r='6' fill='%23000'/%3E%3Ccircle cx='250' cy='500' r='6' fill='%23000'/%3E%3Ccircle cx='300' cy='500' r='6' fill='%23000'/%3E%3Ccircle cx='400' cy='500' r='6' fill='%23000'/%3E%3Ccircle cx='450' cy='500' r='6' fill='%23000'/%3E%3Ccircle cx='650' cy='500' r='6' fill='%23000'/%3E%3C!-- Chip Rectangles --%3E%3Crect x='180' y='280' width='40' height='40' fill='none' stroke='%23000' stroke-width='2'/%3E%3Crect x='480' y='180' width='50' height='50' fill='none' stroke='%23000' stroke-width='2'/%3E%3Crect x='620' y='380' width='45' height='45' fill='none' stroke='%23000' stroke-width='2'/%3E%3Crect x='350' y='450' width='35' height='35' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
          {/* Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="Safe Tech India" style={{
              height: '220px',
              display: 'inline-block',
              filter: 'invert(1)',
              mixBlendMode: 'screen'
            }} />
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            marginBottom: '1rem',
            lineHeight: '1.1',
            color: '#1a1a1a',
            textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
            fontWeight: '900',
            letterSpacing: '-0.02em'
          }}>
            <span style={{ display: 'block', fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: '#2a2a2a', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              🇮🇳 India's #1 Dedicated
            </span>
            B2B & B2C Marketplace<br />
            for Verified Hardware
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            color: '#2a2a2a',
            marginBottom: '3rem',
            maxWidth: '900px',
            margin: '0 auto 3rem',
            fontWeight: '600',
            lineHeight: '1.6'
          }}>
            Stop Chasing Leads. Start Closing Deals.<br />
            Every Device Passed our <strong>30-Point Safe Tech Audit.</strong>
          </p>

          {/* Search Bar */}
          <form style={{
            maxWidth: '700px',
            margin: '0 auto 3rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'white',
            padding: '1rem',
            borderRadius: '60px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '3px solid #1a1a1a'
          }}>
            <input
              name="q"
              placeholder="Search laptops, components..."
              defaultValue={query}
              style={{
                flex: 1,
                minWidth: '250px',
                borderRadius: '50px',
                padding: '1rem 1.5rem',
                border: 'none',
                fontSize: '1.1rem',
                outline: 'none',
                background: 'transparent'
              }}
            />
            {/* Removed City Search as per request to hide specific dealer location browsing for now */}

            <button type="submit" className="search-btn" style={{
              borderRadius: '50px',
              padding: '1rem 2.5rem',
              background: '#1a1a1a',
              color: '#FDB813',
              fontWeight: '800',
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              🔍 Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="#products" className="cta-btn" style={{
              background: '#1a1a1a',
              color: '#FDB813',
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: '800',
              border: 'none',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s'
            }}>
              View Verified Live Stock
            </Link>
            <Link href="/service-engineer" className="cta-btn" style={{
              background: 'white',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              padding: '1.2rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}>
              Find Service Engineer
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Products (Search Results) - Moved to be Primary */}
      <div id="products" className="container" style={{ padding: '4rem 1rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          {query ? `Results for "${query}"` : 'Verified Live Inventory'}
        </h2>

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

      {/* Verified Service Engineers Section - Keeping this but moving down if needed, user only said 'hide dealer list' */}
      {serviceEngineers && serviceEngineers.length > 0 && (
        <section style={{ padding: '4rem 1rem', background: '#f8fafc' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>🛠️ Verified Service Engineers</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
              Professional IT service engineers verified by Safe Tech India. Available for repairs, maintenance, and technical support.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {serviceEngineers.map((engineer: any) => (
                <div key={engineer.id} className="glass-card" style={{ background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{engineer.name}</h3>
                    {engineer.is_verified && <span style={{ color: 'green', fontSize: '1.5rem' }}>✓</span>}
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 {engineer.city} - {engineer.pincode}</p>
                  {/* ... keeping rest ... */}
                  <Link
                    href="/login"
                    className="btn"
                    style={{
                      background: '#25D366',
                      color: 'white',
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      padding: '0.5rem',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    Login to Connect
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REMOVED DEALER LIST AS REQUESTED */}

      {/* Value Props Icons - Keeping as they support the trust message */}
      <section style={{ padding: '4rem 1rem', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
          <ValueProp icon="✅" title="30-Point Audit" desc="Every device quality checked." />
          <ValueProp icon="🛡️" title="7-Day Returns" desc="Full replacement guarantee." />
          <ValueProp icon="🚚" title="Insured Shipping" desc="BlueDart/DTDC secured." />
          <ValueProp icon="💳" title="Secure Payment" desc="UPI Manual Verify." />
        </div>
      </section>

      {/* NEW: Smart Catalog Showcase */}
      <section style={{ padding: '4rem 1rem', background: 'hsl(var(--input-bg))' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Not Just a Listing, But a Professional Catalog</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
            When you upload a product on Safe Tech India, we generate a professional Technical Specification Sheet for every item.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <FeatureCard title="High-Def Gallery" desc="Display your hardware from every angle." />
            <FeatureCard title="Spec-Check" desc="Automatic highlighting of key selling points (e.g., 'i7 Processor', 'SSD Upgraded')." />
            <FeatureCard title="Dealer Branding" desc="Your shop name and 'Green Tick' follow the user as they scroll." />
          </div>
        </div>
      </section>

      {/* NEW: Safe Tech India Protection Badge (Green Tick) */}
      <section style={{ padding: '4rem 1rem', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Why Join Safe Tech India?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem', width: '100%' }}>
              <div className="glass-card" style={{ textAlign: 'left', padding: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📈 Get B2B Leads</h3>
                <p>Connect with offices and schools for bulk orders. Manage high-volume inquiries with professional technical spec sheets generated automatically.</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'left', padding: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🤝 Sell B2C with Trust</h3>
                <p>When retail customers see your <strong>Green Tick</strong>, they buy without hesitating. Convert everyday buyers with your verified status.</p>
              </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>The "Safe Tech India" Protection Badge</h2>
            <div className="verified-badge" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem', marginBottom: '2rem' }}>
              Verified Dealer ✓
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', marginBottom: '3rem' }}>
              The Green Tick isn't just a symbol; it’s our promise to the buyer. To earn it, every dealer undergoes:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
              <InfoCard title="Business Proof" content="Submission of GSTIN or Udyam Registration." />
              <InfoCard title="Physical Presence" content="Verification of shops location via geo-tagged photos." />
              <InfoCard title="Performance Audit" content="We monitor dealer responsiveness. Buyers feel 10x more confident sending you bulk payments." />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Building: Refurbished Standard */}
      <section style={{ padding: '4rem 1rem', background: 'hsl(var(--input-bg))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Setting the Standard for Refurbished Tech</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            We solve the biggest problem: Quality Confusion. Every product follows our 3-Point Quality Protocol:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ flex: 1, minWidth: '200px' }}><h3>Visual Grade</h3><p>Clear A++, A, B grading.</p></div>
            <div className="glass-card" style={{ flex: 1, minWidth: '200px' }}><h3>Functional Test</h3><p>Battery, Keyboard, Ports checked.</p></div>
            <div className="glass-card" style={{ flex: 1, minWidth: '200px' }}><h3>Identity Guarantee</h3><p>Only GST-verified shops.</p></div>
          </div>
        </div>
      </section>

      {/* NEW: Market Insights */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Unlock the Secondary IT Market Potential</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                The refurbished IT market in India is growing at 25% annually. Small offices, schools, and startups are moving away from new expensive hardware.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <FeatureCard title="Fill Your Pipeline" desc="Get inquiries from Tier 2 & 3 cities where demand is booming." />
              <FeatureCard title="Reduce Dead Stock" desc="Have 50 old monitors? List them and find a bulk buyer in 48 hours." />
              <FeatureCard title="Wholesale Only" desc="We focus on B2B. No more time-wasters asking for a single mouse." />
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section style={{ padding: '5rem 1rem', background: 'hsl(var(--primary))', color: 'black' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>What You Get as a Verified Dealer</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Join the elite network of digital business owners.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>✅ <strong>Personalized Landing Page:</strong> verifiedit.in/your-shop</li>
              <li>✅ <strong>Verified Badge:</strong> The Green Tick authority.</li>
              <li>✅ <strong>Unlimited Listings:</strong> Upload your entire warehouse.</li>
              <li>✅ <strong>SEO Visibility:</strong> We rank you on Google.</li>
              <li>✅ <strong>Bulk RFQ Access:</strong> Get notified for 50+ unit orders.</li>
            </ul>
          </div>
          <div className="glass-card" style={{ background: 'white', textAlign: 'center' }}>
            <h3>Start Your Digital Showroom</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join 1000+ Dealers across India</p>
            <Link href="/register" className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem' }}>Register Now</Link>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>3 Steps to Grow</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <StepCard num="1" title="Register & Pay" desc="Fill details and pay membership fee." />
            <StepCard num="2" title="Get Verified" desc="Upload shop details. Get the Green Tick." />
            <StepCard num="3" title="Go Live" desc="Start receiving bulk WhatsApp inquiries." />
          </div>
        </div>
      </section>

      {/* NEW: FAQ Section */}
      <section style={{ padding: '4rem 1rem', background: 'hsl(var(--input-bg))' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FAQ question="Is there a membership fee?" answer="Yes! We have a small annual membership fee to verify serious dealers and maintain the platform quality." />
            <FAQ question="Can I list both New and Refurbished items?" answer="Yes. You can clearly mark your products as New, Refurbished, or Used." />
            <FAQ question="How many products can I upload?" answer="As a Verified Partner, you get unlimited listings. List 1 or 1,000—the price stays the same." />
            <FAQ question="Do you take a commission on my sales?" answer="Zero Commission. Your profit is yours. We only charge for the platform and the verification." />
          </div>
        </div>
      </section>

      <footer style={{ background: '#0a0a0a', color: '#888', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid #333', marginTop: 'auto' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            {/* Brand & About */}
            <div>
              <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Safe Tech India</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                India’s #1 Dedicated Marketplace for Computer Dealers & Wholesalers. Connecting verified buyers and sellers across the nation.
              </p>
              <div style={{ fontSize: '0.9rem' }}>
                <Link href="/about" style={{ color: '#888', marginRight: '1rem', textDecoration: 'underline' }}>About Us</Link>
                <Link href="/login" style={{ color: '#888', marginRight: '1rem', textDecoration: 'underline' }}>Login</Link>
                <Link href="/register" style={{ color: '#888', textDecoration: 'underline' }}>Register</Link>
              </div>
            </div>

            {/* Locations List */}
            <div>
              <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>📍 Partner Support Hubs</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.8rem', fontSize: '0.95rem' }}>
                {[
                  { city: 'Chennai', area: 'Ritchie Street / Mount Road' },
                  { city: 'Coimbatore', area: 'Gandhipuram / 100 Feet Road' },
                  { city: 'Bangalore', area: 'SP Road / MG Road' },
                  { city: 'Delhi', area: 'Nehru Place' },
                  { city: 'Mumbai', area: 'Lamington Road' },
                  { city: 'Hyderabad', area: 'Hitec City' },
                  { city: 'Pune', area: 'Tilak Road' }
                ].map(loc => (
                  <li key={loc.city} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                    <strong style={{ color: '#ccc' }}>{loc.city}</strong>
                    <span style={{ textAlign: 'right' }}>{loc.area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map View */}
            <div>
              <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>🌏 Map View</h4>
              <div style={{ width: '100%', height: '250px', background: '#222', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, opacity: 0.8, filter: 'invert(90%) hue-rotate(180deg)' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15555.987654!2d78.0!3d22.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fae854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
                  allowFullScreen
                  title="Partner Hubs Map"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <p>&copy; {new Date().getFullYear()} Safe Tech India. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.8rem' }}>
              Keywords: B2B & B2C Computer Marketplace India, Refurbished Laptop Wholesale, Retail Computer Deals.
            </p>
          </div>
        </div>
      </footer>
    </div >
  )
}

function ValueProp({ icon, title, desc }: any) {
  return (
    <div style={{ flex: '1 1 200px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  )
}

function FeatureCard({ title, desc }: any) {
  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{desc}</p>
    </div>
  )
}

function InfoCard({ title, content }: any) {
  return (
    <div style={{ padding: '1.5rem', background: 'hsl(var(--input-bg))', borderRadius: '12px', border: '1px solid hsl(var(--border-color))' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{content}</p>
    </div>
  )
}

function StepCard({ num, title, desc }: any) {
  return (
    <div className="glass-card" style={{ flex: '1 1 250px', textAlign: 'center' }}>
      <div style={{ width: '50px', height: '50px', background: 'hsl(var(--primary))', color: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', margin: '0 auto 1rem' }}>
        {num}
      </div>
      <h3>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  )
}

function HubTag({ name }: any) {
  return (
    <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', color: 'white', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)' }}>
      {name}
    </span>
  )
}

function FAQ({ question, answer }: any) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{question}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{answer}</p>
    </div>
  )
}
