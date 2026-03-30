import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blogDistDir = path.join(rootDir, 'apps', 'blogs', 'dist');
const buildBlogsDir = path.join(rootDir, 'build', 'blogs');

if (!fs.existsSync(blogDistDir)) {
  console.error(`Astro blog build output not found at ${blogDistDir}`);
  process.exit(1);
}

fs.rmSync(buildBlogsDir, { recursive: true, force: true });
fs.mkdirSync(buildBlogsDir, { recursive: true });
fs.cpSync(blogDistDir, buildBlogsDir, { recursive: true });

console.log(`Copied ${blogDistDir} -> ${buildBlogsDir}`);
