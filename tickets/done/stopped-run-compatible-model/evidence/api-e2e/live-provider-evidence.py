# Read only this run's exact known provider session, never unrelated history.
import json,pathlib,hashlib,sys
p=pathlib.Path(__file__).resolve().parent;e=json.loads((p/'live-environment.json').read_text());m=json.loads((pathlib.Path(e['runtimeRoot'])/'memory/agents'/e['runId']/'run_metadata.json').read_text());sid=m['platformAgentRunId'];files=list((pathlib.Path.home()/'.codex/sessions').rglob('*'+sid+'*.jsonl'));assert len(files)==1
f=files[0];rows=[json.loads(l) for l in f.read_text().splitlines()];records=[]
for r in rows:
 v=r.get('payload',{});t=v.get('type')
 if r['type']=='turn_context':records.append({'timestamp':r.get('timestamp'),'type':r['type'],'model':v.get('model'),'turnId':v.get('turn_id'),'effort':v.get('effort')})
 elif r['type']=='compacted':records.append({'timestamp':r.get('timestamp'),'type':'compacted','payloadKeys':list(v),'payloadSha256':hashlib.sha256(json.dumps(v,sort_keys=True).encode()).hexdigest(),'retainsTestLabel':'violet-otter-6842' in json.dumps(v)})
 elif r['type']=='event_msg' and t in ['task_started','task_complete','context_compacted','token_count']:records.append({'timestamp':r.get('timestamp'),'type':t,**{k:v[k] for k in ['turn_id','last_agent_message','info','model_context_window'] if k in v}})
result={'observedAt':__import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),'path':str(f),'providerConversationId':sid,'localRunId':e['runId'],'savedModel':m['llmModelIdentifier'],'records':records}
(p/('live-provider-'+(sys.argv[1]if len(sys.argv)>1 else 'after')+'.json')).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
