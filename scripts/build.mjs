import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'favicon.svg']) await copyFile(file, `dist/${file}`);
await cp('public', 'dist', { recursive: true });
console.log('Built static production site in dist/');
