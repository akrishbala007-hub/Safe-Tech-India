import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import KnowledgeHub from '@/components/KnowledgeHub'

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; city?: string }> }) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params.q || ''
  const city = params.city || ''

  let productQuery = supabase
    .from('products')
    .select('*, profiles!inner(shop_name, city, is_verified, whatsapp_number)')
    .eq('is_active', true)

  if (query) productQuery = productQuery.ilike('title', `%${query}%`)
  if (city) productQuery = productQuery.ilike('profiles.city', `%${city}%`)

  let { data: products } = await productQuery

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

  // Dummy Verified Dealers for the marquee/list
  const featuredDealers = [
    { name: 'TechZone India', city: 'Bangalore' },
    { name: 'Lamington Wholesalers', city: 'Mumbai' },
    { name: 'Chennai IT Hub', city: 'Chennai' },
    { name: 'Nehru Place Traders', city: 'Delhi' },
    { name: 'Pune Laptops', city: 'Pune' },
    { name: 'Silicon Valley Hyd', city: 'Hyderabad' }
  ]

  return (
    <div>
      <Navbar />

      {/* 1. HERO SECTION */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .hero-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
      `}</style>
      <section style={{
        background: '#FECC00', // Brand Yellow
        color: '#1a1a1a',
        padding: '0 0 6rem',
        textAlign: 'center',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Subtle Texture Overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', paddingTop: '8rem', paddingLeft: '1rem', paddingRight: '1rem' }}>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            marginBottom: '1rem',
            lineHeight: '1.1',
            color: '#1a1a1a',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            India’s Premier <span style={{ color: '#fff', textShadow: '2px 2px 0px #000' }}>Digital Ecosystem</span><br /> for Computer Dealers.
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: '#333',
            marginBottom: '2.5rem',
            maxWidth: '800px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
            fontWeight: '500',
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
          }}>
            Empowering Authorized Retailers and Refurbished Specialists with the tools to dominate the local market.
            <br />
            <strong style={{ background: '#000', color: '#FECC00', padding: '0.2rem 0.8rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.5rem' }}>Join the network for ₹499/Year.</strong>
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem',
            animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
          }}>
            <Link href="/register" style={{
              background: '#000',
              color: '#FECC00', // High contrast
              padding: '1.2rem 3rem',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '1.2rem',
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
              border: '2px solid #000'
            }}>
              Register My Shop Now
            </Link>
            <Link href="#ecosystem" style={{
              border: '2px solid #000',
              color: '#000',
              padding: '1.2rem 3rem',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1.2rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              background: 'transparent'
            }}>
              View Live Ecosystem
            </Link>
          </div>

          {/* 4-Section Split Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
            animation: 'fadeInUp 1s ease-out 0.6s backwards'
          }}>
            {/* Card 1: Laptops */}
            <div className="hero-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ height: '180px', overflow: 'hidden', borderRadius: '15px', marginBottom: '1rem' }}>
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
                  alt="Laptops" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Business Laptops</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Bulk deals on Latitude & ThinkPads</p>
            </div>

            {/* Card 2: Desktops */}
            <div className="hero-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ height: '180px', overflow: 'hidden', borderRadius: '15px', marginBottom: '1rem' }}>
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
                  alt="Desktops" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Workstations</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>High-performance Editing Rigs</p>
            </div>

            {/* Card 3: Graphic Cards */}
            <div className="hero-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ height: '180px', overflow: 'hidden', borderRadius: '15px', marginBottom: '1rem' }}>
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                  alt="Components" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Components</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>GPUs, RAM & SSDs</p>
            </div>

            {/* Card 4: Accessories */}
            <div className="hero-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ height: '180px', overflow: 'hidden', borderRadius: '15px', marginBottom: '1rem' }}>
                <img src="https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&w=600&q=80"
                  alt="Accessories" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Accessories</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Monitors, Docks & More</p>
            </div>
          </div>

          {/* Verified Dealers Marquee/Strip */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Trusted By Top Dealers In</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.9 }}>
              {featuredDealers.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontWeight: '600', color: '#222' }}>{d.name}</span>
                  <span style={{ fontSize: '0.8rem', background: '#fff', color: '#000', padding: '2px 8px', borderRadius: '4px', border: '1px solid #ddd' }}>{d.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 THE PULSE (LIVE ECOSYSTEM TRACKER) */}
      <section style={{ padding: '4rem 1rem', background: '#111', color: 'white', borderTop: '1px solid #222' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FECC00', textShadow: '0 0 10px rgba(254, 204, 0, 0.5)' }}>500+</h3>
              <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Dealers</p>
            </div>
            <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FECC00', textShadow: '0 0 10px rgba(254, 204, 0, 0.5)' }}>12,400+</h3>
              <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Laptops Listed</p>
            </div>
            <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FECC00', textShadow: '0 0 10px rgba(254, 204, 0, 0.5)' }}>₹1.2 Cr+</h3>
              <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Inventory Value</p>
            </div>
            <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#25D366', textShadow: '0 0 10px rgba(37, 211, 102, 0.5)' }}>89%</h3>
              <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Faster Closure</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE "ECOSYSTEM" PILLARS */}
      <section id="ecosystem" style={{ padding: '6rem 1rem', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>The Ecosystem</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Four core values that make this more than just a website.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <PillarCard
              icon="🌐"
              title="Digital Storefront"
              desc="Your own professional business URL (e.g., safetechindia.org.in/your-shop) to showcase your stock 24/7."
            />
            <PillarCard
              icon="📲"
              title="Direct Lead Engine"
              desc="No middleman. Every customer inquiry lands directly in your WhatsApp inbox."
            />
            <PillarCard
              icon="✅"
              title="Trust Framework"
              desc="Use our 30-Point Audit to turn 'Used' stock into 'Verified Refurbished' assets."
            />
            <PillarCard
              icon="🤝"
              title="B2B Trade Network"
              desc="Access hidden dealer-to-dealer pricing to buy and sell stock within the community."
            />
          </div>
        </div>
      </section>

      {/* 2.5 SAFETECH 30-POINT AUDIT */}
      <section style={{ padding: '6rem 1rem', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ background: '#e6f4ea', color: '#1e8e3e', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.9rem' }}>TRUST FRAMEWORK</span>
            <h2 style={{ fontSize: '2.5rem', margin: '1rem 0', color: '#1a1a1a' }}>Not Just Listed. <span style={{ color: '#25D366' }}>Verified.</span></h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>Every "Verified" laptop on our platform undergoes a rigorous inspection.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Physical */}
            <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🛠️ Physical Sync</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Hinge tension check</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Keyboard tactile feel</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Port connectivity test</li>
              </ul>
            </div>

            {/* Internal */}
            <div style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '2px solid #FECC00', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#FECC00', padding: '2px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>CRITICAL</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚙️ Internal Health</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Battery cycle count</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>SSD health & speed</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>RAM stress test</li>
              </ul>
            </div>

            {/* Display */}
            <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🖥️ Display Quality</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Dead pixel check</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Brightness uniformity</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', color: '#555' }}>Color accuracy</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', background: '#fff9c4', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #fbc02d' }}>
            <strong>💡 Dealer Tip:</strong> Use our audit checklist to increase your machine's value by up to 20%.
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE SAFETECH INDIA? */}
      <section style={{ padding: '6rem 1rem', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>Designed for Dealers. Built for Trust.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            <FeatureRow
              title="Zero Commission Sales"
              desc="We don't take a cut. You pay the annual fee; you keep 100% of your profits."
            />
            <FeatureRow
              title="Smart-Spec Auto-Fill"
              desc="Save hours of typing. Enter the model name (e.g., 'Dell Latitude 7490'), and our database pulls the technical specs automatically."
            />
            <FeatureRow
              title="Local SEO Power"
              desc="We optimize your listings so you show up #1 when customers search for 'Laptops near me' in Coimbatore, Chennai, and beyond."
            />
            <FeatureRow
              title="Phygital Advantage"
              desc="Combine your physical shop's trust with our digital reach. Customers can 'Reserve Online' and 'Pick up in Store.'"
            />
          </div>
        </div>
      </section>

      {/* 3.5 THE DIGITAL SHOWROOM */}
      <section style={{ padding: '6rem 1rem', background: '#f0f2f5' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: '1 1 400px' }}>
              <span style={{ color: '#007bff', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR SHOP. YOUR BRAND.</span>
              <h2 style={{ fontSize: '3rem', margin: '1rem 0 2rem', lineHeight: '1.1', color: '#1a1a1a' }}>Stop sending blurry photos on WhatsApp.</h2>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>🔍 Instant Search</h4>
                <p style={{ color: '#666' }}>Let customers filter your stock by price, brand, or processor.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>📋 Professional Specs</h4>
                <p style={{ color: '#666' }}>Every listing includes a full, clean spec sheet generated automatically.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>🚀 Share Everywhere</h4>
                <p style={{ color: '#666' }}>One-click sharing to WhatsApp Status, Instagram, and Facebook.</p>
              </div>

              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'inline-block', color: '#555', fontFamily: 'monospace' }}>
                safetechindia.org.in/sagar-electronics-cbe
              </div>
            </div>

            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              {/* Phone Mockup Placeholder */}
              <div style={{
                width: '300px',
                height: '600px',
                background: '#1a1a1a',
                borderRadius: '40px',
                border: '8px solid #333',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}>
                {/* Screen Content */}
                <div style={{ background: 'white', height: '100%', width: '100%', overflow: 'hidden' }}>
                  <div style={{ height: '60px', background: '#FECC00', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Sagar Electronics</div>
                    <div style={{ width: '20px', height: '2px', background: 'black' }}></div>
                  </div>
                  <div style={{ padding: '1rem', overflowY: 'auto', height: 'calc(100% - 60px)' }}>
                    {/* Product 1 */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ height: '150px', borderRadius: '10px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80" alt="Laptop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Dell Latitude 7490 i5</div>
                      <div style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>₹24,500</div>
                    </div>

                    {/* Product 2 */}
                    <div>
                      <div style={{ height: '150px', borderRadius: '10px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80" alt="Monitor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>HP EliteDisplay 24"</div>
                      <div style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>₹4,500</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ONE PLATFORM. EVERY GRADE OF TECH. */}
      <section style={{ padding: '6rem 1rem', background: 'white', color: '#1a1a1a' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: '#000' }}>One Platform. Every Grade of Tech.</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '4rem' }}>A balanced approach for all business types.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* New & Authorized */}
            <div style={{
              background: '#f8f9fa',
              padding: '3rem 2rem',
              borderRadius: '24px',
              border: '1px solid #eee',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ color: '#000', marginBottom: '2rem', fontSize: '1.8rem', borderBottom: '3px solid #FECC00', display: 'inline-block', paddingBottom: '0.5rem' }}>New & Authorized Retail</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <ListItem title="Official Catalogs" desc="Display the latest 2026 releases from Top Brands." textColor="#333" descColor="#666" />
                <ListItem title="Brand Integrity" desc="Maintain official pricing while capturing local digital leads." textColor="#333" descColor="#666" />
                <ListItem title="Showroom Growth" desc="Drive online traffic to your physical storefront for demos." textColor="#333" descColor="#666" />
              </ul>
            </div>

            {/* Verified Refurbished */}
            <div style={{
              background: '#f8f9fa',
              padding: '3rem 2rem',
              borderRadius: '24px',
              border: '1px solid #eee',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ color: '#000', marginBottom: '2rem', fontSize: '1.8rem', borderBottom: '3px solid #25D366', display: 'inline-block', paddingBottom: '0.5rem' }}>Verified Refurbished Sales</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <ListItem title="Value Proposition" desc="Highlight high-performance business laptops at consumer prices." textColor="#333" descColor="#666" />
                <ListItem title="Verification Badge" desc="Use the SafeTech seal to prove hardware health." textColor="#333" descColor="#666" />
                <ListItem title="Eco-Friendly Tech" desc="Position your business as a leader in sustainable electronics." textColor="#333" descColor="#666" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 B2B WHOLESALER CORNER */}
      <section style={{ padding: '6rem 1rem', background: '#0f172a', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ background: '#1e293b', padding: '1rem 2rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem', border: '1px solid #334155' }}>
                <span style={{ color: '#38bdf8' }}>WHOLESALE HUB ACCESS</span>
              </div>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.1', color: '#fff' }}>Need Stock? <br /><span style={{ color: '#38bdf8' }}>Move Bulk. Move Fast.</span></h2>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: '1.6' }}>
                Are you a small shop looking for 10 units of ThinkPads? Or a wholesaler looking to clear 500 units of Dell Latitudes?
              </p>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: '#38bdf8', width: '4px', height: '100%' }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Bulk Pricing</h4>
                    <p style={{ color: '#94a3b8' }}>View dealer-only bulk rates not visible to the public.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: '#38bdf8', width: '4px', height: '100%' }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Inter-City Logistics</h4>
                    <p style={{ color: '#94a3b8' }}>Connect with verified transport partners to move stock safely across India.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: '#38bdf8', width: '4px', height: '100%' }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Inventory Exchange</h4>
                    <p style={{ color: '#94a3b8' }}>Swap your slow-moving stock with other dealers in the ecosystem.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                  <span>Dell Latitude 7490 (Grade A)</span>
                  <span style={{ color: '#38bdf8' }}>150 Units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                  <span>Lenovo T480s (Grade B)</span>
                  <span style={{ color: '#38bdf8' }}>85 Units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                  <span>HP EliteBook 840 G5 (New)</span>
                  <span style={{ color: '#38bdf8' }}>42 Units</span>
                </div>
                <button style={{ width: '100%', background: '#38bdf8', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>View All Bulk Listings</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW TO JOIN THE ECOSYSTEM */}
      <section style={{ padding: '6rem 1rem', background: '#FECC00' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem', color: '#1a1a1a' }}>3 Simple Steps to Join</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <StepCard num="1" title="Claim Your URL" desc="Register your business and select your custom shop link." />
            <StepCard num="2" title="Activate License" desc="Pay the ₹499 annual fee to unlock unlimited inventory uploads." />
            <StepCard num="3" title="Go Live" desc="Upload photos from your phone and start receiving direct WhatsApp inquiries." />
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/register" style={{
              background: '#1a1a1a',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '1.2rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* 5.5 KNOWLEDGE HUB (SEO) */}
      <KnowledgeHub />

      {/* 6. FAQ */}
      <section style={{ padding: '6rem 1rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FAQItem
              q="Is SafeTech a retail shop?"
              a="No, we are a digital ecosystem providing technology and marketing tools to independent dealers."
            />
            <FAQItem
              q="How long does the ₹499 license last?"
              a="It is valid for one full year and includes all platform updates."
            />
            <FAQItem
              q="Can I manage my stock from a mobile phone?"
              a="Yes, the Dealer Dashboard is 100% mobile-responsive for easy on-the-go uploads."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// Inline Components for Landing Page
function PillarCard({ icon, title, desc }: any) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      textAlign: 'left',
      transition: 'transform 0.2s',
      border: '1px solid #eee'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1a1a1a' }}>{title}</h3>
      <p style={{ color: '#666', lineHeight: '1.6' }}>{desc}</p>
    </div>
  )
}

function FeatureRow({ title, desc }: any) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{
        background: '#FECC00',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        marginTop: '8px',
        flexShrink: 0
      }}></div>
      <div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>{desc}</p>
      </div>
    </div>
  )
}

function ListItem({ title, desc, textColor = 'white', descColor = '#aaa' }: any) {
  return (
    <li style={{ marginBottom: '1.5rem' }}>
      <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.2rem', color: textColor }}>{title}</strong>
      <span style={{ color: descColor, fontSize: '0.95rem' }}>{desc}</span>
    </li>
  )
}

function StepCard({ num, title, desc }: any) {
  return (
    <div style={{
      background: 'white',
      color: '#1a1a1a',
      padding: '2rem',
      borderRadius: '16px',
      flex: '1 1 250px',
      textAlign: 'center',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        width: '50px', height: '50px', background: '#1a1a1a', color: '#FECC00',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '900', fontSize: '1.5rem', margin: '0 auto 1.5rem'
      }}>
        {num}
      </div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: '#555' }}>{desc}</p>
    </div>
  )
}

function FAQItem({ q, a }: any) {
  return (
    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{q}</h4>
      <p style={{ color: '#666' }}>{a}</p>
    </div>
  )
}
