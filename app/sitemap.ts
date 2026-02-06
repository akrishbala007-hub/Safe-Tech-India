import { MetadataRoute } from 'next'

import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://safetechindia.org.in'
    const supabase = await createClient()

    // 1. Fetch all products
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')

    // 2. Fetch all verified shops
    const { data: shops } = await supabase
        .from('profiles')
        .select('slug, updated_at')
        .eq('is_verified', true)
        .not('slug', 'is', null)

    const staticRoutes = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    const productRoutes = (products || []).map((p) => ({
        url: `${baseUrl}/product/${p.id}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    const shopRoutes = (shops || []).map((s) => ({
        url: `${baseUrl}/shop/${s.slug}`,
        lastModified: new Date(s.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.6,
    }))

    return [...staticRoutes, ...productRoutes as any, ...shopRoutes as any]
}
