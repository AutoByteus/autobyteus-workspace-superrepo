import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {startBuiltTestServer,resolveTestDatabaseLocation,removeOwnedTestRuntime,reserveLoopbackPort,testRuntimeRoot,workspaceRoot} from '../../../../../test-support/live-e2e/test-runtime-bootstrap.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const key=`api-classroom-${Date.now()}`;const runtimeRoot=path.join(testRuntimeRoot,key);const database=resolveTestDatabaseLocation(`file:./db/${key}.db`);const workdir=path.join(runtimeRoot,'classroom');await fs.mkdir(workdir,{recursive:true});
const record={key,runtimeRoot,database:database.databaseUrl,workdir,startedAt:new Date().toISOString(),cleanup:{},pid:process.pid};
const persist=()=>fs.writeFile(path.join(dir,'environment.json'),JSON.stringify(record,null,2)+'\n');
let server,nuxt,nuxtLog='';let stop;const stopping=new Promise(r=>stop=r);process.on('SIGTERM',()=>stop());process.on('SIGINT',()=>stop());
try{
 server=await startBuiltTestServer({runtimeRoot,databaseUrlOverride:database.databaseUrl,environment:{RUN_CODEX_E2E:'1'}});record.serverUrl=server.serverUrl;await persist();
 const port=await reserveLoopbackPort();record.frontendUrl=`http://127.0.0.1:${port}`;
 nuxt=spawn('pnpm',['dev','--port',String(port)],{cwd:path.join(workspaceRoot,'autobyteus-web'),env:{...process.env,BACKEND_NODE_BASE_URL:server.serverUrl,NUXT_TELEMETRY_DISABLED:'1'},detached:true,stdio:['ignore','pipe','pipe']});record.nuxtPid=nuxt.pid;nuxt.stdout.on('data',s=>nuxtLog+=s);nuxt.stderr.on('data',s=>nuxtLog+=s);
 for(let i=0;i<600;i++){try{if((await fetch(record.frontendUrl+'/settings')).ok){record.ready=true;break}}catch{}await new Promise(r=>setTimeout(r,200));}
 if(!record.ready)throw Error('Nuxt readiness timeout');record.readyAt=new Date().toISOString();await persist();console.log(JSON.stringify(record));await stopping;
}catch(e){record.error=String(e);console.error(e);process.exitCode=1}
finally{
 if(nuxt){try{process.kill(-nuxt.pid,'SIGTERM')}catch{}await new Promise(r=>setTimeout(r,700));try{process.kill(-nuxt.pid,'SIGKILL')}catch{}record.cleanup.nuxt='owned group signalled';}
 await fs.writeFile(path.join(dir,'nuxt.log'),nuxtLog,{mode:0o600});
 if(server){await fs.writeFile(path.join(dir,'server.log'),server.output(),{mode:0o600});await server.stop();record.cleanup.server='stopped'}
 await removeOwnedTestRuntime(runtimeRoot,database);record.cleanup.localData='owned runtime/database/key removed';record.finishedAt=new Date().toISOString();await persist();
}
