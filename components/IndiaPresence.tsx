'use client'

import React from 'react'

const CityPin = ({ name, x, y, isHq }: { name: string, x: string, y: string, isHq?: boolean }) => (
    <div
        style={{
            position: 'absolute',
            left: x,
            top: y,
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease'
        }}
        className="city-pin"
    >
        <div style={{
            background: isHq ? '#ef4444' : '#000',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginBottom: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            border: '2px solid rgba(255,255,255,0.2)'
        }} className="city-label">
            {name}
        </div>
        <div style={{
            width: '14px',
            height: '14px',
            background: isHq ? '#ef4444' : '#000',
            borderRadius: '50%',
            border: '3px solid white',
            boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
        }} className="city-dot" />

        {isHq && (
            <div style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                background: 'rgba(239, 68, 68, 0.4)',
                borderRadius: '50%',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'pulse 2s infinite'
            }} />
        )}
    </div>
);

export default function IndiaPresence() {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '650px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            padding: '3rem 2rem',
            borderRadius: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.8)'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Our Presence</h2>

            <div style={{
                position: 'relative',
                width: '100%',
                height: '600px',
                verticalAlign: 'middle',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '24px',
                background: '#f8fafc'
            }}>
                {/* Clean User-Provided 3D Relief Map */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}>
                    <img
                        src="/india-3d-map.png"
                        alt="Safe Tech India 3D Presence Map"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />

                    {/* Interactive Pins Precisely Aligned to the Clean 3D Map */}
                    <CityPin name="Delhi" x="48%" y="30%" />
                    <CityPin name="Mumbai" x="35%" y="55%" />
                    <CityPin name="Pune" x="37%" y="57%" />
                    <CityPin name="Hyderabad" x="53%" y="58%" />
                    <CityPin name="Bangalore" x="47%" y="74%" />
                    <CityPin name="Chennai (HQ)" x="54%" y="75%" isHq />
                    <CityPin name="Coimbatore" x="43%" y="79%" />
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: translateX(-50%) scale(0.8); opacity: 0.8; }
                    100% { transform: translateX(-50%) scale(2.8); opacity: 0; }
                }
                .city-pin:hover .city-label {
                    transform: translateY(-5px) scale(1.1);
                    background: #FECC00 !important;
                    color: #000 !important;
                    box-shadow: 0 8px 20px rgba(254, 204, 0, 0.4) !important;
                }
                .city-pin:hover .city-dot {
                    transform: scale(1.3);
                    background: #FECC00 !important;
                }
            `}</style>
        </div>
    )
}
