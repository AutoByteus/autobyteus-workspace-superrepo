"""Read-only candidate/content audit; writes evidence only beside this script."""
from pathlib import Path
import datetime, hashlib, json, subprocess, re
W = Path(__file__).resolve().parents[5]
T = W / 'tickets/in-progress/stopped-run-compatible-model'
E = T / 'evidence/delivery'
def git(*args): return subprocess.check_output(['git', *args], cwd=W)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
audit = json.loads((T/'evidence/code-review-CRR-003/scope-audit.json').read_text())
checks = []
for row in audit['paths']:
    p = W / Path(row['path']).relative_to(W)
    checks.append({'path': str(p.relative_to(W)), 'sha256': sha(p), 'matchesCRR003': sha(p) == row['sha256']})
assert all(row['matchesCRR003'] for row in checks)
test_paths = [row['path'] for row in checks]
diff = git('diff', 'HEAD', '--', *test_paths)
assert diff == (T/'evidence/api-e2e/durable-tests.diff').read_bytes()
assert sha(T/'code-review-report.md') == audit['implementationReviewReport']['sha256']
changed = git('diff', '--name-only', 'HEAD').decode().splitlines()
allowed = set(test_paths)
assert all(p in allowed or p.startswith('tickets/in-progress/stopped-run-compatible-model/') or '/docs/' in p for p in changed)
base = git('rev-parse', 'origin/personal').decode().strip()
assert base == 'a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27'
subprocess.run(['git','merge-base','--is-ancestor','origin/personal','HEAD'], cwd=W, check=True)
assert not git('log','--format=%H','HEAD..origin/personal').strip()
subprocess.run(['git','diff','--check'], cwd=W, check=True)
# Check local Markdown links introduced by this delivery, including anchors.
docs = [p for p in changed if '/docs/' in p]
link_checks=[]
for name in docs:
    doc=W/name
    added='\n'.join(line[1:] for line in git('diff','--',name).decode().splitlines() if line.startswith('+') and not line.startswith('+++'))
    for target in re.findall(r'\]\(([^)]+)\)', added):
        if '://' in target: continue
        part, _, anchor = target.partition('#')
        dest = (doc.parent / part).resolve() if part else doc
        assert dest.is_file(), target
        if anchor:
            headings=re.findall(r'^#+\s+(.+)$',dest.read_text(),re.M)
            ids=[re.sub(r'[^\w\- ]','',h.lower()).replace(' ','-') for h in headings]
            assert anchor in ids,(target,ids)
        link_checks.append({'source':name,'target':target,'result':'Pass'})
upstream=[]
for p in sorted(T.rglob('*')):
    if not p.is_file() or E in p.parents: continue
    if p.parent == T and p.name in ['docs-sync-report.md','release-deployment-report.md','handoff-summary.md','release-notes.md','delivery-revision-record.md']: continue
    upstream.append({'path':str(p.relative_to(W)),'sha256':sha(p),'bytes':p.stat().st_size})
(E/'upstream-package-manifest.json').write_text(json.dumps(upstream,indent=2)+'\n')
result={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(), 'result':'Pass',
 'head':git('rev-parse','HEAD').decode().strip(),'branch':git('branch','--show-current').decode().strip(),
 'trackedBase':base,'newBaseCommitsToIntegrate':0,'durableTests':checks,
 'durableDiffMatchesApi':True,'durableDiffSha256':hashlib.sha256(diff).hexdigest(),
 'sourceReviewReportUnchangedFromCRR003':True,'noProductionSourceEditsSinceReviewedHEAD':True,
 'docs':[{'path':p,'sha256':sha(W/p)} for p in docs], 'newLocalDocLinks':link_checks,
 'upstreamManifestFileCount':len(upstream),'diffCheck':'Pass',
 'excludedGeneratedDirectories':['autobyteus-application-backend-sdk/dist/','autobyteus-application-sdk-contracts/dist/'],
 'testRerun':'Not needed: no new base commits or source/test delivery changes; API-REV-001 and CRR-003 remain applicable.',
 'userVerification':'Not yet received','repositoryFinalization':'Not performed'}
(E/'candidate-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
