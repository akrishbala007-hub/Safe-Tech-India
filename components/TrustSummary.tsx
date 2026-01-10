
export default function TrustSummary({ metrics }: { metrics: any }) {
    // Default dummy metrics if not populated (for now)
    const data = metrics || {
        "Battery Health": "92%",
        "SSD Life": "98% Remaining",
        "Display Audit": "Zero Dead Pixels",
        "Thermal Audit": "Stable @ 65°C"
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(data).map(([key, value]: [string, any]) => (
                <div key={key} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>{key}</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                        {value} <span style={{ color: '#22c55e', marginLeft: '4px' }}>✓</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
