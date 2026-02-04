
export default function RefundPolicy() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Refund & Cancellation Policy</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Non-Refundable</h2>
                <p>The Dealer Registration fee of ₹499 is a one-time annual service fee and is non-refundable once the digital dashboard has been activated.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Cancellation</h2>
                <p>Dealers can choose not to renew their subscription at the end of the 1-year period. No auto-debits will occur without dealer consent.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Disputes</h2>
                <p>In case of a double-payment due to technical error, the duplicate amount will be refunded to the original payment source within 7-10 working days.</p>
            </section>
        </div>
    )
}
