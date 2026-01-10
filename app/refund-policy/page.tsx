
export default function RefundPolicy() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>The Safe Tech 7-Day "Peace of Mind" Policy</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>7-Day Replacement</h2>
                <p>If the device delivered does not match the Digital Audit Report provided during the sale (e.g., lower battery health than stated, or hardware defects not mentioned), you are eligible for a replacement or a full refund.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Conditions for Return</h2>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                    <li>The "Safe Tech Verified" tamper-proof seal must be intact.</li>
                    <li>No physical damage, liquid spills, or unauthorized opening of the device by the user.</li>
                    <li>The device must be returned with the original charger provided.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Process</h2>
                <p>To initiate a return, the user must contact our support via WhatsApp within 7 days of delivery.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Refund Timeline</h2>
                <p>Once the device is received and the internal "Safe Tech Seal" is verified, the refund will be processed within 48 business hours via UPI.</p>
            </section>
        </div>
    )
}
