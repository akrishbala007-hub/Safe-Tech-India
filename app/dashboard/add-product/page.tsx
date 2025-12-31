
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddProduct() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    const [form, setForm] = useState({
        title: '',
        category: 'Laptop',
        condition: 'Refurbished Grade A',
        price: '',
        image_url: '',
        specs: {
            processor: '',
            ram: '',
            storage: '',
            warranty: ''
        }
    })

    // Check verification on mount
    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()

            if (!prof?.is_verified) {
                alert('Access Denied: You must be verified to add products.')
                router.push('/dashboard')
                return
            }
            setProfile(prof)
        }
        checkAccess()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath)
            setForm({ ...form, image_url: data.publicUrl })

        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('products').insert({
            dealer_id: profile.id,
            title: form.title,
            category: form.category,
            condition: form.condition,
            price: parseFloat(form.price),
            image_url: form.image_url,
            specs: form.specs
        })

        if (error) {
            alert('Error adding product: ' + error.message)
        } else {
            router.push('/dashboard')
        }
        setLoading(false)
    }

    if (!profile) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem' }}>Add New Product</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Basic Info */}
                    <div>
                        <label style={labelStyle}>Product Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Dell Latitude 7490"
                            required
                            style={inputStyle}
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Category</label>
                            <select
                                style={inputStyle}
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option>Laptop</option>
                                <option>Desktop</option>
                                <option>Monitor</option>
                                <option>Accessories</option>
                                <option>Components (RAM/SSD)</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Condition</label>
                            <select
                                style={inputStyle}
                                value={form.condition}
                                onChange={e => setForm({ ...form, condition: e.target.value })}
                            >
                                <option>New</option>
                                <option>Refurbished Grade A</option>
                                <option>Refurbished Grade B</option>
                                <option>Refurbished Grade C</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Price (₹)</label>
                            <input
                                type="number"
                                required
                                style={inputStyle}
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                style={{ ...inputStyle, padding: '0.5rem' }}
                            />
                        </div>
                    </div>
                    {form.image_url && <img src={form.image_url} alt="Preview" style={{ width: '100px', borderRadius: '8px', objectFit: 'cover' }} />}

                    {/* Specs Section */}
                    <div style={{ padding: '1rem', background: 'hsl(var(--input-bg))', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Specifications</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                placeholder="Processor (e.g. i5 8th Gen)"
                                style={inputStyle}
                                value={form.specs.processor}
                                onChange={e => setForm({ ...form, specs: { ...form.specs, processor: e.target.value } })}
                            />
                            <input
                                placeholder="RAM (e.g. 16GB)"
                                style={inputStyle}
                                value={form.specs.ram}
                                onChange={e => setForm({ ...form, specs: { ...form.specs, ram: e.target.value } })}
                            />
                            <input
                                placeholder="Storage (e.g. 512GB SSD)"
                                style={inputStyle}
                                value={form.specs.storage}
                                onChange={e => setForm({ ...form, specs: { ...form.specs, storage: e.target.value } })}
                            />
                            <input
                                placeholder="Warranty (e.g. 1 Month)"
                                style={inputStyle}
                                value={form.specs.warranty}
                                onChange={e => setForm({ ...form, specs: { ...form.specs, warranty: e.target.value } })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || uploading}
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'hsl(var(--input-bg))', // Using Light Theme Var
    border: '1px solid hsl(var(--border-color))',
    borderRadius: '8px',
    color: 'hsl(var(--primary-dark))', // Dark text (Black/Dark Yellow)
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none'
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
}
