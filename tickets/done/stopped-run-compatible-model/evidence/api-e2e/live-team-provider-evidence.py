import json,pathlib
from datetime import datetime,timezone
p=pathlib.Path(__file__).resolve().parent;t=json.loads((p/'live-team.json').read_text());save=json.loads((p/'live-team-save-result.json').read_text());current=json.loads(pathlib.Path(t['treePath']).read_text());observations=[]
for who,expected in [('lead','gpt-5.6-sol'),('reviewer','gpt-5.6-terra')]:
 node=lambda tree:next(n for n in tree['rootTeam']['members'] if n['address']=='/Nested')['members']
 before=next(n for n in node(save['before']) if n['address']=='/Nested/'+who);after=next(n for n in node(current) if n['address']=='/Nested/'+who)
 assert before['agentRunId']==after['agentRunId'];assert before['platformAgentRunId']==after['platformAgentRunId'];sid=after['platformAgentRunId'];files=list((pathlib.Path.home()/'.codex/sessions').rglob('*'+sid+'*.jsonl'));assert len(files)==1
 rows=[json.loads(l) for l in files[0].read_text().splitlines()];records=[]
 for r in rows:
  v=r.get('payload',{})
  if r['type']=='turn_context':records.append({'timestamp':r.get('timestamp'),'type':'turn_context','model':v.get('model'),'turnId':v.get('turn_id')})
  elif r['type']=='event_msg' and v.get('type')=='task_complete':records.append({'timestamp':r.get('timestamp'),'type':'task_complete','turnId':v.get('turn_id'),'answer':v.get('last_agent_message')})
 assert [r for r in records if r['type']=='turn_context'][0]['model']=='gpt-5.6-luna';assert [r for r in records if r['type']=='turn_context'][-1]['model']==expected
 assert [r for r in records if r['type']=='task_complete'][-1]['answer']==who+'-amber-7291 | continued'
 observations.append({'scope':after['address'],'localAgentRunId':after['agentRunId'],'providerConversationId':sid,'path':str(files[0]),'savedModel':after['launchConfiguration']['llmModelIdentifier'],'records':records})
result={'result':'Pass','observedAt':datetime.now(timezone.utc).isoformat(),'rootTeamRunId':t['teamRunId'],'observations':observations};(p/'live-team-provider-evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
