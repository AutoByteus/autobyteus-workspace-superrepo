#!/usr/bin/env node
import { createWriteStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(new URL('../../../../autobyteus-web/package.json', import.meta.url))
const { chromium } = require('playwright-core')
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const webDir = path.resolve(scriptDir, '../../../../autobyteus-web')
const fixturePath = path.join(webDir, 'tests/e2e/fixtures/existing-run-model-config.page.vue')
const installedPagePath = path.join(webDir, 'pages/api-e2e-existing-run-model-config.vue')
const routePath = '/api-e2e-existing-run-model-config'

const getArg = (name, fallback = undefined) => {
  const inline = process.argv.find((value) => value.startsWith(`--${name}=`))
  if (inline) return inline.slice(name.length + 3)
  const index = process.argv.indexOf(`--${name}`)
  return index !== -1 && process.argv[index + 1] && !process.argv[index + 1].startsWith('--')
    ? process.argv[index + 1]
    : fallback
}

const timeoutMs = Number(getArg('timeout-ms', '90000'))
const outputDir = path.resolve(webDir, getArg('output-dir', '../tickets/in-progress/stopped-run-compatible-model/evidence/rendered'))
const explicitPort = getArg('port')
const browserExecutableArg = getArg('browser-executable', process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH)
const browserCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]
const executablePath = browserExecutableArg || browserCandidates.find((candidate) => existsSync(candidate))

await fs.mkdir(outputDir, { recursive: true })
const evidencePath = path.join(outputDir, 'existing-run-model-config-evidence.json')
const devLogPath = path.join(outputDir, 'nuxt-dev.log')
const evidence = {
  startedAt: new Date().toISOString(),
  platform: `${process.platform}-${process.arch}`,
  node: process.version,
  browserExecutable: executablePath || 'playwright-default',
  webDir,
  fixturePath,
  installedPagePath,
  routePath,
  graphqlOperations: [],
  scenarios: {},
  browserEvents: [],
  failures: [],
  cleanup: {},
}

const assert = (condition, message, details = undefined) => {
  if (condition) return
  const error = new Error(message)
  error.details = details
  throw error
}
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const clone = (value) => JSON.parse(JSON.stringify(value))
const waitFor = async (description, fn, timeout = timeoutMs, interval = 100) => {
  const startedAt = Date.now()
  let lastValue
  let lastError
  while (Date.now() - startedAt < timeout) {
    try {
      lastValue = await fn()
      if (lastValue) return lastValue
    } catch (error) {
      lastError = error
    }
    await delay(interval)
  }
  throw new Error(`Timed out waiting for ${description}; last=${JSON.stringify(lastValue)}${lastError ? `; error=${lastError.message}` : ''}`)
}
const choosePort = async () => explicitPort ? Number(explicitPort) : await new Promise((resolve, reject) => {
  const server = net.createServer()
  server.unref()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const address = server.address()
    const port = typeof address === 'object' && address ? address.port : 0
    server.close(() => resolve(port))
  })
})

