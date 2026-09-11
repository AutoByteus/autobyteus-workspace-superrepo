import json,subprocess,hashlib,datetime,re,yaml
from pathlib import Path
x=Path(__file__).parent;d=x/'published';root=Path('/home/autobyteus/workspace/autobyteus-workspace')
r=json.loads(subprocess.check_output(['gh','api','repos/AutoByteus/autobyteus-workspace/releases/tags/v1.4.69'],text=True)); (x/'github-release.json').write_text(json.dumps(r,indent=2)+'\n')
assert not r['draft'] and not r['prerelease'];assert r['tag_name']=='v1.4.69'
assert r['body'].strip()==(root/'.github/release-notes/release-notes.md').read_text().strip()
assets={a['name']:a for a in r['assets']}; assert len(assets)==21,len(assets)
checks=[]
for name,a in assets.items():
 assert a['state']=='uploaded' and a['size']>0
 assert re.fullmatch(r'sha256:[0-9a-f]{64}',a['digest']),name
for p in sorted(d.glob('latest*.yml')):
 a=assets[p.name];assert hashlib.sha256(p.read_bytes()).hexdigest()==a['digest'].split(':')[1]
 data=yaml.safe_load(p.read_text()); assert data['version']=='1.4.69'
 for f in data['files']:
  name=f['url'];assert name in assets,name
  if 'size' in f: assert assets[name]['size']==f['size'],name
  else: assert p.name=='latest.yml' and name=='AutoByteus_personal_windows-1.4.69.exe'
  assert len(f['sha512'])==88
  if name.endswith('.AppImage'):assert f['blockMapSize']>0
 checks.append({'metadata':p.name,'sha256':a['digest'],'version':data['version'],'fileReferences':[f['url'] for f in data['files']],'advertisedReferencedSizesMatch':True,'unadvertisedSizes':[f['url'] for f in data['files'] if 'size' not in f]})
assert {c['metadata'] for c in checks}=={'latest-linux.yml','latest-linux-arm64.yml','latest-mac.yml','latest.yml'}
for p in d.iterdir():
 if p.is_file() and p.name in assets:
  assert p.stat().st_size==assets[p.name]['size']
  assert hashlib.sha256(p.read_bytes()).hexdigest()==assets[p.name]['digest'].split(':')[1]
out={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'releaseURL':r['html_url'],'releaseID':r['id'],'releaseTag':r['tag_name'],'stablePublicRelease':True,'assetCount':len(assets),'allAssetsUploadedNonemptyWithSHA256':True,'curatedBodyMatchesTaggedNotes':True,'metadata':checks,'downloadedAssetDigestsMatch':True,'scope':'Downloaded metadata/APK/gateway bytes verified; all desktop platform package/smoke/signature checks attributed to tagged CI. No local GUI, installed-user upgrade, or public App Store acceptance claimed.'}
(x/'published-assets-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
