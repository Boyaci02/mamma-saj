// Dynamisk sitemap: startsidan + artikellistan + alla publicerade artiklar.
import { sbSelect, SITE } from './_msaj.js';

export default async function handler(_req, res) {
  try {
    const pages = await sbSelect('published=eq.true&select=slug,updated_at&order=created_at.desc');
    const urls = [
      { loc: `${SITE}/`, prio: '1.0' },
      { loc: `${SITE}/artiklar`, prio: '0.7' },
      ...pages.map(p => ({ loc: `${SITE}/artiklar/${p.slug}`, prio: '0.6', mod: p.updated_at })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
      `  <url><loc>${u.loc}</loc>${u.mod ? `<lastmod>${u.mod.slice(0, 10)}</lastmod>` : ''}<priority>${u.prio}</priority></url>`).join('\n')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
    res.status(200).send(xml);
  } catch (e) {
    console.error('sitemap', e.message);
    res.status(500).send('');
  }
}
