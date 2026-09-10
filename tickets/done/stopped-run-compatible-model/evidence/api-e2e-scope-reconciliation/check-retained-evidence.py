"""Read-only evidence checks for API-REV-003; not new product execution."""
import copy
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

E = Path(__file__).resolve().parent
T = E.parent.parent
W = T.parents[2]
C = T / "evidence/api-e2e-classroom"


def read(path):
    return json.loads(path.read_text())


def sha(path):
    with path.open("rb") as f:
        return hashlib.file_digest(f, "sha256").hexdigest()


def git(*args):
    return subprocess.check_output(["git", *args], cwd=W)


checks = {}
baseline = read(E / "intake-integrity.json")
changed = [p for p, expected in baseline["preservedFiles"].items()
           if not Path(p).is_file() or sha(Path(p)) != expected]
checks["all214PreservedFilesUnchanged"] = not changed
checks["trackedFilesUnchangedSinceIntake"] = (
    hashlib.sha256(git("diff", "HEAD", "--binary")).hexdigest()
    == baseline["trackedDiffSha256"]
)
checks["indexUnchanged"] = (
    hashlib.sha256(git("diff", "--cached", "--binary")).hexdigest()
    == baseline["indexDiffSha256"]
)
checks["headUnchanged"] = git("rev-parse", "HEAD").decode().strip() == baseline["head"]
durable = read(T / "evidence/api-e2e/durable-test-source-audit.json")["paths"]
checks["threeDurableHashesMatchAPI_REV_001"] = len(durable) == 3 and all(
    sha(Path(p["path"])) == p["sha256"] for p in durable
)
old = read(C / "before-save-state.json")
saved = read(C / "after-save-state.json")
resumed = read(C / "student-resumed-state.json")


def selections(state):
    root = state["tree"]["rootTeam"]
    return [root["defaultLaunchConfiguration"], *[
        m["launchConfiguration"] for m in root["members"]]]


checks["allThreeScopesLunaBeforeAstraAfter"] = all(
    p["llmModelIdentifier"] == "gpt-5.6-luna" for p in selections(old)
) and all(p["llmModelIdentifier"] == "gpt-6-astra" for p in selections(saved))
checks["allThreeScopesKeepCodexRuntime"] = all(
    p["runtimeKind"] == "codex_app_server" for state in [old, saved]
    for p in selections(state)
)


def fixed_tree(state):
    state = copy.deepcopy(state)
    for p in selections(state):
        p.pop("llmModelIdentifier")
        p.pop("llmConfig")
    return state["tree"]


checks["fixedTreeUnchangedAcrossSave"] = fixed_tree(old) == fixed_tree(saved)
checks["localHistoryAndWorkspaceUnchangedAcrossSave"] = (
    old["nonTreeHashes"] == saved["nonTreeHashes"]
    and old["workspaceFiles"] == saved["workspaceFiles"]
)
checks["providerIDsAndFullTranscriptHashesUnchangedAcrossSave"] = [
    (p["address"], p["agentRunId"], p["providerId"], p["sha256"])
    for p in old["providers"]
] == [(p["address"], p["agentRunId"], p["providerId"], p["sha256"])
      for p in saved["providers"]]
checks["savedTreeUnchangedThroughBothContinuations"] = saved["tree"] == resumed["tree"]
save = read(C / "save-assertions.json")
checks["singleStoppedSaveExactThreePatches"] = (
    save["oneMutation"] and save["patchAddresses"] == ["/", "/professor", "/student"]
    and save["mutation"]["result"]["data"]["updateStoppedTeamRunModelConfigs"]["isActive"] is False
)
proof = read(C / "continuation-assertions.json")["proof"]
checks["bothMembersHaveOriginalLunaAndCompletedAstraTurn"] = len(proof) == 2 and all(
    p["turns"][0]["model"] == "gpt-5.6-luna"
    and p["turns"][1]["model"] == "gpt-6-astra"
    and p["turns"][1]["turnId"] == p["lastCompleted"]["turn_id"]
    and any(x["providerId"] == p["providerId"] and x["agentRunId"] == p["localAgentRunId"]
            for x in old["providers"])
    for p in proof
)
provider_proof = []
for p in proof:
    # Inspect only the two previously owned transcripts; no new provider requests.
    records = [json.loads(line) for line in Path(p["providerPath"]).read_text().splitlines() if line.strip()]
    contexts = [r["payload"] for r in records if r.get("type") == "turn_context"]
    completions = [r["payload"] for r in records if r.get("type") == "event_msg"
                   and r.get("payload", {}).get("type") == "task_complete"]
    provider_proof.append(all(any(
        c.get("turn_id") == turn["turnId"] and c.get("model") == turn["model"]
        for c in contexts) for turn in p["turns"])
        and any(c.get("turn_id") == p["lastCompleted"]["turn_id"]
                and c.get("last_agent_message") == p["lastCompleted"]["last_agent_message"]
                for c in completions))
