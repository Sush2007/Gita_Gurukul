import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gitagurukul.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/private/',
        ],
      },
      // Explicitly allow AI Search Engines & Answer Engines (GEO & AEO)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'CCBot',
          'cohere-ai',
          'OAI-SearchBot',
        ],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/shop',
          '/about',
          '/donate',
          '/faq',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
