import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'icons');

// Minimal valid 1x1 PNG (golden/amber tint for the app)
const minimalPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'icon-192.png'), minimalPng);
writeFileSync(join(outDir, 'icon-512.png'), minimalPng);
console.log('Icons created in public/icons');
