'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [auditData, setAuditData] = useState<any>({})
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        safe_tech_price: '',
        category: 'Laptop',
        condition: 'Refurbished Grade A',
        specs: { processor: '', ram: '', storage: '' },
    })

    // Unwrap params properly using React.use() or await if async component, but this is client component so we use useEffect to unwrap or wait if it was passed as prop? 
    // Next.js 15+ params are promises even in client components if using async page, but here we can just use `use` or wait.
    // To differ from Add page, we need to fetch data.
    const [id, setId] = useState<string | null>(null)

    useEffect(() => {
        params.then(p => {
            setId(p.id)
            fetchProduct(p.id)
        })
    }, [])

    const fetchProduct = async (productId: string) => {
        const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
        if (error) {
            alert('Error loading product')
            router.push('/admin')
            return
        }
        if (data) {
            setFormData({
                title: data.title || '',
                price: data.price || '',
                safe_tech_price: data.safe_tech_price || '',
                category: data.category || 'Laptop',
                condition: data.condition || 'Refurbished Grade A',
                specs: data.specs || { processor: '', ram: '', storage: '' }
            })
            // If existing audit data, use it. Else default to all true (or empty if you prefer)
            // User requested default is true for ADD, for EDIT it should probably be what it was.
            if (data.inspection_data && Object.keys(data.inspection_data).length > 0) {
                setAuditData(data.inspection_data)
            } else {
                // Fallback to all true if missing even on edit
                setAuditData(defaultAuditData)
            }
        }
        setLoading(false)
    }

    const defaultAuditData = {
        "Physical & Cosmetic": { "Body Integrity": true, "Hinge Tension": true, "Screen Condition": true, "Keyboard": true, "Trackpad": true, "Port Health": true },
        "Display & Visuals": { "Dead Pixels": true, "Brightness Levels": true, "Color Accuracy": true, "Webcam": true, "Microphone": true },
        "Internal Hardware": { "Battery Health": true, "SSD Health": true, "RAM Stress Test": true, "Wi-Fi/Bluetooth": true, "Thermal Check": true, "Speaker Quality": true, "BIOS/Locks": true },
        "Power & Charging": { "Adapter Originality": true, "Charging Port": true, "Battery Backup": true, "DC-In Stability": true },
        "Software & Performance": { "OS Authenticity": true, "Driver Stability": true, "Stress Test": true, "Boot Time": true, "Keyboard Ghosting": true, "Touchscreen": true, "Fingerprint/FaceID": true, "System Reset": true }
    }

    const handleAuditChange = (category: string, item: string, value: boolean) => {
        setAuditData((prev: any) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [item]: value
            }
        }))
    }

    // Reuse categories list
    const categories = {
        "Physical & Cosmetic": [
            "Body Integrity", "Hinge Tension", "Screen Condition", "Keyboard", "Trackpad", "Port Health"
        ],
        "Display & Visuals": [
            "Dead Pixels", "Brightness Levels", "Color Accuracy", "Webcam", "Microphone"
        ],
        "Internal Hardware": [
            "Battery Health", "SSD Health", "RAM Stress Test", "Wi-Fi/Bluetooth", "Thermal Check", "Speaker Quality", "BIOS/Locks"
        ],
        "Power & Charging": [
            "Adapter Originality", "Charging Port", "Battery Backup", "DC-In Stability"
        ],
        "Software & Performance": [
            "OS Authenticity", "Driver Stability", "Stress Test", "Boot Time", "Keyboard Ghosting", "Touchscreen", "Fingerprint/FaceID", "System Reset"
        ]
    }

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // ... existing useEffect ...

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0])
        }
    }

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('products').getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = undefined // undefined means "do not update" in supabase update if we exclude it, but we need to conditionally add it to payload

            if (imageFile) {
                setUploading(true)
                imageUrl = await uploadImage(imageFile)
                setUploading(false)
            }

            const updatePayload: any = {
                title: formData.title,
                price: Number(formData.price),
                safe_tech_price: Number(formData.safe_tech_price),
                category: formData.category,
                condition: formData.condition,
                specs: formData.specs,
                inspection_data: auditData,
            }

            if (imageUrl) {
                updatePayload.image_url = imageUrl
            }

            const { error } = await supabase.from('products').update(updatePayload).eq('id', id)

            if (error) throw error

            alert('Product Updated Successfully!')
            window.location.href = '/admin' // Force redirect

        } catch (error: any) {
            alert('Error updating: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading Product Data...</div>

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Edit Verified Product</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Image Upload */}
                <section className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ marginBottom: '1rem' }}>📸 Update Image</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input-field"
                        style={{ padding: '0.5rem' }}
                    />
                    {imageFile && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'green' }}>Selected: {imageFile.name}</p>}
                </section>

                {/* Basic Info */}
                <section className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ marginBottom: '1rem' }}>📦 Basic Details</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <input
                            placeholder="Product Title"
                            className="input-field"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                placeholder="Market Price (₹)"
                                type="number"
                                className="input-field"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Safe Tech Price (₹)"
                                type="number"
                                className="input-field"
                                value={formData.safe_tech_price}
                                onChange={e => setFormData({ ...formData, safe_tech_price: e.target.value })}
                                required
                                style={{ borderColor: '#25D366' }}
                            />
                        </div>
                        <select
                            className="input-field"
                            value={formData.condition}
                            onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            required
                        >
                            <option value="Refurbished Grade A">Refurbished Grade A</option>
                            <option value="Refurbished Grade A+">Refurbished Grade A+</option>
                            <option value="Refurbished Grade A++">Refurbished Grade A++</option>
                            <option value="Refurbished Grade A+++">Refurbished Grade A+++</option>
                            <option value="Refurbished Grade A++++">Refurbished Grade A++++</option>
                        </select>
                    </div>
                </section>

                {/* Specs */}
                <section className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ marginBottom: '1rem' }}>⚙️ Specifications</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <input
                            placeholder="Processor (i5/M1)"
                            className="input-field"
                            value={formData.specs.processor}
                            onChange={e => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                        />
                        <input
                            placeholder="RAM (8GB)"
                            className="input-field"
                            value={formData.specs.ram}
                            onChange={e => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                        />
                        <input
                            placeholder="Storage (256GB)"
                            className="input-field"
                            value={formData.specs.storage}
                            onChange={e => setFormData({ ...formData, specs: { ...formData.specs, storage: e.target.value } })}
                        />
                    </div>
                </section>

                {/* 30-Point Audit */}
                <section className="glass-card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>🛡️ 30-Point Safe Tech Audit</h3>

                    {Object.entries(categories).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>{category}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {items.map(item => (
                                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            style={{ width: '18px', height: '18px', accentColor: '#25D366' }}
                                            checked={auditData[category]?.[item] === true}
                                            onChange={(e) => handleAuditChange(category, item, e.target.checked)}
                                        />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#1a1a1a',
                        color: '#FDB813',
                        padding: '1.5rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Updating...' : '💾 Save Changes'}
                </button>

            </form>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    borderRadius: 8px;
                    fontSize: 1rem;
                }
            `}</style>
        </div>
    )
}
