import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';

// const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Removing this to avoid CJS warning

export async function createServer(
    root = process.cwd(),
    isProd = process.env.NODE_ENV === 'production' || true, // Force prod for verification
    hmrPort,
) {
    const resolve = (p) => path.resolve(root, p);

    const indexProd = isProd
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : '';

    const app = express();

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite;
    if (!isProd) {
        vite = await (await import('vite')).createServer({
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true,
                watch: {
                    // During tests we edit the files too fast and sometimes this crashes
                    // Chokidar.
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort,
                },
            },
            appType: 'custom',
        });
        // use vite's connect instance as middleware
        app.use(vite.middlewares);
    } else {
        app.use((await import('compression')).default());
        app.use(
            (await import('serve-static')).default(resolve('dist/client'), {
                index: false,
            }),
        );
    }

    app.get('/sitemap.xml', (req, res) => {
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        const urls = [
            '/',
            '/about',
            '/services',
            '/contact'
        ];

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

        res.set('Content-Type', 'text/xml');
        res.send(sitemap);
    });

    app.use(async (req, res, next) => {
        try {
            const url = req.originalUrl;

            let template, render;
            if (!isProd) {
                // always read fresh template in dev
                template = fs.readFileSync(resolve('index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
            } else {
                template = indexProd;
                // @ts-ignore
                render = (await import(pathToFileURL(resolve('dist/server/entry-server.js')).href)).render;
            }

            const context = {};
            const appHtml = render(url, context);

            // Extract HTML and Helmet data
            const { html, helmet } = appHtml;

            if (context.url) {
                // Somewhere a `<Redirect>` was rendered
                return res.redirect(301, context.url);
            }

            const htmlParts = [
                helmet.title.toString(),
                helmet.meta.toString(),
                helmet.link.toString(),
                helmet.script.toString()
            ].filter(Boolean).join('\n');

            let finalHtml = template.replace('<!--app-head-->', htmlParts);
            finalHtml = finalHtml.replace('<!--app-html-->', html);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e);
            console.error('SSR Error:', e.stack);
            fs.writeFileSync('server_error.log', e.stack);
            res.status(500).end(e.stack);
        }
    });

    return { app, vite };
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
    const port = process.env.PORT || 1010;
    createServer().then(({ app }) =>
        app.listen(port, () => {
            console.log(`✈️✈️✈️ http://localhost:${port}`);
        }),
    ).catch((e) => {
        console.error("Server failed to start:", e);
        process.exit(1);
    });
}

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection:', reason);
});

// Keep alive
setInterval(() => { }, 10000);

