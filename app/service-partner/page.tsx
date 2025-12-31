import Link from 'next/link'

export const metadata = {
    title: 'Become a Verified Service Partner | Verified IT',
    description: 'Join India’s premier network of computer hardware engineers. Get leads, build trust, and grow your service business.'
}

export default function ServicePartnerPage() {
    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
            {/* Hero */}
            <header style={{
                position: 'relative',
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(/images/service_engineer_hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Turn Your Skill into a <span style={{ color: '#3b82f6' }}>Business</span>
                    </h1>
                    <p style={{ fontSize: '1.5rem', color: '#ccc', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                        Join Verified IT as a Service Partner. Note: We strictly onboard experienced engineers who can handle chip-level repairs.
                    </p>
                    <Link href="/register?type=service_engineer" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                        Join Now - ₹2,000/Year
                    </Link>
                </div>
            </header>

            {/* Benefits */}
            <section className="container" style={{ padding: '6rem 1rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why Join Us?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <BenefitCard
                        icon="🔧"
                        title="Direct Repair Leads"
                        desc="Get service requests from verified buyers in your pincode. Motherboard issues, screen replacement, and more."
                    />
                    <BenefitCard
                        icon="✅"
                        title="Authorized Badge"
                        desc="Stand out from local repair shops with the Verified IT Service Partner badge."
                    />
                    <BenefitCard
                        icon="💰"
                        title="Zero Commission"
                        desc="We don't take a cut from your repair fees. You deal directly with the customer."
                    />
                </div>
            </section>

            {/* How it Works */}
            <section style={{ background: '#111', padding: '6rem 1rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>How It Works</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                        <Step number="1" title="Register" desc="Sign up and complete your profile payment." />
                        <Step number="2" title="Get Verified" desc="Our team verifies your ID and technical expertise." />
                        <Step number="3" title="Receive Tickets" desc="Admin assigns nearby tickets to your dashboard." />
                        <Step number="4" title="Earn" desc="Visit/Fix and get paid directly by the client." />
                    </div>
                </div>
            </section>
        </div>
    )
}

function BenefitCard({ icon, title, desc }: any) {
    return (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: '#aaa' }}>{desc}</p>
        </div>
    )
}

function Step({ number, title, desc }: any) {
    return (
        <div style={{ maxWidth: '250px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>{number}</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ color: '#666' }}>{desc}</p>
        </div>
    )
}
