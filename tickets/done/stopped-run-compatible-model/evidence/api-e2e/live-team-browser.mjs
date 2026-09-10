import fs from 'node:fs/promises';import path from 'node:path';import{fileURLToPath}from'node:url';import{createRequire}from'node:module';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url));const e=JSON.parse(await fs.readFile(path.join(dir,'live-environment.json'),'utf8'));const team=JSON.parse(await fs.readFile(path.join(dir,'live-team.json'),'utf8'));
const require=createRequire(new URL('../../../../../autobyteus-web/package.json',import.meta.url));const{chromium}=require('playwright-core');const browser=await chromium.connectOverCDP(e.cdpUrl);const page=browser.contexts()[0].pages()[0];const phase=process.argv[2]??'open';const who=process.argv[3]??'lead';const agent=team.agents.find(a=>a.address===`/Nested/${who}`);await page.setViewportSize({width:1440,height:1000});
const snapshot=async()=>{await page.screenshot({path:path.join(dir,`live-team-${phase}-${who}.png`),fullPage:true});const s=await page.locator('body').innerText();await fs.writeFile(path.join(dir,`live-team-${phase}-${who}-dom.txt`),s);console.log(s.slice(-9000))};
const gql=async(query,variables={})=>{const r=await fetch(e.serverUrl+'/graphql',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables})});return r.json()};
const navigate=async()=>{await page.goto(`${e.frontendUrl}/workspace?workspaceExecutionKind=team&workspaceExecutionRunId=${team.teamRunId}&workspaceExecutionAgentRunId=${agent.agentRunId}`,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('textarea').first().waitFor({state:'visible',timeout:60000});};
try{
 if(phase==='first'){
  await navigate();const input=page.locator('textarea').first();await input.fill(`Remember my private ${who} label: ${who}-amber-7291. Reply only "Remembered ${who}". Do not use tools or delegate.`);await input.press('Enter');await page.getByText(`Remembered ${who}`,{exact:true}).last().waitFor({timeout:120000});await snapshot();
 }else if(phase==='stop'){
  const result=await gql(`mutation($id:String!){terminateAgentTeamRun(teamRunId:$id){success message}}`,{id:team.teamRunId});console.log(JSON.stringify(result));await fs.writeFile(path.join(dir,'live-team-stop.json'),JSON.stringify(result,null,2));
 }else if(phase==='settings'){
  await page.locator('[data-test="workspace-header-edit-config"]').click();await page.locator('#team-scope-root-runtime-kind').waitFor({state:'visible',timeout:60000});await page.waitForTimeout(5000);await page.locator('[data-test="team-member-overrides-toggle"]').click();await page.locator('[data-test="team-scope-config-editor"][data-team-address="/Nested"]').locator('button[aria-controls="team-scope-Nested-panel"]').click();await snapshot();
 }else if(phase==='save'){
  const before=JSON.parse(await fs.readFile(team.treePath,'utf8'));
  const rootDir=path.dirname(team.treePath);
  const hashes=async()=>{const out={};const walk=async(d)=>{for(const ent of await fs.readdir(d,{withFileTypes:true})){const file=path.join(d,ent.name);if(ent.isDirectory())await walk(file);else if(file!==team.treePath)out[path.relative(rootDir,file)]=createHash('sha256').update(await fs.readFile(file)).digest('hex');}};await walk(rootDir);return out;};
  const hashesBefore=await hashes();const requests=[];
  page.on('request',r=>{if(r.url().endsWith('/graphql')&&r.method()==='POST'){const v=r.postDataJSON();if(v.operationName==='UpdateStoppedTeamRunModelConfigs')requests.push(v);}});
  const choose=async(runtimeId,target)=>{const runtime=page.locator(runtimeId);assert(await runtime.isDisabled());const picker=runtime.locator('xpath=../following-sibling::div[1]//button').first();await picker.click();const search=page.getByPlaceholder('Search models...');await search.fill(target);await page.locator('li[role=option]').first().waitFor({state:'visible'});await search.press('ArrowDown');await page.keyboard.press('Enter');assert((await picker.innerText()).toLowerCase().includes(target));};
  await choose('#team-scope-Nested-runtime-kind','gpt-5.6-sol');
  await choose('#existing--Nested-reviewer-runtime-kind','gpt-5.6-terra');
  const save=page.locator('[data-test="save-existing-model-config"]');assert(await save.isEnabled());
  await fs.writeFile(path.join(dir,'live-team-save-start.json'),JSON.stringify({before,hashesBefore},null,2));await save.click();
  await page.waitForFunction(()=>{const el=document.querySelector('[data-test="save-existing-model-config"]');return el?.disabled&&!el.textContent.includes('Saving')});
  const after=JSON.parse(await fs.readFile(team.treePath,'utf8'));
  const nested=after.rootTeam.members.find(x=>x.address==='/Nested');
  assert.equal(nested.defaultLaunchConfiguration.llmModelIdentifier,'gpt-5.6-sol');
  assert.equal(nested.members.find(x=>x.address==='/Nested/lead').launchConfiguration.llmModelIdentifier,'gpt-5.6-sol');
  assert.equal(nested.members.find(x=>x.address==='/Nested/reviewer').launchConfiguration.llmModelIdentifier,'gpt-5.6-terra');
  assert.equal(after.rootTeam.defaultLaunchConfiguration.llmModelIdentifier,'gpt-5.6-luna');
  assert.equal(after.rootTeam.members.find(x=>x.address==='/coordinator').launchConfiguration.llmModelIdentifier,'gpt-5.6-luna');
  const fixed=x=>JSON.parse(JSON.stringify(x,(k,v)=>['llmModelIdentifier','llmConfig'].includes(k)?undefined:v));assert.deepEqual(fixed(after),fixed(before));
  const hashesAfter=await hashes();assert.deepEqual(hashesAfter,hashesBefore);assert.equal(requests.length,1);
  assert.deepEqual(requests[0].variables.input.patches.map(x=>x.scopeAddress).sort(),['/Nested','/Nested/lead','/Nested/reviewer']);
  const canonical=await gql(`query($id:String!){getTeamRunResumeConfig(teamRunId:$id){isActive executionTree}}`,{id:team.teamRunId});assert.equal(canonical.data.getTeamRunResumeConfig.isActive,false);
  await fs.writeFile(path.join(dir,'live-team-save-result.json'),JSON.stringify({before,after,hashesBefore,hashesAfter,requests,canonical},null,2));await snapshot();
 }else if(phase==='resume'){
  await navigate();const input=page.locator('textarea').first();await input.fill(`What was my exact private ${who} label earlier? Reply with the label then | continued. Do not use tools or delegate.`);await input.press('Enter');await page.getByText(`${who}-amber-7291 | continued`,{exact:true}).last().waitFor({timeout:120000});await snapshot();
 }else await snapshot();
 process.exit(0);
}catch(error){console.error(error);try{await snapshot()}catch{}process.exit(1)}
