import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('index.html','utf8');
const script=await readFile('app.js','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate element ID');
for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
 const relative=match[1].slice(1);
 try{await access(relative);}catch{await access(`public/${relative}`);}
}
assert.equal([...html.matchAll(/data-avatar="/g)].length,5);
assert.equal([...html.matchAll(/data-chapter="/g)].length,6);
for(const date of ['April 12, 2025','April 13, 2025','April 20, 2025','May 2, 2025','May 18, 2025','May 19, 2025']) assert.ok(script.includes(date));
assert.ok(html.includes('lang="en"'));
assert.ok(script.includes('50*1024*1024'));
assert.ok((await readFile('public/audio/worldheart-original.mp3')).length>100000);
console.log('Checked all linked assets, unique IDs, 5 avatars, 6 exact dates, voice limits and soundtrack.');
