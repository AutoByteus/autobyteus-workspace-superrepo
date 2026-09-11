// Executes the production Codex reader using the configured server launch seam.
// No saved run or inference is requested. Loader only resolves local TS sources.
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && specifier.endsWith('.js') && context.parentURL?.startsWith('file:')) {
      const url = new URL(specifier.slice(0,-3)+'.ts', context.parentURL);
      if (existsSync(url)) return {url: url.href, shortCircuit: true};
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts')) return { format: 'module', source: stripTypeScriptTypes(readFileSync(fileURLToPath(url),'utf8'), {mode:'transform'}), shortCircuit: true };
    return nextLoad(url,context);
  }
});
const printResult = console.log.bind(console);
console.log = (...args) => console.error(...args);
const { CodexModelCapacityReader } = await import('../../../../autobyteus-server-ts/src/runtime-management/codex/client/codex-model-capacity-reader.ts');
const { getCodexAppServerClientManager } = await import('../../../../autobyteus-server-ts/src/runtime-management/codex/client/codex-app-server-client-manager.ts');
const observations = [];
const cwd = process.cwd();
const clients = getCodexAppServerClientManager();
try {
  const client = await clients.acquireClient(cwd);
  try {
    const catalog = await client.request('model/list', {includeHidden:false});
    const ids = catalog.data.map(row=>row.model);
    const capacities = await new CodexModelCapacityReader(clients).resolveMany(cwd, ids);
    observations.push({runtime:'codex_app_server',observedAt:new Date().toISOString(),scope:'production reader; metadata only, no feature acceptance',cwd,capacities});
  } finally { await clients.releaseClient(cwd); }
} finally { await clients.close(); }
if (process.argv.includes('--claude')) {
 const { ClaudeSdkClient } = await import('../../../../autobyteus-server-ts/src/runtime-management/claude/client/claude-sdk-client.ts');
 const claude = new ClaudeSdkClient();
 const catalog = await claude.listModels();
 observations.push({runtime:'claude_agent_sdk',observedAt:new Date().toISOString(),scope:'production Claude client auth/environment; metadata only',capacities:await claude.resolveContextCapacities(cwd,catalog.map(row=>row.model_identifier))});
}

const json = JSON.stringify({observations},null,2) + '\n';
const outputPath = process.argv.find(arg => arg.startsWith('--output='))?.slice('--output='.length);
if (outputPath) writeFileSync(outputPath, json);
printResult(json);
