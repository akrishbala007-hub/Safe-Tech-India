
'use client'

import { useState } from 'react'

interface SuggestDealerModalProps {
    request: any
    dealers: any[]
    onClose: () => void
    onSubmit: (selectedDealerIds: string[]) => void
}

export default function SuggestDealerModal({ request, dealers, onClose, onSubmit }: SuggestDealerModalProps) {
    const [selectedDealerIds, setSelectedDealerIds] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    const toggleDealer = (dealerId: string) => {
        if (selectedDealerIds.includes(dealerId)) {
            setSelectedDealerIds(selectedDealerIds.filter(id => id !== dealerId))
        } else {
            setSelectedDealerIds([...selectedDealerIds, dealerId])
        }
    }

    const filteredDealers = dealers.filter(d =>
        d.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.city.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-card" style={{ width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    Select Dealers for Request
                </h3>

                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
                    <strong>Request:</strong> {request.description} <br />
                    <strong>Location:</strong> {request.pincode}
                </div>

                <input
                    type="text"
                    placeholder="Search dealers by name or city..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        padding: '0.8rem', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem'
                    }}
                />

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
                    {filteredDealers.map(dealer => (
                        <div
                            key={dealer.id}
                            onClick={() => toggleDealer(dealer.id)}
                            style={{
                                padding: '0.8rem', borderRadius: '6px',
                                background: selectedDealerIds.includes(dealer.id) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: selectedDealerIds.includes(dealer.id) ? '1px solid #22c55e' : '1px solid transparent',
                                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{dealer.shop_name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{dealer.city} • {dealer.phone}</div>
                            </div>
                            {selectedDealerIds.includes(dealer.id) && <span style={{ color: '#22c55e' }}>✔ Selected</span>}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'transparent', border: '1px solid #555' }}>Cancel</button>
                    <button
                        onClick={() => onSubmit(selectedDealerIds)}
                        className="btn"
                        style={{ background: '#22c55e', color: 'white' }}
                        disabled={selectedDealerIds.length === 0}
                    >
                        Confirm & Suggest ({selectedDealerIds.length})
                    </button>
                </div>
            </div>
        </div>
    )
}
