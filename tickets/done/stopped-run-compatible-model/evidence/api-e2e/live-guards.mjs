import fs from 'node:fs/promises';import path from 'node:path';import{fileURLToPath}from'node:url';import assert from 'node:assert/strict';
const dir=path.dirname(fileURLToPath(import.meta.url));const e=JSON.parse(await fs.readFile(path.join(dir,'live-environment.json'),'utf8'));const t=JSON.parse(await fs.readFile(path.join(dir,'live-team.json'),'utf8'));
const gql=async(query,variables={})=>{const r=await fetch(e.serverUrl+'/graphql',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables})});const p=await r.json();if(p.errors)throw Error(JSON.stringify(p.errors));return p.data};
const agentFile=path.join(e.runtimeRoot,'memory/agents',e.runId,'run_metadata.json');
const saveAgent=()=>gql(`mutation($input:UpdateStoppedAgentRunModelConfigInput!){updateStoppedAgentRunModelConfig(input:$input){success outcome}}`,{input:{agentRunId:e.runId,llmModelIdentifier:'gpt-5.5',llmConfig:null}});
const saveTeam=()=>gql(`mutation($input:UpdateStoppedTeamRunModelConfigsInput!){updateStoppedTeamRunModelConfigs(input:$input){success outcome}}`,{input:{teamRunId:t.teamRunId,patches:[{scopeKind:'CONFIGURED_TEAM',scopeAddress:'/',llmModelIdentifier:'gpt-5.5',llmConfig:null}]}});
const record={startedAt:new Date().toISOString()};
try{
 let agentBefore=await fs.readFile(agentFile,'utf8'),teamBefore=await fs.readFile(t.treePath,'utf8');
 record.activeAgent=await saveAgent();record.activeTeam=await saveTeam();
 assert.equal(record.activeAgent.updateStoppedAgentRunModelConfig.outcome,'RUN_ACTIVE');assert.equal(record.activeTeam.updateStoppedTeamRunModelConfigs.outcome,'RUN_ACTIVE');
 assert.equal(await fs.readFile(agentFile,'utf8'),agentBefore);assert.equal(await fs.readFile(t.treePath,'utf8'),teamBefore);
 record.stopped=await gql(`mutation($a:String!,$t:String!){terminateAgentRun(agentRunId:$a){success} terminateAgentTeamRun(teamRunId:$t){success}}`,{a:e.runId,t:t.teamRunId});
 assert(record.stopped.terminateAgentRun.success&&record.stopped.terminateAgentTeamRun.success);
 record.archived=await gql(`mutation($a:String!,$t:String!){archiveStoredRun(runId:$a){success message} archiveStoredTeamRun(teamRunId:$t){success message}}`,{a:e.runId,t:t.teamRunId});
 assert(record.archived.archiveStoredRun.success&&record.archived.archiveStoredTeamRun.success);
 agentBefore=await fs.readFile(agentFile,'utf8');teamBefore=await fs.readFile(t.treePath,'utf8');
 record.archivedAgent=await saveAgent();record.archivedTeam=await saveTeam();
 assert.equal(record.archivedAgent.updateStoppedAgentRunModelConfig.outcome,'RUN_ARCHIVED');assert.equal(record.archivedTeam.updateStoppedTeamRunModelConfigs.outcome,'RUN_ARCHIVED');
 assert.equal(await fs.readFile(agentFile,'utf8'),agentBefore);assert.equal(await fs.readFile(t.treePath,'utf8'),teamBefore);record.result='Pass';
}catch(error){record.result='Fail';record.failure=String(error);process.exitCode=1}finally{await fs.writeFile(path.join(dir,'live-guards-result.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record,null,2))}
