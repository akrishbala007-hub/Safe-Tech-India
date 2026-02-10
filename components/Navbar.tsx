"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling DOWN and past 100px -> Hide
                    setIsVisible(false)
                } else {
                    // Scrolling UP -> Show
                    setIsVisible(true)
                }

                setLastScrollY(currentScrollY)
            }
        }

        window.addEventListener('scroll', controlNavbar)

        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [lastScrollY])

    return (
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
                padding: '0.5rem 1rem', // Reduced padding
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', height: '60px' }}>
                    {/* SVG logo needs explicitly w/h or contain fit to avoid stretching */}
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '100%', maxWidth: '200px', objectFit: 'contain' }} />
                </Link>

                {/* Navigation Links */}
                <div className="nav-links-desktop" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <Link href="/" style={navLinkStyle}>Home</Link>
                    <Link href="/products" style={navLinkStyle}>Products</Link>
                    <Link href="/service-engineer" style={navLinkStyle}>Service Engineers</Link>
                    <Link href="/about" style={navLinkStyle}>About Us</Link>
                    <Link href="/contact" style={navLinkStyle}>Contact Us</Link>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    <Link href="/login?role=admin" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginRight: '0.5rem'
                    }}>
                        Admin Login
                    </Link>
                    <Link href="/login" style={{
                        padding: '0.5rem 1rem',
                        background: 'white',
                        color: '#1a1a1a',
                        border: '2px solid #1a1a1a',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                    }}>
                        Login
                    </Link>
                    <Link href="/register" style={{
                        padding: '0.5rem 1rem',
                        background: '#FDB813',
                        color: '#1a1a1a',
                        border: '2px solid #FDB813',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                    }}>
                        Dealer Registration
                    </Link>
                </div>
            </div>
        </nav>
    )
}

const navLinkStyle = {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
}
