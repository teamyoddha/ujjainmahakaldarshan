import {execFileSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = join(root, 'dist');
const assets = join(target, 'assets');
const fallbackBinary = process.env.UMMD_ESBUILD_BIN;
const reactFromCdn = Boolean(fallbackBinary);
const origin = 'https://ujjainmahakaldarshan.com';
const ogImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/1280px-Mahakaleshwar_Temple%2C_Ujjain.jpg';
const pages = {
  home: ['index.html', 'Ujjain Mahakal Darshan | Plan Your Ujjain Temple Visit', 'Speak with a local Ujjain team about your Mahakaleshwar visit, temple itinerary and group travel enquiries.'],
  privacy: ['privacy.html', 'Privacy Policy', 'How Ujjain Mahakal Darshan handles enquiries and optional analytics.'],
  terms: ['terms.html', 'Terms &amp; Conditions', 'Terms for travel enquiries and arrangements.'],
  disclaimer: ['disclaimer.html', 'Disclaimer', 'Independent travel enquiry and temple access information.'],
  contact: ['contact.html', 'Contact Information', 'Call, WhatsApp or get directions to Ujjain Mahakal Darshan.'],
  'photo-credits': ['photo-credits.html', 'Photo Credits', 'Attribution for the Ujjain destination photographs.']
};
mkdirSync(assets, {recursive:true});
for (const file of ['logo.webp', 'favicon.png']) copyFileSync(join(root, 'public', file), join(assets, file));
copyFileSync(join(root, 'src', 'site.css'), join(assets, 'react-site.css'));
if (reactFromCdn) {
  const output = execFileSync(fallbackBinary, ['--loader=jsx', '--format=esm', '--minify'], {
    input: readFileSync(join(root, 'src', 'app.jsx')),
  });
  writeFileSync(join(assets, 'app.js'), output);
  copyFileSync(join(root, 'src', 'measurement.mjs'), join(assets, 'measurement.mjs'));
} else {
  const {build} = await import('esbuild');
  await build({entryPoints:[join(root,'src/app.jsx')], bundle:true, format:'esm', minify:true, define:{'process.env.NODE_ENV':'"production"'}, outfile:join(assets,'app.js')});
}
const importMap = reactFromCdn ? '<script type="importmap">{"imports":{"react":"https://esm.sh/react@19.2.0","react-dom/client":"https://esm.sh/react-dom@19.2.0/client?external=react"}}</script>' : '';
for (const [page,[file,title,description]] of Object.entries(pages)) {
  const canonical = origin + '/' + (page === 'home' ? '' : file);
  const html = `<!doctype html>
<html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}${page === 'home' ? '' : ' | Ujjain Mahakal Darshan'}</title>
<meta name="description" content="${description}"><link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Ujjain Mahakal Darshan"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ogImage}"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#061b49">
<link rel="icon" type="image/png" href="assets/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&amp;family=Instrument+Serif:ital@0;1&amp;display=swap"><link rel="preconnect" href="https://upload.wikimedia.org"><link rel="stylesheet" href="assets/react-site.css">${importMap}
<script src="assets/app.js" type="module"></script></head><body data-page="${page}"><div id="root"></div>
<noscript><main class="section wrap"><h1>${page === 'home' ? 'Plan your visit to Mahakal.' : title}</h1><p>${description}</p><p><a href="tel:+917024940106">Call +91 70249 40106</a> · <a href="https://wa.me/917024940106">WhatsApp</a></p></main></noscript></body></html>`;
  writeFileSync(join(target,file), html);
}
writeFileSync(join(target,'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + origin + '/sitemap.xml\n');
writeFileSync(join(target,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  Object.values(pages).map(([file]) => '  <url><loc>' + origin + '/' + (file === 'index.html' ? '' : file) + '</loc></url>').join('\n') + '\n</urlset>\n');