const childHasExited = (child) => child.exitCode !== null || child.signalCode !== null
const waitForChildExit = async (child, timeout) => {
  if (childHasExited(child)) return true
  return await new Promise((resolve) => {
    let timer
    const finish = (exited) => {
      clearTimeout(timer)
      child.off('exit', onExit)
      resolve(exited)
    }
    const onExit = () => finish(true)
    child.once('exit', onExit)
    timer = setTimeout(() => finish(childHasExited(child)), timeout)
    if (childHasExited(child)) finish(true)
  })
}
const signalOwnedProcess = (child, signal) => {
  if (process.platform !== 'win32') {
    try {
      process.kill(-child.pid, signal)
      return 'process-group'
    } catch {}
  }
  if (!child.kill(signal) && !childHasExited(child)) throw new Error(`Child ${child.pid} rejected ${signal}`)
  return 'child'
}
const waitForProcessGroupExit = async (pid, timeout) => {
  if (process.platform === 'win32') return true
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeout) {
    try { process.kill(-pid, 0) } catch (error) {
      if (error?.code === 'ESRCH') return true
      throw error
    }
    await delay(100)
  }
  try { process.kill(-pid, 0); return false } catch (error) {
    if (error?.code === 'ESRCH') return true
    throw error
  }
}
const killOwnedProcess = async (child) => {
  if (!child) return { status: 'not-started' }
  const details = { pid: child.pid, initialExitCode: child.exitCode, initialSignalCode: child.signalCode }
  if (!childHasExited(child)) {
    details.sigtermTarget = signalOwnedProcess(child, 'SIGTERM')
    details.exitedAfterSigterm = await waitForChildExit(child, 5000)
    if (!details.exitedAfterSigterm) {
      details.sigkillTarget = signalOwnedProcess(child, 'SIGKILL')
      details.exitedAfterSigkill = await waitForChildExit(child, 5000)
      assert(details.exitedAfterSigkill, `Owned process ${child.pid} did not exit after SIGKILL`, details)
    }
  }
  details.finalExitCode = child.exitCode
  details.finalSignalCode = child.signalCode
  details.processGroupExited = await waitForProcessGroupExit(child.pid, 5000)
  assert(childHasExited(child) && details.processGroupExited, `Owned process ${child.pid} was not fully cleaned up`, details)
  return { status: 'terminated', ...details }
}
const cleanupFailure = (id, resource, error) => {
  const failure = { id, description: `Clean up owned ${resource}`, message: error instanceof Error ? error.message : String(error) }
  evidence.failures.push(failure)
  return `failed: ${failure.message}`
}

const modelConfig = (effort = 'low', summary = 'auto') => ({ reasoning_effort: effort, reasoning_summary: summary })
const launch = (effort = 'low') => ({
  runtime_kind: 'autobyteus',
  llm_model_identifier: 'gpt-5.6-luna',
  llm_config: modelConfig(effort),
  auto_execute_tools: false,
  skill_access_mode: 'PRELOADED_ONLY',
  workspace_root_path: '/workspace/browser-probe',
})
const teamTree = {
  schema_version: 2,
  created_at: '2026-08-25T00:00:00.000Z',
  archived_at: null,
  application_binding: null,
  handoffs: [],
  root_team: {
    address: '/',
    team_definition_id: 'team-definition-browser-1',
    team_definition_name: 'Browser Probe Team',
    team_run_id: 'team-run-browser-1',
    coordinator_address: '/coordinator',
    default_launch_configuration: launch('low'),
    task_executions: [],
    members: [
      {
        kind: 'configured_agent',
        address: '/coordinator',
        agent_definition_id: 'coordinator-definition',
        role: 'Coordinator',
        description: null,
        agent_run_id: 'coordinator-run-browser-1',
        platform_agent_run_id: null,
        launch_configuration: launch('low'),
      },
      {
        kind: 'configured_team',
        address: '/Nested',
        team_definition_id: 'nested-team-definition',
        role: 'Review Team',
        description: null,
        team_run_id: 'nested-team-run-browser-1',
        coordinator_address: '/Nested/lead',
        default_launch_configuration: launch('low'),
        task_executions: [],
        members: [
          {
            kind: 'configured_agent',
            address: '/Nested/lead',
            agent_definition_id: 'lead-definition',
            role: 'Lead',
            description: null,
            agent_run_id: 'lead-run-browser-1',
            platform_agent_run_id: null,
            launch_configuration: launch('low'),
          },
          {
            kind: 'configured_agent',
            address: '/Nested/reviewer',
            agent_definition_id: 'reviewer-definition',
            role: 'Reviewer',
            description: null,
            agent_run_id: 'reviewer-run-browser-1',
            platform_agent_run_id: null,
            launch_configuration: launch('low'),
          },
        ],
      },
    ],
  },
}
const findConfigured = (tree, address) => {
  const visit = (members) => {
    for (const member of members) {
      if (member.address === address) return member
      if (member.kind === 'configured_team') {
        const nested = visit(member.members)
        if (nested) return nested
      }
    }
    return null
  }
  return address === '/' ? tree.root_team : visit(tree.root_team.members)
}
const catalogSnapshot = {
  __typename: 'ProviderModelCatalogSnapshotObject',
  runtimeKind: 'autobyteus',
  ownerProvider: { __typename: 'CatalogProviderObject', id: 'OPENAI', name: 'OpenAI', providerType: 'OPENAI', isCustom: false, baseUrl: null, catalogMode: 'STATIC' },
  sources: [{ __typename: 'ModelSourceStatusObject', modelKind: 'LLM', state: 'READY', modelCount: 1, successfulUnitCount: 1, failedUnitCount: 0, safeMessage: null }],
  llmModels: [{
    __typename: 'ModelDetail',
    modelIdentifier: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    description: 'Deterministic browser fixture model.',
    value: 'gpt-5.6-luna',
    canonicalName: 'gpt-5.6-luna',
    providerId: 'OPENAI',
    providerName: 'OpenAI',
    providerType: 'OPENAI',
    runtime: 'autobyteus',
    hostUrl: null,
    configSchema: {
      type: 'object',
      properties: {
        reasoning_effort: { type: 'string', title: 'Reasoning Effort', enum: ['low', 'high'], default: 'low' },
        reasoning_summary: { type: 'string', title: 'Reasoning Summary', enum: ['none', 'auto'], default: 'auto' },
      },
    },
    maxContextTokens: 128000,
    activeContextTokens: 128000,
    maxInputTokens: 120000,
    maxOutputTokens: 8000,
    metadataProvenance: null,
  }],
  audioModels: [],
  imageModels: [],
  videoModels: [],
}

