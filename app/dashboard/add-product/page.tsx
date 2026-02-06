
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

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
        description: '', // Replaces structured specs
        image_url: ''
    })

    // Check verification on mount
    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()

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

            // 1. Compress Image
            const options = {
                maxSizeMB: 0.5, // Max 500KB
                maxWidthOrHeight: 1200, // Max width 1200px
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(file, options)

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, compressedFile) // Upload compressed file

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath)
            setForm({ ...form, image_url: data.publicUrl })

        } catch (error: any) {
            console.error(error)
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Determine condition based on category
        let finalCondition = form.condition
        if (!form.category.includes('Refurbished')) {
            finalCondition = 'New'
        }

        const { error } = await supabase.from('products').insert({
            dealer_id: profile.id,
            title: form.title,
            category: form.category,
            condition: finalCondition,
            price: parseFloat(form.price),
            image_url: form.image_url,
            specs: { description: form.description } // Store in specs for compatibility
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
                                <option>Refurbished laptops / Desktop</option>
                                <option>Brand New laptops / Desktop</option>
                                <option>Computer accessories</option>
                                <option>Computer Hardware</option>
                                <option>Other Hardware</option>
                            </select>
                        </div>
                        {form.category.includes('Refurbished') && (
                            <div>
                                <label style={labelStyle}>Refurbished Grade</label>
                                <select
                                    style={inputStyle}
                                    value={form.condition}
                                    onChange={e => setForm({ ...form, condition: e.target.value })}
                                >
                                    <option value="Refurbished Grade A">Refurbished Grade A</option>
                                    <option value="Refurbished Grade A+">Refurbished Grade A+</option>
                                    <option value="Refurbished Grade A++">Refurbished Grade A++</option>
                                    <option value="Refurbished Grade A+++">Refurbished Grade A+++</option>
                                    <option value="Refurbished Grade A++++">Refurbished Grade A++++</option>
                                </select>
                            </div>
                        )}
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

                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '2px solid #ef4444', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>
                        ⚠️ ATTENTION: Upload ONLY ORIGINAL PHOTOS taken by you. <br />
                        Do NOT upload downloaded, edited, or watermarked images.
                    </div>

                    <div style={{ padding: '1rem', background: 'hsl(var(--input-bg))', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Description</h3>
                        <textarea
                            placeholder="Enter detailed description (Max 3000 characters)..."
                            style={{ ...inputStyle, minHeight: '200px', resize: 'vertical' }}
                            maxLength={3000}
                            required
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                            {form.description.length} / 3000
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
