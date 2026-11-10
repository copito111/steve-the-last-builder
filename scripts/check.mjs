import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { narration }=await import(pathToFileURL(path.resolve('public/narration-data.js')));
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
assert.equal(narration.chapters.length,6);
assert.ok(narration.duration>0&&Number.isFinite(narration.duration));
assert.equal(narration.chapters[0].start,0);
for(let i=0;i<6;i++){
 const chapter=narration.chapters[i];
 assert.ok(chapter.end>chapter.start);
 assert.ok(chapter.end<=narration.duration+.03);
 if(i)assert.equal(chapter.start,narration.chapters[i-1].end);
 await access('public'+chapter.file);
}
for(let i=0;i<narration.captions.length;i++){
 const cue=narration.captions[i];
 assert.ok(cue.start>=0&&cue.end>cue.start&&cue.end<=narration.duration+.03);
 if(i)assert.ok(cue.start>=narration.captions[i-1].end);
}
await access('public'+narration.voiceUrl);
assert.ok(narration.captions.length>=30);
assert.ok(script.includes('voice.currentTime'),'Narration clock must drive scene timing');
console.log('Checked assets, 6 chapters, continuous chapter boundaries, caption ordering, narration source and soundtrack.');
