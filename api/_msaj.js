// Delade helpers för artikelsystemet (Cloudgruppens månadscontent).
// Data i Supabase-tabellen msaj_pages + bilder i bucket "msaj".
const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

export const SITE = 'https://www.mammasaj.se';

export async function sbSelect(query) {
  const r = await fetch(`${URL_}/rest/v1/msaj_pages?${query}`, { headers: H });
  if (!r.ok) throw new Error('select ' + r.status);
  return r.json();
}
export async function sbInsert(row) {
  const r = await fetch(`${URL_}/rest/v1/msaj_pages`, { method: 'POST', headers: { ...H, Prefer: 'return=representation' }, body: JSON.stringify(row) });
  if (!r.ok) throw new Error('insert ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return (await r.json())[0];
}
export async function sbUpdate(query, patch) {
  const r = await fetch(`${URL_}/rest/v1/msaj_pages?${query}`, { method: 'PATCH', headers: { ...H, Prefer: 'return=representation' }, body: JSON.stringify(patch) });
  if (!r.ok) throw new Error('update ' + r.status);
  return r.json();
}
export async function sbDelete(query) {
  const r = await fetch(`${URL_}/rest/v1/msaj_pages?${query}`, { method: 'DELETE', headers: H });
  if (!r.ok) throw new Error('delete ' + r.status);
}
export async function uploadImage(name, buffer, contentType) {
  const path = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
  const r = await fetch(`${URL_}/storage/v1/object/msaj/${path}`, {
    method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': contentType },
    body: buffer,
  });
  if (!r.ok) throw new Error('upload ' + r.status);
  return `${URL_}/storage/v1/object/public/msaj/${path}`;
}

export function isAdmin(req) {
  const code = req.headers['x-msaj-code'] || (req.query && req.query.code);
  return !!code && code === process.env.MSAJ_ADMIN_CODE;
}

export function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/å|ä/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Markdown-lite → HTML. Stödjer: ## mellanrubrik, ### underrubrik, - listor,
// **fet**, tomrad = nytt stycke, ![alt](bildurl) för bilder.
export function renderBody(md) {
  const lines = String(md || '').replace(/\r/g, '').split('\n');
  const out = [];
  let list = null;
  const flushList = () => { if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; } };
  const inline = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  for (const raw of lines) {
    const line = raw.trim();
    const img = line.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
    if (img) { flushList(); out.push(`<figure><img src="${esc(img[2])}" alt="${esc(img[1])}" loading="lazy" />${img[1] ? `<figcaption>${esc(img[1])}</figcaption>` : ''}</figure>`); continue; }
    if (line.startsWith('### ')) { flushList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { flushList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('- ')) { (list = list || []).push(`<li>${inline(line.slice(2))}</li>`); continue; }
    if (!line) { flushList(); continue; }
    flushList(); out.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  return out.join('\n');
}

// Sidskal i sajtens design (Bebas Neue + DM Sans, varm cream-palett).
export function pageShell({ title, metaDesc, canonicalPath, bodyHtml, ogImage }) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)} — Mammas Saj Göteborg</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${SITE}${canonicalPath}" />
  <meta property="og:title" content="${esc(title)} — Mammas Saj" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${SITE}${canonicalPath}" />
  <meta property="og:image" content="${ogImage || SITE + '/assets/og-image.jpg'}" />
  <meta property="og:locale" content="sv_SE" />
  <link rel="icon" type="image/webp" href="/assets/logo-small.webp" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />
  <style>
    :root{
      --bg:#FAF8F5; --char:#F2EDE4; --surface:#FFFDF8; --border:rgba(91,58,31,.12);
      --amber:#D97A2C; --amber2:#F4A347; --amber-d:#A65918;
      --text:#1F1611; --text-muted:rgba(31,22,17,.68); --muted:#6B5E4D;
      --ivory:#F5F0E6; --font-head:'Bebas Neue',sans-serif; --font-body:'DM Sans',sans-serif;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:var(--font-body);background:var(--bg);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased}
    a{color:inherit}
    nav{position:sticky;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--border)}
    .nav-inner{max-width:1160px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
    .nav-logo{display:flex;align-items:center;gap:11px;text-decoration:none}
    .nav-logo img{width:44px;height:44px;border-radius:10px}
    .nav-logo-text{font-family:var(--font-head);font-size:24px;letter-spacing:.06em}
    .nav-logo-text span{color:var(--amber)}
    .nav-links{display:flex;gap:26px;list-style:none;font-weight:500;font-size:15px}
    .nav-links a{text-decoration:none;color:var(--text-muted)}
    .nav-links a:hover{color:var(--amber)}
    .nav-cta{background:var(--amber);color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:11px 22px;border-radius:999px}
    .nav-cta:hover{background:var(--amber-d)}
    @media(max-width:760px){.nav-links{display:none}}
    .art-head{background:var(--char);padding:64px 24px 48px}
    .art-head-in{max-width:760px;margin:0 auto}
    .crumbs{font-size:13.5px;color:var(--muted);margin-bottom:18px}
    .crumbs a{color:var(--muted)}
    .crumbs a:hover{color:var(--amber)}
    h1{font-family:var(--font-head);font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:.02em}
    .art-meta{margin-top:14px;color:var(--muted);font-size:14px}
    article{max-width:760px;margin:0 auto;padding:48px 24px 72px}
    article h2{font-family:var(--font-head);font-size:clamp(26px,3.4vw,34px);letter-spacing:.02em;margin:38px 0 12px}
    article h3{font-size:19px;font-weight:600;margin:28px 0 10px}
    article p{margin:0 0 18px;color:var(--text-muted);font-size:17px}
    article ul{margin:0 0 18px 22px;color:var(--text-muted);font-size:17px}
    article li{margin-bottom:6px}
    article strong{color:var(--text)}
    article a{color:var(--amber-d)}
    article figure{margin:26px 0}
    article img{max-width:100%;border-radius:14px;display:block}
    article figcaption{font-size:13.5px;color:var(--muted);margin-top:8px}
    .art-hero{max-width:960px;margin:-28px auto 0;padding:0 24px}
    .art-hero img{width:100%;max-height:440px;object-fit:cover;border-radius:18px;display:block;box-shadow:0 24px 50px -28px rgba(91,58,31,.35)}
    .art-cta{background:var(--char);border-radius:18px;padding:30px;margin-top:44px;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}
    .art-cta b{font-family:var(--font-head);font-size:24px;letter-spacing:.03em;font-weight:400}
    .list-grid{max-width:1000px;margin:0 auto;padding:48px 24px 72px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;text-decoration:none;transition:transform .25s,box-shadow .25s;display:flex;flex-direction:column}
    .card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -24px rgba(91,58,31,.35)}
    .card img{width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--char)}
    .card-b{padding:20px 22px 24px}
    .card h2{font-family:var(--font-head);font-size:24px;letter-spacing:.02em;margin-bottom:8px;font-weight:400}
    .card p{color:var(--text-muted);font-size:14.5px}
    footer{background:#241A12;color:var(--ivory);padding:44px 24px;margin-top:0}
    .foot-in{max-width:1160px;margin:0 auto;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:14px}
    .foot-in a{color:var(--amber2);text-decoration:none}
    .btn{display:inline-block;background:var(--amber);color:#fff;text-decoration:none;font-weight:600;padding:13px 26px;border-radius:999px}
    .btn:hover{background:var(--amber-d)}
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Mammas Saj — hem">
        <img src="/assets/logo-small.webp" alt="Mammas Saj logotyp" width="44" height="44" />
        <span class="nav-logo-text">MAMMAS <span>SAJ</span></span>
      </a>
      <ul class="nav-links">
        <li><a href="/#meny">Meny</a></li>
        <li><a href="/#om-oss">Om oss</a></li>
        <li><a href="/artiklar">Artiklar</a></li>
        <li><a href="/#hitta">Hitta oss</a></li>
      </ul>
      <a href="https://qopla.com/restaurant/mamma-saj/q7PEaEAkGe/order" target="_blank" rel="noopener" class="nav-cta">Beställ nu</a>
    </div>
  </nav>
  ${bodyHtml}
  <footer>
    <div class="foot-in">
      <span>© ${new Date().getFullYear()} Mammas Saj · Deltavägen 6, Göteborg · <a href="tel:+46315085050">031-50 85 50</a></span>
      <span>Powered by <a href="https://synsnumedia.se/" target="_blank" rel="noopener">SynsNu</a></span>
    </div>
  </footer>
</body>
</html>`;
}