catalogSnapshot.llmModels.push({ ...clone(catalogSnapshot.llmModels[0]), modelIdentifier: 'larger-model', name: 'Larger Model', value: 'larger-model', canonicalName: 'larger-model', maxContextTokens: 272000, activeContextTokens: 272000 })
const state = {
  agentModel: 'gpt-5.6-luna',
  agentConfig: modelConfig('low'),
  teamTree: clone(teamTree),
  agentResumeReads: 0,
  teamResumeReads: 0,
  agentMutations: [],
  teamMutations: [],
  agentMutationMode: 'success',
}
const operationResponse = async (operationName, variables) => {
  if (operationName === 'GetAgentRunResumeConfig') {
    state.agentResumeReads += 1
    if (state.agentResumeReads === 1) await delay(700)
    return { data: { getAgentRunResumeConfig: {
      runId: 'agent-run-browser-1',
      isActive: false,
      metadataConfig: {
        agentDefinitionId: 'agent-definition-browser-1',
        workspaceRootPath: '/workspace/browser-probe',
        llmModelIdentifier: state.agentModel,
        llmConfig: clone(state.agentConfig),
        autoExecuteTools: false,
        skillAccessMode: 'PRELOADED_ONLY',
        runtimeKind: 'autobyteus',
        runtimeReference: { runtimeKind: 'autobyteus', sessionId: null, threadId: null, metadata: null },
      },
      modelConfigEditability: { editable: true, reason: null },
    } } }
  }
  if (operationName === 'GetTeamRunResumeConfig') {
    state.teamResumeReads += 1
    if (state.teamResumeReads === 1) await delay(700)
    return { data: { getTeamRunResumeConfig: {
      teamRunId: 'team-run-browser-1',
      isActive: false,
      executionTree: clone(state.teamTree),
      modelConfigEditability: { editable: true, reason: null },
    } } }
  }
  const options = (current) => ({ __typename: 'RunModelOptionsObject', currentModelIdentifier: current, currentContextTokens: current === 'larger-model' ? 272000 : 128000,
    replacements: current === 'larger-model' ? [] : [{ llmModelIdentifier: 'larger-model', contextTokens: 272000 }], unavailableReason: null })
  if (operationName === 'AgentRunModelOptions') return { data: { agentRunModelOptions: options(state.agentModel) } }
  if (operationName === 'TeamRunModelOptions') return { data: { teamRunModelOptions: ['/', '/coordinator', '/Nested', '/Nested/lead', '/Nested/reviewer'].map(scopeAddress => {
    const scope = findConfigured(state.teamTree, scopeAddress)
    const config = scopeAddress === '/' || scope.kind === 'configured_team' ? scope.default_launch_configuration : scope.launch_configuration
    return { scopeAddress, scopeKind: scopeAddress === '/' || scope.kind === 'configured_team' ? 'CONFIGURED_TEAM' : 'CONFIGURED_AGENT', ...options(config.llm_model_identifier) }
  }) } }
  if (operationName === 'GetProviderModelCatalogSnapshots') return { data: { providerModelCatalogSnapshots: [catalogSnapshot] } }
  if (operationName === 'GetRuntimeAvailabilities') return { data: { runtimeAvailabilities: [{ runtimeKind: 'autobyteus', enabled: true, reason: null }] } }
  if (operationName === 'UpdateStoppedAgentRunModelConfig') {
    state.agentMutations.push(clone(variables))
    await delay(250)
    if (state.agentMutationMode === 'run-active') {
      return { data: { updateStoppedAgentRunModelConfig: {
        success: false,
        outcome: 'RUN_ACTIVE',
        message: 'A supported external workflow resumed this run.',
        isActive: true,
        editability: { editable: false, reason: 'RUN_ACTIVE' },
        canonicalSelection: { llmModelIdentifier: state.agentModel, llmConfig: clone(state.agentConfig) },
        fieldErrors: [],
      } } }
    }
    state.agentModel = variables.input.llmModelIdentifier
    state.agentConfig = clone(variables.input.llmConfig)
    return { data: { updateStoppedAgentRunModelConfig: {
      success: true,
      outcome: 'UPDATED',
      message: 'Agent model settings saved.',
      isActive: false,
      editability: { editable: true, reason: null },
      canonicalSelection: { llmModelIdentifier: state.agentModel, llmConfig: clone(state.agentConfig) },
      fieldErrors: [],
    } } }
  }
  if (operationName === 'UpdateStoppedTeamRunModelConfigs') {
    state.teamMutations.push(clone(variables))
    await delay(250)
    for (const patch of variables.input.patches) {
      const target = findConfigured(state.teamTree, patch.scopeAddress)
      assert(target, `Mutation patch addressed unknown scope ${patch.scopeAddress}`)
      const configuration = patch.scopeAddress === '/' || target.kind === 'configured_team'
        ? target.default_launch_configuration
        : target.launch_configuration
      configuration.llm_model_identifier = patch.llmModelIdentifier
      configuration.llm_config = clone(patch.llmConfig)
    }
    return { data: { updateStoppedTeamRunModelConfigs: {
      success: true,
      outcome: 'UPDATED',
      message: 'Team model settings saved.',
      isActive: false,
      editability: { editable: true, reason: null },
      canonicalExecutionTree: clone(state.teamTree),
      fieldErrors: [],
    } } }
  }
  throw new Error(`Unexpected GraphQL operation '${operationName || 'unknown'}'`)
}

