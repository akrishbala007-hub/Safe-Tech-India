'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminApprovals() {
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPendingProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('products')
            .select('*, profiles(shop_name, phone)')
            .eq('approval_status', 'pending')
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setProducts(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchPendingProducts()
    }, [])

    const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('products')
            .update({ approval_status: status })
            .eq('id', id)

        if (error) {
            alert('Error updating status')
        } else {
            // Remove from list
            setProducts(products.filter(p => p.id !== id))
        }
    }

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Pending Approvals</h1>

            {products.length === 0 ? (
                <p>No pending products.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {products.map(p => (
                        <div key={p.id} className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img src={p.image_url} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1 }}>
                                <h3>{p.title}</h3>
                                <p><strong>₹{p.price}</strong> • {p.condition}</p>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Dealer: {p.profiles?.shop_name} ({p.profiles?.phone})</p>
                                <a href={p.image_url} target="_blank" style={{ fontSize: '0.8rem', color: 'blue' }}>View Full Image</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleApproval(p.id, 'approved')}
                                    className="btn"
                                    style={{ background: '#22c55e', color: 'white' }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleApproval(p.id, 'rejected')}
                                    className="btn"
                                    style={{ background: '#ef4444', color: 'white' }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
