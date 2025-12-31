'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function ServiceEngineerLanding() {
    const router = useRouter()

    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1a1a1a' }}>
            {/* Navigation Bar */}
            <Navbar />
            {/* Engineering Pattern Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Hero Section with Circuit Board Design */}
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #FDB813 0%, #FFCD00 100%)', overflow: 'hidden' }}>
                {/* Circuit Lines Decoration */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath d='M0 300h200v-50h100v50h200v-100h100v100h200v50h100v-50h200' stroke='%23000' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='300' r='8' fill='%23000'/%3E%3Ccircle cx='400' cy='250' r='8' fill='%23000'/%3E%3Ccircle cx='600' cy='200' r='8' fill='%23000'/%3E%3Ccircle cx='800' cy='300' r='8' fill='%23000'/%3E%3Ccircle cx='1000' cy='250' r='8' fill='%23000'/%3E%3C/svg%3E")`,
                }} />

                <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Gear Icon */}
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: '900',
                        marginBottom: '1rem',
                        color: '#1a1a1a',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        lineHeight: '1.1'
                    }}>
                        Don't Just Find a Job—<br />Build an Empire.
                    </h1>
                    <div style={{
                        width: '100px',
                        height: '4px',
                        background: '#1a1a1a',
                        margin: '1.5rem auto',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '12px',
                            height: '12px',
                            background: '#1a1a1a',
                            borderRadius: '50%'
                        }} />
                    </div>
                    <p style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#2a2a2a' }}>
                        Join India's Most Trusted Network of On-Site IT Service Engineers
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', color: '#3a3a3a', maxWidth: '900px', margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
                        Being a service engineer is about more than just fixing motherboards; it's about being the go-to expert in your community.
                        At Safe Tech India, we don't just give you leads; we give you the foundation to run your own professional service business on your own terms.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => router.push('/register?type=service_engineer')}
                            style={{
                                padding: '1.2rem 3rem',
                                fontSize: '1.2rem',
                                background: '#1a1a1a',
                                color: '#FDB813',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            🚀 Join the Network Today
                        </button>
                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '1.2rem 3rem',
                                fontSize: '1.2rem',
                                background: 'white',
                                color: '#1a1a1a',
                                border: '2px solid #1a1a1a',
                                borderRadius: '8px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            How it Works
                        </button>
                    </div>
                </div>
            </div>

            {/* Benefits Section with Engineering Icons */}
            <div className="container" style={{ padding: '5rem 1rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '800', color: '#1a1a1a' }}>
                    Everything You Need to Run Your Service Business
                </h2>
                <div style={{ width: '60px', height: '3px', background: '#FDB813', margin: '0 auto 3rem' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {[
                        {
                            icon: '⏰',
                            title: 'Be the Master of Your Time',
                            desc: 'No more 9-to-5 grind in a crowded service center. Choose your hours, choose your area, and work when it suits you.',
                            accent: '#FDB813'
                        },
                        {
                            icon: '💎',
                            title: 'Unlock Unlimited Earning Potential',
                            desc: 'There are thousands of households and small offices in your city. Every single one of them owns technology that eventually needs service.',
                            accent: '#FFCD00'
                        },
                        {
                            icon: '🛡️',
                            title: 'The "Verified" Prestige',
                            desc: 'Imagine the pride of showing your digital Green Tick to a new client. It\'s a certificate of excellence that separates professionals from amateurs.',
                            accent: '#FDB813'
                        },
                        {
                            icon: '🚀',
                            title: 'Grow from Technician to Brand',
                            desc: 'Use our platform to collect 5-star reviews. As your reputation grows, you won\'t have to look for work—work will wait in line for you.',
                            accent: '#FFCD00'
                        },
                        {
                            icon: '📍',
                            title: 'Hyper-Local Lead Targeting',
                            desc: 'You choose your Pincodes. Receive alerts only from areas you can reach in 15–30 minutes.',
                            accent: '#FDB813'
                        },
                        {
                            icon: '💰',
                            title: 'Zero Commission - 100% Profit',
                            desc: 'We don\'t take a cut from your visiting fee or repair charges. What you earn stays with you.',
                            accent: '#FFCD00'
                        }
                    ].map((benefit, i) => (
                        <div key={i} style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            border: `3px solid ${benefit.accent}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)'
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(253,184,19,0.3)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                            }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>{benefit.icon}</div>
                            <div style={{
                                width: '40px',
                                height: '3px',
                                background: benefit.accent,
                                margin: '0 auto 1rem'
                            }} />
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700', textAlign: 'center' }}>{benefit.title}</h3>
                            <p style={{ color: '#4a4a4a', lineHeight: '1.7', textAlign: 'center' }}>{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works - Engineering Blueprint Style */}
            <div id="how-it-works" style={{ background: '#f8f8f8', padding: '5rem 1rem', position: 'relative' }}>
                {/* Blueprint Grid Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: 'linear-gradient(#FDB813 1px, transparent 1px), linear-gradient(90deg, #FDB813 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '800' }}>
                        Smart Work, Not Hard Work
                    </h2>
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
                        How the Pincode-Link System Works
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {[
                            { step: '1', title: 'Register & Join', desc: 'Sign up to become a Safe Tech India Service Partner and get your Green Tick.' },
                            { step: '2', title: 'Select Your Territory', desc: 'Tell us which Pincodes you cover (e.g., 600001, 600002).' },
                            { step: '3', title: 'Receive Leads', desc: 'When a user in your Pincode requests a repair, you get an instant notification.' },
                            { step: '4', title: 'Visit & Earn', desc: 'Coordinate with the user, provide the service, and collect your payment directly.' }
                        ].map((item) => (
                            <div key={item.step} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#FDB813',
                                    border: '4px solid #1a1a1a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: '900',
                                    margin: '0 auto 1.5rem',
                                    color: '#1a1a1a',
                                    boxShadow: '0 6px 16px rgba(253,184,19,0.4)'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', fontWeight: '700', color: '#1a1a1a' }}>{item.title}</h3>
                                <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container" style={{ padding: '5rem 1rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '800' }}>
                    One Platform, Multiple Income Streams
                </h2>
                <div style={{ width: '60px', height: '3px', background: '#FDB813', margin: '0 auto 3rem' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: '💻 Laptops & Desktops', items: ['Chip-level repair', 'Screen/Keyboard replacement', 'OS installation'] },
                        { title: '🌐 Networking', items: ['WiFi setup', 'LAN cabling', 'CCTV configuration'] },
                        { title: '⚡ Upgrades', items: ['SSD/RAM installation', 'Data Recovery', 'Performance tuning'] },
                        { title: '🖨️ Printers & Peripherals', items: ['Specialized repair', 'Home office equipment', 'Troubleshooting'] }
                    ].map((service, i) => (
                        <div key={i} style={{
                            background: 'white',
                            padding: '1.8rem',
                            borderRadius: '12px',
                            border: '2px solid #FDB813',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '700' }}>{service.title}</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {service.items.map((item, j) => (
                                    <li key={j} style={{ padding: '0.6rem 0', color: '#555', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: '#FDB813', marginRight: '0.5rem', fontSize: '1.2rem' }}>✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inspiring Quote Section */}
            <div style={{ background: 'linear-gradient(135deg, #FDB813 0%, #FFCD00 100%)', padding: '4rem 1rem', position: 'relative', overflow: 'hidden' }}>
                {/* Gear decorations */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '6rem', opacity: 0.1 }}>⚙️</div>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '6rem', opacity: 0.1 }}>⚙️</div>

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: '800', color: '#1a1a1a' }}>Build Your Future</h2>
                    <p style={{ fontSize: '1.4rem', lineHeight: '1.9', maxWidth: '900px', margin: '0 auto', fontStyle: 'italic', color: '#2a2a2a', fontWeight: '500' }}>
                        "The digital world is expanding, and every expansion needs an expert to maintain it.
                        Safe Tech India is the bridge between your expert hands and the people who need them most.
                        <strong style={{ color: '#1a1a1a' }}> Let's build your future together.</strong>"
                    </p>
                </div>
            </div>

            {/* FAQ */}
            <div className="container" style={{ padding: '5rem 1rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: '800' }}>FAQ for Engineers</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {[
                        { q: 'Do I need a physical shop?', a: 'No. Many of our top partners are freelance experts who provide doorstep service.' },
                        { q: 'How many leads will I get?', a: 'Leads depend on the demand in your selected Pincodes. Being "Verified" puts you at the top of the list when a user searches.' },
                        { q: 'Can I change my Pincodes later?', a: 'Yes, you can update your service area anytime through your Engineer Dashboard.' }
                    ].map((faq, i) => (
                        <div key={i} style={{
                            background: 'white',
                            padding: '1.8rem',
                            marginBottom: '1rem',
                            borderRadius: '12px',
                            borderLeft: '5px solid #FDB813',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#1a1a1a', fontWeight: '700' }}>Q: {faq.q}</h3>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>A: {faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div style={{ background: '#1a1a1a', padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#FDB813', fontWeight: '800' }}>
                        Ready to be the most trusted Engineer in your area?
                    </h2>
                    <p style={{ fontSize: '1.3rem', marginBottom: '2rem', color: '#ffffff', opacity: 0.9 }}>
                        Get Your Green Tick Today.
                    </p>
                    <button
                        onClick={() => router.push('/register?type=service_engineer')}
                        style={{
                            padding: '1.3rem 3.5rem',
                            fontSize: '1.3rem',
                            background: '#FDB813',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(253,184,19,0.4)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🔧 Start Building Your Empire
                    </button>
                    <p style={{ marginTop: '1.5rem', color: '#FDB813', fontSize: '1rem', fontWeight: '600' }}>
                        Join the digital revolution of Ritchie Street and beyond!
                    </p>
                </div>
            </div>
        </div>
    )
}
