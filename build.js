const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8').replace(/^\uFEFF/, '');
const escape = (text) => text.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

try {
  const projects = read('projekti.txt').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const catalog = JSON.parse(read('projekti.json'));
  const html = read('index.html');
  const start = '      <!-- projects:start -->';
  const end = '      <!-- projects:end -->';
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);

  if (startIndex < 0 || endIndex <= startIndex || html.indexOf(start, startIndex + 1) !== -1 || html.indexOf(end, endIndex + 1) !== -1) {
    throw new Error('U index.html nedostaju jedinstvene oznake projects:start i projects:end.');
  }
  if (new Set(projects).size !== projects.length) {
    throw new Error('U projekti.txt postoje duplirane stavke.');
  }

  const cards = projects.map((slug, position) => {
    if (!/^[a-z0-9-]+$/.test(slug) || !Object.hasOwn(catalog, slug)) {
      throw new Error(`Nepoznat projekat: ${slug}. Dodaj njegove podatke u projekti.json.`);
    }
    const project = catalog[slug];
    if (typeof project.title !== 'string' || typeof project.description !== 'string') {
      throw new Error(`Projekat ${slug} nema ispravan title i description u projekti.json.`);
    }
    const image = `assets/img/projects/${slug}.jpg`;
    if (!fs.existsSync(path.join(root, image))) {
      throw new Error(`Nedostaje slika: ${image}`);
    }
    const title = escape(project.title);
    const url = `https://mudroljub.github.io/${slug}/`;
    return `      <article class="project">
        <a class="preview" href="${url}" tabindex="-1" aria-hidden="true" target="_blank" rel="noopener noreferrer">
          <img src="${image}" alt="Snimak projekta ${title}" width="1200" height="760" loading="${position < 3 ? 'eager' : 'lazy'}" decoding="async">
        </a>
        <h2><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></h2>
        <p>${escape(project.description)}</p>
        <div class="project-links">
          <a href="${url}" aria-label="Otvori projekat ${title}" target="_blank" rel="noopener noreferrer">Otvori projekat</a>
          <a href="https://github.com/mudroljub/${slug}" aria-label="GitHub kod projekta ${title}" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </article>`;
  });

  const content = cards.length ? '\n' + cards.join('\n') + '\n' : '\n';
  const result = html.slice(0, startIndex + start.length) + content + html.slice(endIndex);
  if (result !== html) fs.writeFileSync(path.join(root, 'index.html'), result, 'utf8');
  console.log(`Naslovna je usklađena sa projekti.txt (${projects.length} projekata).`);
} catch (error) {
  console.error(`Greška: ${error.message}`);
  process.exitCode = 1;
}
