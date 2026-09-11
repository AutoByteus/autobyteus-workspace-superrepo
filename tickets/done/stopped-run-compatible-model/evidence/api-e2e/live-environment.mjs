// Owned, project-supported real-server/Nuxt/Chromium setup for API-C07–09.
// No transport mocking, saved-user data, credential copies or source patching.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { startBuiltTestServer, resolveTestDatabaseLocation, removeOwnedTestRuntime,
  reserveLoopbackPort, testRuntimeRoot, workspaceRoot } from '../../../../../test-support/live-e2e/test-runtime-bootstrap.mjs';
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const key = `api-model-live-${Date.now()}`;
const runtimeRoot = path.join(testRuntimeRoot,key);
const database = resolveTestDatabaseLocation(`file:./db/${key}.db`);
const workdir = path.join(runtimeRoot,'workspace');
await fs.mkdir(workdir,{recursive:true,mode:0o700});
const record = { key, runtimeRoot, database:database.databaseUrl, workdir, startedAt:new Date().toISOString(), ownedRuns:[], events:[], cleanup:{} };
const persist=()=>fs.writeFile(path.join(evidenceDir,'live-environment.json'),JSON.stringify(record,null,2)+'\n');
let server, nuxt, chrome;
const logs = {server:'',nuxt:'',chrome:''};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const eventually=async(fn,label)=>{for(let i=0;i<600;i++){if(await fn())return;await wait(200);}throw Error(`Readiness timeout: ${label}`)};
const gql=async(query,variables={})=>{const r=await fetch(`${server.serverUrl}/graphql`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables})});const p=await r.json();if(p.errors)throw Error(JSON.stringify(p.errors));return p.data;};
const spawnOwned=(cmd,args,cwd,env,label)=>{const p=spawn(cmd,args,{cwd,env,detached:true,stdio:['ignore','pipe','pipe']});p.stdout.on('data',x=>logs[label]+=x);p.stderr.on('data',x=>logs[label]+=x);return p;};
const stopOwned=async p=>{if(!p)return 'not started';try{process.kill(-p.pid,'SIGTERM')}catch{};await wait(500);try{process.kill(-p.pid,'SIGKILL')}catch{};return `owned group ${p.pid} signalled`;};
let stop;const stopping=new Promise(r=>stop=r);process.on('SIGTERM',()=>stop());process.on('SIGINT',()=>stop());
try{
 server=await startBuiltTestServer({runtimeRoot,databaseUrlOverride:database.databaseUrl,environment:{RUN_CODEX_E2E:'1'}});
 record.serverUrl=server.serverUrl;
 record.events.push('Built server ready; sanitized environment retains supported CLI HOME auth continuity, no provider secret import.');await persist();
 const catalog=await gql(`query LiveCatalog { providerModelCatalogSnapshots(runtimeKind:"codex_app_server") { llmModels { modelIdentifier canonicalName configSchema } } }`);
 record.models=catalog.providerModelCatalogSnapshots.flatMap(x=>x.llmModels);
 const first=record.models.find(x=>x.modelIdentifier==='gpt-5.4-mini')??record.models[0];
 if(!first)throw Error('No Codex model available');record.initialModel=first.modelIdentifier;
 const def=await gql(`mutation LiveDefinition($input:CreateAgentDefinitionInput!){createAgentDefinition(input:$input){id}}`,{input:{name:key,role:'API/E2E continuity validator',description:'Owned stopped-model replacement test',instructions:'Answer the user concisely. Remember facts in this conversation. Do not use tools unless explicitly asked.',category:'api-e2e'}});
 record.definitionId=def.createAgentDefinition.id;
 const created=await gql(`mutation LiveRun($input:CreateAgentRunInput!){createAgentRun(input:$input){success message runId}}`,{input:{agentDefinitionId:record.definitionId,workspaceRootPath:workdir,llmModelIdentifier:first.modelIdentifier,llmConfig:null,autoExecuteTools:false,skillAccessMode:'PRELOADED_ONLY',runtimeKind:'codex_app_server'}});
 record.create=created.createAgentRun;
 if(!record.create.success||!record.create.runId)throw Error(`Run creation: ${JSON.stringify(record.create)}`);
 record.runId=record.create.runId;record.ownedRuns.push(record.runId);await persist();
 const nuxtPort=await reserveLoopbackPort();record.frontendUrl=`http://127.0.0.1:${nuxtPort}`;
 nuxt=spawnOwned('pnpm',['dev','--port',String(nuxtPort)],path.join(workspaceRoot,'autobyteus-web'),{...process.env,BACKEND_NODE_BASE_URL:server.serverUrl,NUXT_TELEMETRY_DISABLED:'1'},'nuxt');
 await eventually(async()=>{try{return(await fetch(`${record.frontendUrl}/workspace`)).ok}catch{return false}},'Nuxt');
 const cdpPort=await reserveLoopbackPort();record.cdpUrl=`http://127.0.0.1:${cdpPort}`;
 chrome=spawnOwned('/usr/bin/chromium',['--headless','--no-sandbox','--disable-dev-shm-usage',`--remote-debugging-port=${cdpPort}`,`--user-data-dir=${path.join(runtimeRoot,'browser-profile')}`,'about:blank'],workspaceRoot,process.env,'chrome');
 await eventually(async()=>{try{return(await fetch(`${record.cdpUrl}/json/version`)).ok}catch{return false}},'Chromium');
 record.ready=true;record.readyAt=new Date().toISOString();await persist();console.log(JSON.stringify({ready:true,record:path.join(evidenceDir,'live-environment.json'),...{serverUrl:record.serverUrl,frontendUrl:record.frontendUrl,cdpUrl:record.cdpUrl,runId:record.runId}}));
 await stopping;
}catch(error){record.failure=String(error);console.error(error);process.exitCode=1;}
finally{
 if(server){for(const runId of record.ownedRuns){try{await gql(`mutation Stop($id:String!){terminateAgentRun(agentRunId:$id){success message}}`,{id:runId})}catch{}}}
 record.cleanup.chrome=await stopOwned(chrome);record.cleanup.nuxt=await stopOwned(nuxt);
 if(server){logs.server=server.output();try{await server.stop();record.cleanup.server='stopped'}catch(e){record.cleanup.server=String(e)}}
 // Logs from owned test server only. Keep evidence private; no env dump or credentials.
 for(const [label,log]of Object.entries(logs))await fs.writeFile(path.join(evidenceDir,`live-${label}.log`),log,{mode:0o600});
 await removeOwnedTestRuntime(runtimeRoot,database);record.cleanup.localData='owned runtime/database/key removed';
 record.finishedAt=new Date().toISOString();await persist();console.log('Owned live environment closed.');
}