let pageInstalled = false
let devServer
let devLogStream
let browser
let context
let page
const runScenario = async (id, description, fn) => {
  const startedAt = new Date().toISOString()
  try {
    const details = await fn()
    evidence.scenarios[id] = { id, description, status: 'Pass', startedAt, finishedAt: new Date().toISOString(), details }
  } catch (error) {
    let browserState
    if (page) {
      try {
        browserState = await page.evaluate(() => {
          const app = document.querySelector('#__nuxt')?.__vue_app__
          const pinia = app?.config?.globalProperties?.$pinia
          const catalogs = pinia?._s?.get('llmProviderConfig')
          const draft = pinia?._s?.get('existingRunModelConfig')
          return {
            bodyText: document.body.innerText,
            catalogByRuntimeKind: catalogs?.catalogByRuntimeKind,
            draftState: draft ? {
              draft: draft.draft,
              schemaStateByAddress: draft.schemaStateByAddress,
              feedback: draft.feedback,
            } : null,
          }
        })
      } catch {}
    }
    const failure = { id, description, message: error instanceof Error ? error.message : String(error), details: error?.details, browserState, stack: error instanceof Error ? error.stack : undefined }
    evidence.scenarios[id] = { id, description, status: 'Fail', startedAt, finishedAt: new Date().toISOString(), failure }
    evidence.failures.push(failure)
    if (page) {
      try { await page.screenshot({ path: path.join(outputDir, `${id}-failure.png`), fullPage: true }) } catch {}
    }
  }
}

