import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/dashboard/',
                '/api/',
                '/_next/',
                '/login',
                '/register'
            ],
        },
        sitemap: 'https://safetechindia.org.in/sitemap.xml',
    }
}
