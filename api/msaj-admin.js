// Admin-API för artikelportalen (Cloudgruppen). Auth: x-msaj-code-header.
// GET  ?task=list                     → alla sidor
// GET  ?task=get&id=..                → en sida
// POST {task:'save', page:{...}}      → skapa/uppdatera (id = uppdatera)
// POST {task:'publish', id, published}→ publicera/avpublicera
// POST {task:'delete', id}            → ta bort
// POST {task:'upload', name, dataUrl} → ladda upp bild (base64) → { url }
import { sbSelect, sbInsert, sbUpdate, sbDelete, uploadImage, isAdmin, slugify } from './_msaj.js';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export default async function handler(req, res) {
  if (!isAdmin(req)) { res.status(401).json({ error: 'Fel kod.' }); return; }
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const task = (req.query && req.query.task) || 'list';
      if (task === 'get') {
        const rows = await sbSelect(`id=eq.${parseInt(req.query.id, 10)}&select=*`);
        res.status(200).json({ ok: true, page: rows[0] || null });
        return;
      }
      const rows = await sbSelect('order=created_at.desc&select=id,slug,title,meta_desc,hero_image,published,created_at,updated_at');
      res.status(200).json({ ok: true, pages: rows });
      return;
    }
    if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }
    const b = await readJson(req);

    if (b.task === 'upload') {
      const m = String(b.dataUrl || '').match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,(.+)$/);
      if (!m) { res.status(400).json({ error: 'Ogiltig bild.' }); return; }
      const buf = Buffer.from(m[2], 'base64');
      if (buf.length > 8 * 1024 * 1024) { res.status(400).json({ error: 'Bilden är för stor (max 8 MB).' }); return; }
      const url = await uploadImage(b.name || 'bild.jpg', buf, m[1]);
      res.status(200).json({ ok: true, url });
      return;
    }

    if (b.task === 'save') {
      const p = b.page || {};
      const title = String(p.title || '').trim().slice(0, 140);
      if (!title) { res.status(400).json({ error: 'Rubrik krävs.' }); return; }
      const patch = {
        title,
        slug: slugify(p.slug || title) || `sida-${Date.now()}`,
        meta_desc: String(p.meta_desc || '').trim().slice(0, 300),
        body: String(p.body || ''),
        hero_image: String(p.hero_image || ''),
        updated_at: new Date().toISOString(),
      };
      if (p.id) {
        const rows = await sbUpdate(`id=eq.${parseInt(p.id, 10)}`, patch);
        res.status(200).json({ ok: true, page: rows[0] });
      } else {
        const dupe = await sbSelect(`slug=eq.${encodeURIComponent(patch.slug)}&select=id`);
        if (dupe.length) patch.slug = `${patch.slug}-${Date.now() % 10000}`;
        const row = await sbInsert(patch);
        res.status(200).json({ ok: true, page: row });
      }
      return;
    }

    if (b.task === 'publish') {
      const rows = await sbUpdate(`id=eq.${parseInt(b.id, 10)}`, { published: b.published === true, updated_at: new Date().toISOString() });
      res.status(200).json({ ok: true, page: rows[0] });
      return;
    }

    if (b.task === 'delete') {
      await sbDelete(`id=eq.${parseInt(b.id, 10)}`);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'okänd task' });
  } catch (e) {
    console.error('msaj-admin', e.message);
    res.status(500).json({ error: e.message });
  }
}
