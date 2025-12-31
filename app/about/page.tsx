import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'About Safe Tech India | The Trust Layer of Indian IT Hardware',
    description: 'We are organizing India’s fragmented IT secondary market. Our mission is to empower dealers, buyers, and the planet through a verified, circular economy ecosystem.'
}

export default function AboutPage() {
    return (
        <div style={{ paddingBottom: '4rem', background: '#ffffff', color: '#1a1a1a', overflowX: 'hidden' }}>
            {/* Navigation Bar */}
            <Navbar />

            {/* Animated Explainer Section */}
            <section style={{
                background: 'linear-gradient(135deg, #FDB813 0%, #FFCD00 100%)',
                padding: '6rem 1rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="animated-text-container">
                        <h2 className="fade-in-up" style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: '800',
                            marginBottom: '3rem',
                            textAlign: 'center',
                            color: '#1a1a1a'
                        }}>
                            How Safe Tech India Works
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Step 1 */}
                            <div className="slide-in-left" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                borderLeft: '6px solid #1a1a1a',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>
                                    For Dealers: Get Verified
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a' }}>
                                    Computer dealers register on our platform with their GST, shop details, and business documents.
                                    Our team verifies every detail to ensure authenticity. Once approved, you get the prestigious
                                    <strong style={{ color: '#FDB813' }}> Green Tick ✓</strong> badge.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="slide-in-right" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                borderLeft: '6px solid #1a1a1a',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>
                                    List Your Inventory
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a' }}>
                                    Dealers upload their refurbished laptops, desktops, and IT hardware with detailed specifications,
                                    pricing, and warranty information. Our platform makes it easy to manage thousands of SKUs from
                                    your mobile or desktop.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="slide-in-left" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                borderLeft: '6px solid #1a1a1a',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>
                                    Buyers Search & Connect
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a' }}>
                                    Buyers search for specific products using our smart filters (RAM, SSD, Processor, etc.).
                                    They see only <strong>verified dealers</strong> with transparent pricing. Direct WhatsApp
                                    connection ensures quick communication—no middlemen, no delays.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="slide-in-right" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                borderLeft: '6px solid #1a1a1a',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>
                                    Trust-Based Transactions
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a' }}>
                                    Every transaction is backed by our verification system. Buyers get quality products with
                                    warranties. Dealers get genuine customers. We're building India's most trusted IT hardware
                                    marketplace—one verified deal at a time.
                                </p>
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div className="fade-in-up" style={{
                            textAlign: 'center',
                            marginTop: '4rem',
                            animation: 'fadeInUp 1s ease-out 2s both'
                        }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a', fontWeight: '800' }}>
                                Ready to Join the Revolution?
                            </h3>
                            <Link href="/register" style={{
                                display: 'inline-block',
                                padding: '1.2rem 3rem',
                                background: '#1a1a1a',
                                color: '#FDB813',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontSize: '1.2rem',
                                fontWeight: '800',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s'
                            }} className="cta-btn">
                                Get Started Today →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. Hero Section */}
            <div style={{
                position: 'relative',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FDB813 0%, #FFCD00 100%)',
                padding: '2rem'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        color: '#1a1a1a',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        India's Premier Verified Ecosystem for IT Hardware
                    </h1>
                    <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto 2rem', color: '#2a2a2a', fontWeight: '600' }}>
                        We aren't just a website; we are the "Trust Layer" of the Indian computer market.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/register" className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2rem', background: '#1a1a1a', color: '#FDB813', fontWeight: '700' }}>Get Your Business Verified</Link>
                        <Link href="/" className="btn" style={{ background: 'white', color: '#1a1a1a', fontSize: '1.2rem', padding: '1rem 2rem', border: '2px solid #1a1a1a' }}>Browse Trusted Products</Link>
                    </div>
                </div>
            </div>

            {/* 2. Our Origin */}
            <section className="container" style={{ padding: '6rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '1rem', fontWeight: '800' }}>Our Origin: The Problem We Solved</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a', marginBottom: '1.5rem' }}>
                        In the bustling IT hubs of India—from Nehru Place to Lamington Road—there has always been a gap. <strong style={{ color: '#1a1a1a' }}>Trust.</strong>
                    </p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3a3a3a' }}>
                        Small businesses needing 50 laptops and students looking for their first MacBook often faced the same nightmare: Unreliable sellers, fake listings, and hardware that fails after two days. We saw local, honest dealers getting lost in the noise of massive, unverified B2B directories.
                        <br /><br />
                        Safe Tech India was born to change that. We built a platform where only the best, KYC-verified dealers get to stand, marked by our signature <strong style={{ color: '#FDB813' }}>Green Tick ✓</strong>.
                    </p>
                </div>
            </section>

            {/* 3. Our Mission: Empowering the Next Billion Devices */}
            <section style={{ background: '#f8f8f8', padding: '6rem 1rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a', fontWeight: '800' }}>Our Mission <br /><span style={{ color: '#FDB813' }}>Empowering the Next Billion Devices</span></h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <MissionCard title="For Dealers" desc="Provide a professional digital identity and a direct line to bulk buyers for a cost less than a daily cup of tea." />
                                <MissionCard title="For Buyers" desc="Ensure that every 'Buy' or 'Inquiry' click leads to a legitimate, physical shop owner who stands behind their product." />
                                <MissionCard title="For the Planet" desc="Promote the 'Circular Economy' by making high-quality refurbished tech a reliable first choice for India’s digital growth." />
                            </div>
                        </div>
                        <div style={{ position: 'relative', height: '500px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 50px rgba(74, 222, 128, 0.2)' }}>
                            <img src="/images/circular_economy_tech.png" alt="Circular Economy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why We Are Different (The Verified Advantage) */}
            <section className="container" style={{ padding: '6rem 1rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', color: '#1a1a1a', fontWeight: '800' }}>The Verified Advantage</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <FeatureCard icon="🔍" title="Merchant Vetting" desc="We don't just take an email. We verify GST, ID, and Physical Shop presence." />
                    <FeatureCard icon="⚡" title="Technical Focus" desc="Our search engine understands RAM, SSD, and Processor Gen—not just 'Used Laptop'." />
                    <FeatureCard icon="🤝" title="Zero Brokerage" desc="We connect you directly to the source. No middleman, no hidden commissions." />
                    <FeatureCard icon="✅" title="The Green Tick" desc="A badge earned through transparency, ensuring 100% peace of mind." />
                </div>
            </section>

            {/* 5. Benefits for Partners */}
            <section style={{ background: '#f8f8f8', padding: '6rem 1rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', color: '#1a1a1a', fontWeight: '800' }}>Massive Benefits for Our Partners</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                        {/* B2B */}
                        <div className="glass-card" style={{ background: 'white', border: '3px solid #FDB813' }}>
                            <div style={{ height: '200px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src="/images/business_growth_india.png" alt="B2B Growth" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '1.5rem', fontWeight: '700' }}>For IT Dealers & Wholesalers (B2B)</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#3a3a3a' }}>
                                <li>🌍 <strong style={{ color: '#1a1a1a' }}>National Reach:</strong> Turn your local shop into a national brand.</li>
                                <li>🏭 <strong style={{ color: '#1a1a1a' }}>Bulk Sales Engine:</strong> Access specialized "RFQ" dashboard for bulk orders.</li>
                                <li>📦 <strong style={{ color: '#1a1a1a' }}>Inventory Management:</strong> Mobile-friendly dashboard for thousands of SKUs.</li>
                                <li>💰 <strong style={{ color: '#1a1a1a' }}>Cost-Effective Growth:</strong> Just ₹2,000/year for a 24/7 digital storefront.</li>
                            </ul>
                        </div>

                        {/* B2C */}
                        <div className="glass-card" style={{ background: 'white', border: '3px solid #FDB813' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '1.5rem', fontWeight: '700' }}>For Buyers & Professionals (B2C)</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#3a3a3a' }}>
                                <li>⭐ <strong style={{ color: '#1a1a1a' }}>Certified Quality:</strong> Standardized Grading System (A++, A, B).</li>
                                <li>💬 <strong style={{ color: '#1a1a1a' }}>Direct Communication:</strong> Chat directly with owners on WhatsApp. No bots.</li>
                                <li>🏷️ <strong style={{ color: '#1a1a1a' }}>Transparent Pricing:</strong> See both Retail and Wholesale prices transparently.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Founder Note */}
            <section className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', border: '3px solid #FDB813', borderRadius: '20px', background: 'white' }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a', fontWeight: '800' }}>Visionary Note from the Founder</h3>
                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '2rem', color: '#3a3a3a', lineHeight: '1.8' }}>
                        "I started Safe Tech India because I believe every Indian business deserves access to world-class technology without the fear of being cheated. We are building the future of the IT trade, one verified dealer at a time."
                    </p>
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '60px' }} />
                </div>
            </section >

        </div >
    )
}

function MissionCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div style={{ borderLeft: '4px solid #FDB813', paddingLeft: '1.5rem' }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#1a1a1a', fontWeight: '700' }}>{title}</h4>
            <p style={{ color: '#3a3a3a', lineHeight: '1.6' }}>{desc}</p>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', background: 'white', border: '2px solid #FDB813' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>{title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#3a3a3a' }}>{desc}</p>
        </div>
    )
}
