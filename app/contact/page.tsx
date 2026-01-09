import ContactForm from '@/components/ContactForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Safe Tech India | Support & Locations',
    description: 'Connect with Safe Tech India. Visit our hubs in Chennai, Coimbatore, Bangalore, and more. Buyer, Dealer, or Business support available.',
}

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Safe Tech India",
        "url": "https://safetechindia.org.in",
        "logo": "https://safetechindia.org.in/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+919600707601",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["en", "ta", "hi"]
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ritchie Street, Anna Salai",
            "addressLocality": "Chennai",
            "addressCountry": "IN"
        }
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="hero-section" style={{
                background: '#FDB813', // Yellow Theme
                color: '#1a1a1a', // Dark Text
                padding: '6rem 2rem 10rem',
                textAlign: 'center',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                position: 'relative'
            }}>
                {/* Decorative Pattern/Overlay could go here if needed, but keeping it clean for now */}

                <div className="container" style={{ maxWidth: '900px' }}>
                    <h1 style={{ color: '#1a1a1a', marginBottom: '1rem', fontSize: '3.5rem' }}>Let’s connect! We’re just a message away.</h1>
                    <p style={{ fontSize: '1.2rem', color: '#1a1a1a', maxWidth: '700px', margin: '0 auto', fontWeight: '500' }}>
                        Whether you are a buyer looking for a laptop or a dealer ready for the "Green Tick," our team is here to assist.
                    </p>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-6rem' }}>
                {/* User Segmentation Tiles */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    <SegmentTile
                        icon="🛒"
                        title="I am a Customer"
                        desc="I need help with a purchase or repair."
                        link="#contact-form"
                    />
                    <SegmentTile
                        icon="🤝"
                        title="I am a Dealer/Engineer"
                        desc="I want to join the 'Verified' network."
                        link="/register?type=dealer"
                    />
                    <SegmentTile
                        icon="🏢"
                        title="I am a Business"
                        desc="I have a bulk or corporate requirement."
                        link="#contact-form"
                    />
                </div>

                <div className="contact-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center' }}>

                    {/* Contact Form Section */}
                    <div id="contact-form" style={{ flex: '1 1 400px' }}>
                        <ContactForm />

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Other Ways to Reach Us</p>
                            <a href="mailto:support@safetechindia.org.in" style={{ color: 'var(--primary-dark)', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
                                ✉️ support@safetechindia.org.in
                            </a>
                            <p style={{ color: '#555' }}>📞 Support Hours: 10 AM - 7 PM</p>
                        </div>
                    </div>

                    {/* Locations Section */}
                    <div style={{ flex: '1 1 500px' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Our Presence</h2>

                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <LocationCity name="Chennai (HQ)" address="Ritchie Street, Anna Salai" isHq />
                            <LocationCity name="Coimbatore" address="Gandhipuram / 100 Feet Road" />
                            <LocationCity name="Bangalore" />
                            <LocationCity name="Delhi" />
                            <LocationCity name="Mumbai" />
                            <LocationCity name="Hyderabad" />
                            <LocationCity name="Pune" />
                        </div>

                        {/* Map (Placeholder for Chennai) */}
                        <div style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            height: '300px',
                            background: '#eee'
                        }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.633785233189!2d80.2691923153655!3d13.064560919313416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526610fc2b3f57%3A0xc3f6a29e92506e78!2sRitchie%20St%2C%20Chintadripet%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1677654321098!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SegmentTile({ icon, title, desc, link }: { icon: string, title: string, desc: string, link: string }) {
    return (
        <a href={link} className="glass-card" style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: '1px solid rgba(253, 184, 19, 0.3)' // Subtle yellow border
        }}>
            <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                background: 'rgba(253, 184, 19, 0.1)', // Light yellow bg for icon
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>{icon}</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{desc}</p>
        </a>
    )
}

function LocationCity({ name, address, isHq }: { name: string, address?: string, isHq?: boolean }) {
    return (
        <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.2rem', color: isHq ? 'var(--primary-dark)' : '#333' }}>
                {isHq && '📍 '}{name}
            </h4>
            {address && <p style={{ fontSize: '0.9rem', color: '#666' }}>{address}</p>}
        </div>
    )
}
