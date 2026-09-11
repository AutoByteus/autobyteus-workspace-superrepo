// Incremental case checkpoint driver; browser owned by live-environment.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const dir=path.dirname(fileURLToPath(import.meta.url));
const env=JSON.parse(await fs.readFile(path.join(dir,'live-environment.json'),'utf8'));
const require=createRequire(new URL('../../../../../autobyteus-web/package.json',import.meta.url));
const {chromium}=require('playwright-core');
const browser=await chromium.connectOverCDP(env.cdpUrl);
const context=browser.contexts()[0];
const page=context.pages()[0]??await context.newPage();
const phase=process.argv[2]??'inspect';
await page.setViewportSize({width:1440,height:1000});
const gql=async(query,variables={})=>{const r=await fetch(`${env.serverUrl}/graphql`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables})});return r.json()};
const snapshot=async()=>{await page.screenshot({path:path.join(dir,`live-${phase}.png`),fullPage:true});const text=await page.locator('body').innerText();await fs.writeFile(path.join(dir,`live-${phase}-dom.txt`),text);console.log(text.slice(-14000));};
try{
 if(phase==='open'){
  await page.goto(`${env.frontendUrl}/workspace?workspaceExecutionKind=agent&workspaceExecutionRunId=${env.runId}`,{waitUntil:'domcontentloaded',timeout:120000});
  await page.getByRole('textbox').first().waitFor({state:'visible',timeout:120000});
  await snapshot();
 }else if(phase==='send-first'){
  const fact='violet-otter-6842';
  const input=page.locator('textarea').first();await input.fill(`Remember this exact private test label for later in THIS conversation: ${fact}. Reply only "Remembered". Do not use tools.`);await input.press('Enter');
  await page.getByText('Remembered',{exact:true}).last().waitFor({timeout:120000});
  await snapshot();
 }else if(phase==='stop'){
  const result=await gql(`mutation Stop($id:String!){terminateAgentRun(agentRunId:$id){success message}}`,{id:env.runId});
  await fs.writeFile(path.join(dir,'live-stop-result.json'),JSON.stringify(result,null,2));console.log(result);await snapshot();
 }else if(phase==='settings'){
  await page.locator('[data-test="workspace-header-edit-config"]').click();
  await page.locator('#agent-run-runtime-kind').waitFor({state:'visible',timeout:60000});
  await page.waitForTimeout(5000);await snapshot();
 }else if((phase==='save'||phase==='save-compacted')){
  const target=process.argv[3]??'gpt-5.6-luna';
  const runDir=path.join(env.runtimeRoot,'memory/agents',env.runId);
  const metadataPath=path.join(runDir,'run_metadata.json');
  const before=JSON.parse(await fs.readFile(metadataPath,'utf8'));
  const hashFiles=async()=>{const hashes={};for(const name of await fs.readdir(runDir)){if(name==='run_metadata.json')continue;const file=path.join(runDir,name);if((await fs.stat(file)).isFile())hashes[name]=createHash('sha256').update(await fs.readFile(file)).digest('hex');}return hashes;};
  const hashesBefore=await hashFiles();
  const providerPath=JSON.parse(await fs.readFile(path.join(dir,'live-provider-after.json'),'utf8')).path;
  const providerHashBefore=createHash('sha256').update(await fs.readFile(providerPath)).digest('hex');
  const requests=[];page.on('request',r=>{if(r.url().endsWith('/graphql')&&r.method()==='POST'){const v=r.postDataJSON();if(v.operationName?.includes('UpdateStopped'))requests.push(v);}});
  const runtime=page.locator('#agent-run-runtime-kind');assert(await runtime.isDisabled());
  const picker=runtime.locator('xpath=../following-sibling::div[1]//button').first();
  await page.keyboard.press('Escape');await picker.click();const search=page.getByPlaceholder('Search models...');await search.fill(target);await page.locator('li[role=option]').first().waitFor({state:'visible'});await search.press('ArrowDown');await page.keyboard.press('Enter');
  assert((await picker.innerText()).toLowerCase().includes(target));
  const save=page.locator('[data-test="save-existing-model-config"]');
  await page.waitForFunction(()=>!document.querySelector('[data-test="save-existing-model-config"]').disabled);
  await fs.writeFile(path.join(dir,`live-${phase}-start.json`),JSON.stringify({before,hashesBefore,target},null,2));
  await save.click();await page.getByText('Model settings updated. They will be used when this run resumes.',{exact:true}).waitFor({timeout:60000});
  assert(await save.isDisabled());assert.equal(requests.length,1);
  const after=JSON.parse(await fs.readFile(metadataPath,'utf8'));
  assert.equal(after.llmModelIdentifier,target);assert.equal(after.platformAgentRunId,before.platformAgentRunId);
  const fixed=x=>{const r={...x};delete r.llmModelIdentifier;delete r.llmConfig;return r;};assert.deepEqual(fixed(after),fixed(before));
  const hashesAfter=await hashFiles();assert.deepEqual(hashesAfter,hashesBefore);
  const providerHashAfter=createHash('sha256').update(await fs.readFile(providerPath)).digest('hex');assert.equal(providerHashAfter,providerHashBefore);
  const resume=await gql(`query Resume($id:String!){getAgentRunResumeConfig(runId:$id){runId isActive metadataConfig{llmModelIdentifier llmConfig runtimeKind runtimeReference{threadId sessionId}}}}`,{id:env.runId});
  assert.equal(resume.data.getAgentRunResumeConfig.isActive,false);
  await fs.writeFile(path.join(dir,`live-${phase}-result.json`),JSON.stringify({before,after,requests,hashesBefore,hashesAfter,providerHashBefore,providerHashAfter,resume},null,2));await snapshot();
 }else if((phase==='resume'||phase==='resume-compacted')){
  // Full supported Workspace reopen to chat; no restore mutation or model override.
  await page.goto(`${env.frontendUrl}/workspace?workspaceExecutionKind=agent&workspaceExecutionRunId=${env.runId}`,{waitUntil:'domcontentloaded',timeout:120000});
  const input=page.locator('textarea').first();await input.waitFor({state:'visible',timeout:60000});
  await input.fill(phase==='resume-compacted'?'Give the exact earlier private test label followed by | compacted-continued. Do not use tools.':'What exact private test label did I give you earlier in this conversation? Reply with just that label. Do not use tools.');await input.press('Enter');
  // The label is not repeated in this question; require a new assistant answer.
  await page.getByText(phase==='resume-compacted'?'violet-otter-6842 | compacted-continued':'violet-otter-6842',{exact:true}).last().waitFor({timeout:120000});
  await snapshot();
 }else await snapshot();
 process.exit(0);
}catch(error){console.error(error);try{await snapshot()}catch{};process.exit(1)}
