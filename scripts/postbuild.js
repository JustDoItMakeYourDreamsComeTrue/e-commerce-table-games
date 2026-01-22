import { copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist');

copyFileSync(join(distPath, 'index.html'), join(distPath, '404.html'));
console.log('✓ Copied index.html to 404.html for SPA routing');