try {
  assert(existsSync(fixturePath), `Fixture does not exist: ${fixturePath}`)
  assert(!existsSync(installedPagePath), `Refusing to overwrite existing page: ${installedPagePath}`)
  await fs.copyFile(fixturePath, installedPagePath)
  pageInstalled = true

  const port = await choosePort()
  const baseUrl = `http://127.0.0.1:${port}`
  evidence.port = port
  evidence.baseUrl = baseUrl
  devLogStream = createWriteStream(devLogPath, { flags: 'w' })
  devServer = spawn('pnpm', ['dev', '--port', String(port)], {
    cwd: webDir,
    env: { ...process.env, BACKEND_NODE_BASE_URL: 'http://127.0.0.1:9', NUXT_TELEMETRY_DISABLED: '1' },
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  devServer.stdout.pipe(devLogStream)
  devServer.stderr.pipe(devLogStream)
  await waitFor('Nuxt fixture route readiness', async () => {
    if (devServer.exitCode !== null) throw new Error(`Nuxt dev server exited with ${devServer.exitCode}`)
    try { return (await fetch(`${baseUrl}${routePath}`)).ok } catch { return false }
  })

  browser = await chromium.launch({ headless: true, executablePath, args: ['--disable-dev-shm-usage'] })
  context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'Etc/UTC' })
  page = await context.newPage()
  page.on('console', (message) => evidence.browserEvents.push({ type: `console:${message.type()}`, text: message.text() }))
  page.on('pageerror', (error) => evidence.browserEvents.push({ type: 'pageerror', text: error.message }))
  page.on('requestfailed', (request) => evidence.browserEvents.push({ type: 'requestfailed', text: `${request.method()} ${request.url()} ${request.failure()?.errorText || ''}` }))
  // This local component inspection has no backend; avoid unrelated health-proxy failures.
  await page.route('**/rest/health', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'ok'})}));
  await page.route('**/graphql', async (route) => {
    const request = route.request()
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, OPTIONS' } })
      return
    }
    try {
      const payload = request.postDataJSON()
      const operationName = payload.operationName || /(?:query|mutation)\s+(\w+)/.exec(payload.query || '')?.[1] || ''
      evidence.graphqlOperations.push({ operationName, variables: clone(payload.variables ?? {}) })
      const body = await operationResponse(operationName, payload.variables ?? {})
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(body),
      })
    } catch (error) {
      evidence.failures.push({ id: 'GRAPHQL-HARNESS', message: error instanceof Error ? error.message : String(error) })
      await route.fulfill({ status: 500, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ errors: [{ message: error instanceof Error ? error.message : String(error) }] }) })
    }
  })

  await runScenario('LOCAL-RENDER', 'Implementation interaction/visual inspection; deterministic transport, no API/E2E acceptance', async () => {
    await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'domcontentloaded', timeout: timeoutMs })
    await page.locator('#agent-run-reasoning_effort').waitFor({state:'visible',timeout:timeoutMs})
    await waitFor('capacity ready', async () => !(await page.locator('[data-test="model-capacity-status"]').count()))
    const save = page.locator('[data-test="save-existing-model-config"]')
    const modelButton = (runtimeId) => page.locator(runtimeId).locator('xpath=../following-sibling::div[1]//button').first()
    assert(await page.locator('#agent-run-runtime-kind').isDisabled(), 'Runtime stays fixed')
    await modelButton('#agent-run-runtime-kind').click()
    await page.getByPlaceholder('Search models...').fill('Larger')
    await page.screenshot({path:path.join(outputDir,'agent-picker.png'),fullPage:true})
    await page.getByPlaceholder('Search models...').press('ArrowDown')
    await page.keyboard.press('Enter')
    await waitFor('model Save enabled', async()=>await save.isEnabled())
    await page.screenshot({path:path.join(outputDir,'agent-new-model.png'),fullPage:true})
    await save.click()
    await waitFor('saved new model', async()=>state.agentModel === 'larger-model' && (await page.locator('[role="status"]').allTextContents()).some(text=>text.includes('Agent model settings saved.')))
    await page.screenshot({path:path.join(outputDir,'agent-saved.png'),fullPage:true})
    await page.locator('[data-test="show-team"]').click()
    await page.locator('#team-scope-root-reasoning_effort').waitFor({state:'visible',timeout:timeoutMs})
    await page.locator('[data-test="team-member-overrides-toggle"]').click()
    await page.locator('button[aria-controls="team-scope-Nested-panel"]').click()
    await waitFor('team capacity ready', async()=>!(await page.locator('[data-test="model-capacity-status"]').count()))
    await modelButton('#existing--Nested-reviewer-runtime-kind').click()
    await page.locator('li').filter({hasText:'larger-model'}).click()
    await modelButton('#team-scope-Nested-runtime-kind').click()
    await page.locator('li').filter({hasText:'larger-model'}).click()
    await modelButton('#team-scope-root-runtime-kind').click()
    await page.locator('li').filter({hasText:'larger-model'}).click()
    await waitFor('team Save enabled', async()=>await save.isEnabled())
    await page.screenshot({path:path.join(outputDir,'team-propagated.png'),fullPage:true})
    await save.click()
    await waitFor('team save complete', async()=>state.teamMutations.length === 1 && (await page.locator('[role="status"]').allTextContents()).some(text=>text.includes('Team model settings saved.')))
    await page.setViewportSize({width:520,height:900})
    await page.screenshot({path:path.join(outputDir,'team-narrow.png'),fullPage:true})
    assert(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),'No horizontal overflow at 520px')
    return { agentMutation:state.agentMutations[0], teamMutation:state.teamMutations[0] }
  })
  const pageErrors = evidence.browserEvents.filter((event) => event.type === 'pageerror')
  if (pageErrors.length) evidence.failures.push({ id: 'BROWSER-PAGE-ERRORS', message: 'Unexpected browser page errors', details: pageErrors })
} catch (error) {
  evidence.failures.push({ id: 'HARNESS', message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined })
} finally {
  if (context) {
    try { await context.close(); evidence.cleanup.context = 'closed' } catch (error) { evidence.cleanup.context = cleanupFailure('CLEANUP-CONTEXT', 'browser context', error) }
  } else evidence.cleanup.context = 'not-started'
  if (browser) {
    try { await browser.close(); evidence.cleanup.browser = 'closed' } catch (error) { evidence.cleanup.browser = cleanupFailure('CLEANUP-BROWSER', 'browser', error) }
  } else evidence.cleanup.browser = 'not-started'
  try { evidence.cleanup.devServer = await killOwnedProcess(devServer) } catch (error) { evidence.cleanup.devServer = cleanupFailure('CLEANUP-DEV-SERVER', 'Nuxt dev server', error) }
  if (devLogStream) {
    try { await new Promise((resolve, reject) => { devLogStream.once('error', reject); devLogStream.end(resolve) }); evidence.cleanup.devLog = 'closed' } catch (error) { evidence.cleanup.devLog = cleanupFailure('CLEANUP-DEV-LOG', 'Nuxt log', error) }
  } else evidence.cleanup.devLog = 'not-started'
  if (pageInstalled) {
    try { await fs.rm(installedPagePath, { force: true }); assert(!existsSync(installedPagePath), 'Temporary fixture page still exists'); evidence.cleanup.temporaryPage = 'removed' } catch (error) { evidence.cleanup.temporaryPage = cleanupFailure('CLEANUP-TEMPORARY-PAGE', 'temporary Nuxt page', error) }
  } else evidence.cleanup.temporaryPage = 'not-installed'
  evidence.finishedAt = new Date().toISOString()
  evidence.result = evidence.failures.length ? 'Fail' : 'Pass'
  await fs.writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
}

if (evidence.failures.length) {
  console.error(`Existing run model-config probe failed with ${evidence.failures.length} failure(s). Evidence: ${evidencePath}`)
  for (const failure of evidence.failures) console.error(`- ${failure.id}: ${failure.message}`)
  process.exitCode = 1
} else {
  console.log(`Implementation rendered-result inspection passed. Evidence: ${evidencePath}`)
}
