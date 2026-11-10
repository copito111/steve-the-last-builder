import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2] || '.');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.mp3':'audio/mpeg','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8'};
http.createServer(async (req, res) => {
 try {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/') pathname = '/index.html';
  let file = path.resolve(root, '.'+pathname);
  if (!file.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
  try { await stat(file); } catch { if(root===path.resolve('.')) file=path.join(root,'public',pathname); }
  const data=await readFile(file);
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  const range=req.headers.range;
  if(range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(range);
   let start=0,end=data.length-1;
   if(match){if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end);}else if(match[2])start=Math.max(0,data.length-Number(match[2]));}
   if(!match||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();return;}
   res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));
  }else{res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);}
 } catch {res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
