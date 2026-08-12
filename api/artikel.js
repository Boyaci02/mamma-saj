// Publika artikelsidor: /artiklar (lista) och /artiklar/:slug (via vercel.json-rewrites).
import { sbSelect, renderBody, pageShell, esc, SITE } from './_msaj.js';

export default async function handler(req, res) {
  try {
    const slug = req.query && req.query.slug;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');

    if (!slug) {
      const pages = await sbSelect('published=eq.true&order=created_at.desc&select=slug,title,meta_desc,hero_image,created_at');
      const cards = pages.map(p => `
        <a class="card" href="/artiklar/${esc(p.slug)}">
          ${p.hero_image ? `<img src="${esc(p.hero_image)}" alt="${esc(p.title)}" loading="lazy" />` : ''}
          <div class="card-b"><h2>${esc(p.title)}</h2><p>${esc(p.meta_desc)}</p></div>
        </a>`).join('');
      const body = `
        <header class="art-head"><div class="art-head-in">
          <div class="crumbs"><a href="/">Hem</a> › Artiklar</div>
          <h1>Artiklar</h1>
          <p class="art-meta">Guider och läsning från Mammas Saj i Göteborg.</p>
        </div></header>
        ${pages.length ? `<div class="list-grid">${cards}</div>` : `<article><p>Inga artiklar publicerade ännu — kika tillbaka snart.</p></article>`}`;
      res.status(200).send(pageShell({ title: 'Artiklar', metaDesc: 'Artiklar och guider från Mammas Saj — saj, kebab och shawarma i Göteborg.', canonicalPath: '/artiklar', bodyHtml: body }));
      return;
    }

    const rows = await sbSelect(`slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=*`);
    if (!rows.length) {
      res.status(404).send(pageShell({ title: 'Sidan finns inte', metaDesc: 'Sidan kunde inte hittas.', canonicalPath: '/artiklar', bodyHtml: `
        <header class="art-head"><div class="art-head-in"><h1>Sidan finns inte</h1><p class="art-meta">Länken kan vara fel eller så är sidan borttagen.</p></div></header>
        <article><a class="btn" href="/artiklar">Till alla artiklar</a></article>` }));
      return;
    }
    const p = rows[0];
    const datum = new Date(p.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });
    const schema = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.meta_desc,
      datePublished: p.created_at, dateModified: p.updated_at, image: p.hero_image || undefined,
      author: { '@type': 'Organization', name: 'Mammas Saj' },
      publisher: { '@type': 'Organization', name: 'Mammas Saj', url: SITE },
      mainEntityOfPage: `${SITE}/artiklar/${p.slug}`,
    });
    const body = `
      <header class="art-head"><div class="art-head-in">
        <div class="crumbs"><a href="/">Hem</a> › <a href="/artiklar">Artiklar</a> › ${esc(p.title)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="art-meta">Mammas Saj · ${datum}</p>
      </div></header>
      ${p.hero_image ? `<div class="art-hero"><img src="${esc(p.hero_image)}" alt="${esc(p.title)}" /></div>` : ''}
      <article>
        ${renderBody(p.body)}
        <div class="art-cta">
          <b>Sugen på riktig saj?</b>
          <a class="btn" href="https://qopla.com/restaurant/mamma-saj/q7PEaEAkGe/order" target="_blank" rel="noopener">Beställ nu</a>
        </div>
      </article>
      <script type="application/ld+json">${schema}</script>`;
    res.status(200).send(pageShell({ title: p.title, metaDesc: p.meta_desc, canonicalPath: `/artiklar/${p.slug}`, bodyHtml: body, ogImage: p.hero_image || null }));
  } catch (e) {
    console.error('artikel', e.message);
    res.status(500).send('Något gick fel. Försök igen om en stund.');
  }
}
