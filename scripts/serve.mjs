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
  const data=await readFile(file); res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':data.length}); res.end(req.method==='HEAD'?undefined:data);
 } catch {res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
