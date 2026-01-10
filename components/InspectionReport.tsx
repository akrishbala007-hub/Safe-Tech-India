
export default function InspectionReport({ data }: { data: any }) {
    if (!data) return null;

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ Safe Tech 30-Point Audit Report
                <span style={{ fontSize: '0.8rem', background: '#e6fffa', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Passed</span>
            </h3>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {Object.entries(data).map(([category, items]: [string, any]) => (
                    <div key={category}>
                        <h4 style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {category}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
                            {Object.entries(items).map(([item, passed]) => (
                                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: passed ? '#1a1a1a' : '#aaa' }}>
                                    <span style={{ color: passed ? '#25D366' : '#ccc' }}>
                                        {passed ? '✅' : '⚪'}
                                    </span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
                This device was physically inspected by Safe Tech Verified Partners.
            </div>
        </div>
    )
}
