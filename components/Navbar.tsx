"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false)
                } else {
                    setIsVisible(true)
                }

                setLastScrollY(currentScrollY)
            }
        }

        window.addEventListener('scroll', controlNavbar)
        return () => window.removeEventListener('scroll', controlNavbar)
    }, [lastScrollY])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <style jsx global>{`
                @media (max-width: 768px) {
                    .nav-links-desktop { display: none !important; }
                    .nav-actions-desktop { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
                @media (min-width: 769px) {
                    .mobile-menu-btn { display: none !important; }
                    .mobile-drawer { display: none !important; }
                }
            `}</style>

            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 999,
                background: 'white',
                borderBottom: '3px solid #FDB813',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out',
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 1rem',
                    height: '80px'
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', height: '100%' }}>
                        <img src="/logo.png" alt="Safe Tech India" style={{ height: '60px', objectFit: 'contain' }} />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="nav-links-desktop" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <Link href="/" style={navLinkStyle}>Home</Link>
                        <Link href="/products" style={navLinkStyle}>Products</Link>
                        <Link href="/service-engineer" style={navLinkStyle}>Service Engineers</Link>
                        <Link href="/about" style={navLinkStyle}>About Us</Link>
                        <Link href="/contact" style={navLinkStyle}>Contact Us</Link>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="nav-actions-desktop" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <Link href="/login?role=admin" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', marginRight: '0.5rem' }}>Admin Login</Link>
                        <Link href="/login" style={loginBtnStyle}>Login</Link>
                        <Link href="/register" style={registerBtnStyle}>Dealer Registration</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        <Menu size={32} color="#1a1a1a" />
                    </button>
                </div>
            </nav>

            {/* Mobile Side Drawer Overlay */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 10000,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setIsMobileMenuOpen(false)}>

                    {/* Drawer Content */}
                    <div style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0,
                        width: '80%', maxWidth: '300px', background: 'white',
                        padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem',
                        boxShadow: '-5px 0 20px rgba(0,0,0,0.1)',
                        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Menu</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={28} color="#1a1a1a" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Link href="/" style={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                            <Link href="/products" style={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                            <Link href="/service-engineer" style={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Service Engineers</Link>
                            <Link href="/about" style={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                            <Link href="/contact" style={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link href="/login" style={{ ...loginBtnStyle, textAlign: 'center', width: '100%', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                            <Link href="/register" style={{ ...registerBtnStyle, textAlign: 'center', width: '100%', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Dealer Registration</Link>
                            <Link href="/login?role=admin" style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }} onClick={() => setIsMobileMenuOpen(false)}>Admin Login</Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const navLinkStyle = {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
}

const mobileNavLinkStyle = {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.2rem',
    display: 'block'
}

const loginBtnStyle = {
    padding: '0.5rem 1rem',
    background: 'white',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center'
}

const registerBtnStyle = {
    padding: '0.5rem 1rem',
    background: '#FDB813',
    color: '#1a1a1a',
    border: '2px solid #FDB813',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center'
}
