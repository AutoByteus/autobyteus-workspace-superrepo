import urllib.request,json,hashlib,datetime,pathlib
x=pathlib.Path(__file__).parent
repo='autobyteus/autobyteus-server'
with urllib.request.urlopen(f'https://auth.docker.io/token?service=registry.docker.io&scope=repository:{repo}:pull',timeout=30) as r:
 token=json.load(r)['token']
checks=[]
for tag in ['1.4.69','latest']:
 req=urllib.request.Request(f'https://registry-1.docker.io/v2/{repo}/manifests/{tag}',headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json'})
 with urllib.request.urlopen(req,timeout=60) as r:
  body=r.read();digest=r.headers.get('Docker-Content-Digest');d=json.loads(body)
 assert digest=='sha256:'+hashlib.sha256(body).hexdigest()
 platforms=sorted(m['platform']['os']+'/'+m['platform']['architecture'] for m in d['manifests']);assert platforms==['linux/amd64','linux/arm64'],platforms
 (x/f'docker-manifest-{tag}.json').write_text(json.dumps(d,indent=2)+'\n')
 checks.append({'tag':tag,'digest':digest,'platforms':platforms,'children':[{'digest':m['digest'],'platform':m['platform']} for m in d['manifests']]})
assert checks[0]['digest']==checks[1]['digest']
out={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'repository':repo,'checks':checks,'stableLatestMatchesVersionedDigest':True,'verification':'Anonymous Docker Registry v2 manifest/index GET; content digest checked from actual bytes. No container launched and no existing deployment upgraded.'}
(x/'docker-publication-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
