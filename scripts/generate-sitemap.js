import fs from 'fs';
import path from 'path';

const urls = ['/', '/about', '/services', '/contact'];
const baseUrl = process.env.URL || 'https://icarecenter.netlify.app';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
    <url>
        <loc>${baseUrl}${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === '/' ? '1.0' : '0.8'}</priority>
    </url>
    `).join('')}
</urlset>`;

// Ensure directory exists
const distDir = path.resolve('dist/client');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated at dist/client/sitemap.xml');
