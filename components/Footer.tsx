import Link from 'next/link'

export default function Footer() {
    return (
        <footer style={{
            background: '#0f0c29',
            color: 'white',
            padding: '4rem 1rem 2rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    textAlign: 'center'
                }}>
                    {/* Brand */}
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Safe Tech India</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                            India's #1 Dedicated B2B & B2C Marketplace for Computer Dealers
                        </p>
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <a href="https://www.instagram.com/indiasafetech/" target="_blank" rel="noopener noreferrer" style={socialIconStyle} aria-label="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61586450992405" target="_blank" rel="noopener noreferrer" style={socialIconStyle} aria-label="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.youtube.com/@safetechindia" target="_blank" rel="noopener noreferrer" style={socialIconStyle} aria-label="YouTube">
                            <YouTubeIcon />
                        </a>
                        <a href="https://www.linkedin.com/company/111211089/admin/dashboard/" target="_blank" rel="noopener noreferrer" style={socialIconStyle} aria-label="LinkedIn">
                            <LinkedInIcon />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        width: '100%',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.4)'
                    }}>
                        © {new Date().getFullYear()} Safe Tech India. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}

const socialIconStyle = {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s ease',
    textDecoration: 'none'
}

// Icons
const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
)

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)

const YouTubeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
)

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
)
