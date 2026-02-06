'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

export default function EditProduct() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
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

    // Check verification on mount and fetch product
    useEffect(() => {
        const checkAccessAndFetch = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()

            // Verification check removed to allow all dealers to edit
            // if (!prof?.is_verified) { ... }
            setProfile(prof)

            // Fetch product
            if (productId) {
                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .eq('dealer_id', prof.id) // Security check
                    .single()

                if (error) {
                    console.error('Error fetching product:', error)
                    alert('Product not found or access denied.')
                    router.push('/dashboard')
                    return
                }

                if (product) {
                    setForm({
                        title: product.title,
                        category: product.category,
                        condition: product.condition,
                        price: product.price.toString(),
                        image_url: product.image_url || '',
                        description: product.specs?.description || (product.specs ? Object.values(product.specs).join(' ') : '')
                    })
                }
            }
            setFetching(false)
        }
        checkAccessAndFetch()
    }, [productId])

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

        // Determine condition based on category
        let finalCondition = form.condition
        if (!form.category.includes('Refurbished')) {
            finalCondition = 'New'
        }

        const { error } = await supabase
            .from('products')
            .update({
                title: form.title,
                category: form.category,
                condition: finalCondition,
                price: parseFloat(form.price),
                image_url: form.image_url,
                specs: { description: form.description }
            })
            .eq('id', productId)
            .eq('dealer_id', profile.id)

        if (error) {
            alert('Error updating product: ' + error.message)
        } else {
            alert('Product updated successfully!')
            router.push('/dashboard')
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return

        setLoading(true)
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)
            .eq('dealer_id', profile.id)

        if (error) {
            alert('Error deleting product')
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    if (!profile || fetching) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Edit Product</h1>
                    <button onClick={handleDelete} className="btn" style={{ background: '#ef4444', color: 'white', fontSize: '0.8rem' }}>Delete Product</button>
                </div>

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
                        {loading ? 'Updating...' : 'Update Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="btn"
                        style={{ background: 'transparent', border: '1px solid #ccc', color: 'inherit' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'hsl(var(--input-bg))',
    border: '1px solid hsl(var(--border-color))',
    borderRadius: '8px',
    color: 'hsl(var(--primary-dark))',
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
