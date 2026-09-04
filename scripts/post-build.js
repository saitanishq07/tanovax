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

// Metadata dictionary for each public route with optimized SEO titles
const routesMetadata = {
  '': {
    title: 'TanovaX | Web, Apps & Business Solutions',
    description: 'TanovaX designs and develops modern websites and custom business applications for businesses, startups, and growing enterprises. High performance CRM, billing, inventory, and web solutions.',
    canonical: 'https://tanovax.com/'
  },
  'about': {
    title: 'About TanovaX | Web & Custom Business Solutions',
    description: 'Learn about TanovaX — a digital solutions brand focused on building modern websites and custom business applications for companies and growing startups.',
    canonical: 'https://tanovax.com/about'
  },
  'services': {
    title: 'Web, Apps & Business Solutions | TanovaX',
    description: 'Explore custom software development services by TanovaX: Business websites, CRMs, billing systems, inventory portals, employee management tools, and executive dashboards.',
    canonical: 'https://tanovax.com/services'
  },
  'work': {
    title: 'Our Work | Websites & Business Applications | TanovaX',
    description: 'Browse real-world concepts and custom software applications built by TanovaX for businesses, healthcare providers, real estate firms, and hospitality brands.',
    canonical: 'https://tanovax.com/work'
  },
  'process': {
    title: 'Our Process | Digital Solutions for Businesses | TanovaX',
    description: 'Discover TanovaX\'s structured 6-phase software engineering process — from discovery and architecture to development, QA, deployment, and ongoing support.',
    canonical: 'https://tanovax.com/process'
  },
  'contact': {
    title: 'Contact TanovaX | Web & Business Solutions',
    description: 'Get in touch with TanovaX for custom website and business application development inquiries. Schedule a consultation or request a project estimate.',
    canonical: 'https://tanovax.com/contact'
  }
};

function injectMetadata(html, meta) {
  let updated = html;

  // Replace Title
  updated = updated.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);
  updated = updated.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${meta.title}" />`);

  // Replace Description
  updated = updated.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${meta.description}" />`);

  // Replace Canonical Link
  updated = updated.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${meta.canonical}" />`);

  // Replace OpenGraph URL, Title, Description
  updated = updated.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${meta.canonical}" />`);
  updated = updated.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${meta.title}" />`);
  updated = updated.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${meta.description}" />`);

  // Replace Twitter Title, Description
  updated = updated.replace(/<meta property="twitter:title" content=".*?" \/>/gi, `<meta property="twitter:title" content="${meta.title}" />`);
  updated = updated.replace(/<meta property="twitter:description" content=".*?" \/>/gi, `<meta property="twitter:description" content="${meta.description}" />`);

  return updated;
}

// Generate static pre-rendered HTML files for each public route
Object.keys(routesMetadata).forEach((route) => {
  const meta = routesMetadata[route];
  const customHtml = injectMetadata(indexContent, meta);

  if (route === '') {
    // Update main dist/index.html with pre-rendered homepage metadata
    fs.writeFileSync(indexHtmlPath, customHtml, 'utf8');
    console.log(`✓ Injected pre-rendered static metadata into dist/index.html (${meta.canonical})`);
  } else {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), customHtml, 'utf8');
    console.log(`✓ Injected pre-rendered static entry: dist/${route}/index.html (${meta.canonical})`);
  }
});

// Also create dist/404.html as a fallback
fs.writeFileSync(path.join(distDir, '404.html'), indexContent, 'utf8');
console.log('✓ Generated static fallback: dist/404.html');
