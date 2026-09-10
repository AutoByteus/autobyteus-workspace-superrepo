import json,pathlib,sys,hashlib,datetime
E=pathlib.Path(__file__).resolve().parent;env=json.loads((E/'environment.json').read_text());team=json.loads((E/'team-created.json').read_text());phase=sys.argv[1];root=pathlib.Path(team['treePath']).parent;tree=json.loads(pathlib.Path(team['treePath']).read_text());workspace=pathlib.Path(env['workdir']);sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
providers=[]
for m in tree['rootTeam']['members']:
 sid=m.get('platformAgentRunId');records=[]
 if not sid:continue
 files=list((pathlib.Path.home()/'.codex/sessions').rglob('*'+sid+'*.jsonl'));assert len(files)==1;f=files[0]
 for line in f.read_text().splitlines():
  r=json.loads(line);p=r.get('payload',{});t=p.get('type');base={'at':r.get('timestamp'),'type':r.get('type')}
  if r['type']=='turn_context':records.append({**base,'model':p.get('model'),'turnId':p.get('turn_id')})
  elif r['type']=='event_msg'and t in ['task_started','task_complete','turn_aborted']:records.append({**base,**{k:p[k]for k in ['type','turn_id','last_agent_message','reason']if k in p}})
  elif r['type']=='response_item'and t in ['custom_tool_call','custom_tool_call_output','function_call','function_call_output']:
   # Exact owned classroom conversations only; omit encrypted/internal reasoning payloads.
   records.append({**base,**{k:p[k]for k in ['type','name','call_id','input','arguments','output']if k in p}})
 providers.append({'address':m['address'],'agentRunId':m['agentRunId'],'providerId':sid,'file':str(f),'sha256':sha(f),'records':records})
state={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':phase,'tree':tree,'treeSha256':sha(pathlib.Path(team['treePath'])),'nonTreeHashes':{str(p.relative_to(root)):sha(p)for p in root.rglob('*')if p.is_file()and p.name!='team_run_execution_tree.json'},'workspaceFiles':{str(p.relative_to(workspace)):p.read_text(errors='replace')for p in workspace.rglob('*')if p.is_file()},'providers':providers}
(E/(phase+'-state.json')).write_text(json.dumps(state,indent=2)+'\n');print(json.dumps({'phase':phase,'members':[(p['address'],p['providerId'])for p in providers],'files':list(state['workspaceFiles'])}))
