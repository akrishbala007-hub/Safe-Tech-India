import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()

    // Base URL
    const baseUrl = 'https://safetechindia.org.in'

    // Static Pages
    const routes = [
        '',
        '/about',
        '/products',
        '/login',
        '/register',
        '/service-engineer',
        '/support',
        '/contact',
        '/terms-and-conditions',
        '/refund-policy'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Products
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true)

    const productRoutes = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority as these are the core content
    }))

    return [...routes, ...productRoutes]
}
