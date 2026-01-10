import Link from 'next/link'

export default function Navbar() {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            background: 'white',
            borderBottom: '3px solid #FDB813',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="Safe Tech India" style={{ height: '85px' }} />
                </Link>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <Link href="/" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }} className="nav-link">
                        Home
                    </Link>
                    <Link href="/products" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }} className="nav-link">
                        Products
                    </Link>
                    <Link href="/service-engineer" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }} className="nav-link">
                        Service Engineers
                    </Link>
                    <Link href="/about" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }} className="nav-link">
                        About Us
                    </Link>
                    <Link href="/contact" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }} className="nav-link">
                        Contact Us
                    </Link>
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
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginRight: '0.5rem'
                    }}>
                        Admin Login
                    </Link>
                    <Link href="/login" style={{
                        padding: '0.6rem 1.2rem',
                        background: 'white',
                        color: '#1a1a1a',
                        border: '2px solid #1a1a1a',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }} className="nav-btn">
                        Login
                    </Link>
                    <Link href="/register" style={{
                        padding: '0.6rem 1.2rem',
                        background: '#FDB813',
                        color: '#1a1a1a',
                        border: '2px solid #FDB813',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }} className="nav-btn-primary">
                        Dealer Registration
                    </Link>
                </div>
            </div>
        </nav>
    )
}
