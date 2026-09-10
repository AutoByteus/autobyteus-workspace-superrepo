// Architecture-only metadata probe. No Studio state writes, thread activation, or inference.
// Usage: node <file> [--claude-sdk /absolute/path/to/sdk.mjs]
import { spawn, execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline';
const result = { observedAt: new Date().toISOString(), scope: 'metadata-only; not product acceptance' };
const child = spawn('codex', ['app-server'], { cwd: process.cwd(), stdio: ['pipe','pipe','pipe'] });
child.stderr.resume();
let id=0;
const pending=new Map();
createInterface({input:child.stdout}).on('line',line=>{try{const msg=JSON.parse(line);if(pending.has(msg.id)){const {resolve,reject,timer}=pending.get(msg.id);pending.delete(msg.id);clearTimeout(timer);msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result)}}catch{}});
const request=(method,params)=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(new Error('Timeout: '+method))},20000);pending.set(n,{resolve,reject,timer});child.stdin.write(JSON.stringify({id:n,method,params})+'\n')});
try {
 const version=execFileSync('codex',['--version'],{encoding:'utf8'}).trim();
 await request('initialize',{clientInfo:{name:'architecture_capacity_probe',version:'1.0.0'}});
 child.stdin.write(JSON.stringify({method:'initialized',params:{}})+'\n');
 const catalog=await request('model/list',{includeHidden:false});
 const config=await request('config/read',{cwd:process.cwd(),includeLayers:false});
 const cachePath=join(process.env.CODEX_HOME || join(homedir(),'.codex'),'models_cache.json');
 const cache=JSON.parse(await readFile(cachePath,'utf8'));
 result.codex={version,cachePath,cacheVersion:cache.client_version,fetchedAt:cache.fetched_at,
  configuredContextWindow:config.config?.model_context_window ?? null,
  rows:catalog.data.map(row=>{const cached=cache.models.find(m=>m.slug===row.model);return {model:row.model,catalogKeys:Object.keys(row),cachedContextWindow:cached?.context_window??null,cachedMaxContextWindow:cached?.max_context_window??null,effectiveContextWindowPercent:cached?.effective_context_window_percent??null}})};
} catch(e){result.codex={error:String(e)}} finally {child.stdin.end();child.kill('SIGTERM')}
const sdkPath=process.argv[process.argv.indexOf('--claude-sdk')+1];
if(process.argv.includes('--claude-sdk')) {
 let query;
 try {
  const sdk=await import(pathToFileURL(sdkPath));
  query=sdk.query({prompt:'Metadata inspection only', options:{pathToClaudeCodeExecutable:execFileSync('which',['claude'],{encoding:'utf8'}).trim(),maxTurns:0,permissionMode:'plan',cwd:process.cwd(),settingSources:['user','project','local'],tools:[],mcpServers:{}}});
  const withTimeout=p=>Promise.race([p,new Promise((_,reject)=>{const t=setTimeout(()=>reject(new Error('Claude metadata timeout')),20000);t.unref()})]);
  const models=await withTimeout(query.supportedModels());
  const rows=[];
  for(const m of models.slice(0,3)) {
   await withTimeout(query.setModel(m.value));
   const usage=await withTimeout(query.getContextUsage());
   rows.push({value:m.value,resolvedModel:m.resolvedModel??null,descriptorKeys:Object.keys(m),observedModel:usage.model,rawMaxTokens:usage.rawMaxTokens,maxTokens:usage.maxTokens});
  }
  result.claude={version:execFileSync('claude',['--version'],{encoding:'utf8'}).trim(),sdkPath,rows};
 } catch(e) {result.claude={error:String(e)}} finally {query?.close()}
}
console.log(JSON.stringify(result,null,2));