checks["retainedOriginalProviderRecordsCorroborateBothProofs"] = all(provider_proof)
checks["bothEarlierFactsRetained"] = (
    proof[0]["lastCompleted"]["last_agent_message"] == "maple-orbit-7391 | 56 | SECOND_LESSON_DONE"
    and "7 × 8" in proof[1]["lastCompleted"]["last_agent_message"]
    and "56" in proof[1]["lastCompleted"]["last_agent_message"]
    and save["privateMarkerAbsentFromWorkspaceFiles"]
)
r1 = read(T / "evidence/api-e2e/result-summary.json")
r2 = read(C / "result-summary.json")
checks["historicalResultsRetained"] = (
    r1["result"] == "Pass" and r1["finalConfidencePercent"] == 95
    and r2["overallResult"] == "Fail" and r2["finalConfidencePercent"] == 84.3
    and r2["cases"]["API-C16"] == "Fail" and r2["cases"]["API-C19"] == "Pass"
)
checks["separateIssueEvidenceAndExactUserConfirmationRetained"] = (
    "yesss. so i think our ticket is fine" in (T / "evidence/code-review-CRR-004/separate-issue-note.md").read_text()
    and r2["failureBeforeModelChange"] and r2["remainingFailureIds"] == ["API-F001"]
)
build = read(T / "evidence/delivery-electron/build-result.json")
checks["deliveryAppImageStillMatchesDR002"] = sha(Path(build["artifact"]["path"])) == build["artifact"]["sha256"]

if "--final" in sys.argv:
    report = (T / "api-e2e-execution-coverage-report.md").read_text()
    historical = report.split("<!-- API-REV-002 retained report begins -->\n", 1)[1].split(
        "<!-- API-REV-002 retained report ends -->", 1)[0]
    checks["historicalFullReportBytePreserved"] = hashlib.sha256(historical.encode()).hexdigest() == baseline[
        "priorCanonicalSha256"]["api-e2e-execution-coverage-report.md"]
    checks["fourCanonicalArtifactsRecordCurrentRevision"] = all("API-REV-003" in (T / f).read_text() for f in [
        "api-e2e-coverage-investigation.md", "api-e2e-execution-coverage-report.md",
        "api-e2e-test-case-ledger.md", "api-e2e-revision-record.md"])
    checks["currentTicketPassAndSeparateUnresolvedIssueExplicit"] = all(x in report.split(
        "<!-- API-REV-002 retained report begins -->", 1)[0] for x in ["Pass", "95%", "API-F001", "unresolved", "CRF-002", "Not Required"])
    check = subprocess.run(["git", "diff", "--check"], cwd=W, capture_output=True, text=True)
    checks["gitDiffCheck"] = check.returncode == 0

result = {"revision": "API-REV-003", "case": "API-C20", "checkedAt": datetime.now(timezone.utc).isoformat(),
          "mode": "final" if "--final" in sys.argv else "retained-evidence",
          "result": "Pass" if all(checks.values()) else "Fail", "checks": checks,
          "preservedFileCount": len(baseline["preservedFiles"]), "changedPreservedPaths": changed,
          "newRuntimeOrSuiteExecution": False, "changedProductionOrDurablePaths": []}
output = E / ("final-checks.json" if "--final" in sys.argv else "retained-evidence-checks.json")
output.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
sys.exit(0 if all(checks.values()) else 1)
