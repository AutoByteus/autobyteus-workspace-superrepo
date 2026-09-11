// Requirements investigation only. Exercises current pure budget functions with
// synthetic values; does not validate a provider, model pair, or product journey.
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const source = fs.readFileSync(`${root}autobyteus-ts/src/agent/token-budget.ts`, 'utf8');
const code = stripTypeScriptTypes(source.replace(/^import .+;\r?\n/gm, ''));
const { resolveLlmRequestCapacity, resolveCompactionTokenBudget } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`,
);
const model = {
  maxContextTokens: 128000, activeContextTokens: null,
  maxInputTokens: null, maxOutputTokens: 32000,
  defaultSafetyMarginTokens: 256, defaultCompactionRatio: 0.8,
};
const policy = { triggerRatio: 0.8, safetyMarginTokens: 256 };
const cases = [
  ['A: baseline', model, { maxTokens: 8000 }, null],
  ['B: same context, larger output reservation', model, { maxTokens: 16000 }, null],
  ['C: same context, smaller provider input cap', { ...model, maxInputTokens: 100000 }, { maxTokens: 8000 }, null],
  ['D: same context, different model compaction default', { ...model, defaultCompactionRatio: 0.7 }, { maxTokens: 8000 }, null],
  ['E: unknown context and input cap', { ...model, maxContextTokens: null }, { maxTokens: 8000 }, null],
];
console.log(JSON.stringify({
  source: 'autobyteus-ts/src/agent/token-budget.ts',
  method: 'Node type erasure; import declarations removed; unmodified pure function bodies',
  scope: 'Synthetic current-code probe, not end-to-end or provider validation',
  cases: cases.map(([name, m, config, settings]) => {
    const capacity = resolveLlmRequestCapacity(m, config, settings);
    const budget = capacity ? resolveCompactionTokenBudget(capacity, m, config, policy, settings) : null;
    return { name, budget };
  }),
}, null, 2));
