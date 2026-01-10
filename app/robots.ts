import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/api/'], // Protect dynamic/private routes
        },
        sitemap: 'https://safetechindia.org.in/sitemap.xml',
    }
}
