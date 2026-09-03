import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html does not exist.');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Public route directories to create with physical index.html for static hosts (GitHub Pages)
const routes = ['about', 'services', 'work', 'process', 'contact'];

routes.forEach((route) => {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent, 'utf8');
  console.log(`✓ Generated static entry: dist/${route}/index.html`);
});

// Also create dist/404.html as an exact copy of index.html for SPA fallback
fs.writeFileSync(path.join(distDir, '404.html'), indexContent, 'utf8');
console.log('✓ Generated static fallback: dist/404.html');
