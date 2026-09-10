# AutoByteus Agents

This repository contains reusable AutoByteus agent and agent-team definitions.

## Standalone Agents

### Codex

The Codex wrapper agent is a lightweight standalone agent that mirrors the Codex-style general assistant shown in the app: it keeps the runtime prompt intentionally thin, attaches the global `software-engineering-workflow-skill`, and exposes browser, media, image, speech, and device-emulation tools without adding repository shell/file tools.

### Pitch Practice Investor

The pitch practice investor simulates a startup investor for spoken pitch rehearsal. It studies user-provided startup materials from the conversation, then runs a realistic mock investor pitch round with focused questions, constructive pressure, and optional feedback. It is intentionally lightweight and uses only the `speak` tool during live pitch practice.

### Resume Designer

The resume designer creates resume packages from user input or supplied resume sources, selects or authors an audience-appropriate pure-text style brief, dynamically generates a browser-rendered frontend resume app from that brief, starts a preview when possible, reviews it in the embedded in-app browser when available, verifies the render, and exports a print-ready PDF. It treats the frontend source as the editable resume system and the PDF as the default hiring-workflow handoff artifact.

### Research Engineer

The research engineer is a standalone agent for dynamic research tasks: broad source discovery, internet and website research when allowed, paper or PDF retrieval when allowed, continuous research notes, research planning, literature search, paper understanding, implementation when needed, local setup when needed, empirical validation when needed, benchmarking, result analysis, illustrative HTML explanation, self-review, and iterative research decisions. It is meant for work where the right execution path depends on the topic, such as reproducing a paper, implementing attention from scratch, setting up a research model locally, debugging a training run, comparing algorithms, or evaluating whether a research idea actually improves a metric.

### Paper Research Assistant

The paper research assistant is a standalone agent for the common paper-reading workflow: search for relevant papers from a user question or topic, retrieve a supplied paper from a link, identifier, PDF, or local file, extract paper metadata and detailed content, and answer user questions grounded in the paper. It is intentionally narrower than the research engineer: it focuses on discovery, paper ingestion, paper dossiers, concise comparison, and evidence-aware paper QA rather than implementation, reproduction, training, or benchmarking.

### Skill Optimizer

The skill optimizer is a lightweight standalone agent that uses the shared `skill-optimizer` skill to review and improve existing skills for structure, grounding, clarity, consistency, and economy while preserving their intended behavior and quality gates.

### Agent Team Architect

The [Agent Team Architect](agents/agent-team-architect/agent.md) creates new agent-team packages and updates existing packages while preserving clear ownership, durable artifacts, cross-file consistency, and result-based handoffs. Its bundled [`agent-team-architecture`](agents/agent-team-architect/skills/agent-team-architecture/SKILL.md) skill exposes two modes only: `create` and `update`; optimization, repair, and consistency correction are update intents rather than separate agents or modes.

## Software Development Department

The software development department is the end-to-end software entrypoint. `requirements_engineer` starts each independent package, coordinates the requirements boundary, and returns the verified terminal result. It connects the independent Product Design & Prototyping and Software Engineering teams. Requirements Engineer forwards the user's explicit or clarified Product Design request and requirements context to Product Prototyper when present; Product Prototyper selects its own mode and owns its product-design workflow. After explicit approval, Requirements Engineer records a preliminary architecture-design routing assessment and sends either a bounded direct-implementation package to Implementation Engineer or an architecture-design-needed/unclear package to Architecture Designer.

## Requirements Engineer

Requirements Engineer turns an initial product or technical request into an evidence-grounded, explicitly user-approved requirements package, then assesses whether architecture design is needed. It owns current and desired behavior, scope, acceptance criteria, user-stated Product Design requests, requirement revision history, preliminary downstream routing, and department-level terminal result coordination. Product Design & Prototyping is an independent specialist team: Requirements Engineer consumes its delivered UI/UX evidence but does not select its mode or manage its repository, tickets, commits, or internal workflow.

## Product Design & Prototyping Team

The product design and prototyping team independently maintains the prototype repository for each product surface or independent concept package. `product_prototyper` owns prototype intake, tickets, per-ticket branches/worktrees, commits, integration, and two explicit modes: `exploratory-requirements-visualizer` for abstract or product-independent clarification, and `product-experience-prototyper` for incremental product-experience evolution or a new product-facing experience. Its repository-management skill handles isolation and lifecycle; the selected mode skill handles the experience work. `prototype_bootstrapper` owns only current-experience baseline discovery, parity implementation, and bootstrap evidence in the Product-assigned worktree. The team uses dynamic handoff rules plus `send_message_to` for baseline routing and cross-team results.

## Software Engineering Team

The software engineering team consumes either an approved requirements package routed directly for bounded implementation or an architecture-design-needed package. Architecture Designer completes technical design when selected and classifies `task_size` as Small, Medium, or Large plus `architectural_risk` as Low or High. Small/Medium low-risk work can proceed directly through implementation and API/E2E validation; Large or High-risk work uses independent architecture and source-review gates before validation. After the user verifies the result and `delivery_engineer` completes finalization, Delivery Engineer returns the `Delivery Completed` package directly to Requirements Engineer, which verifies the final evidence and returns the department result through the applicable message-based handoff rule.

## Research Engineering Team

The research engineering team is organized as a lean two-role loop for research-heavy engineering tasks: a `research_scientist` owns adaptive source discovery, immediate source-by-source research notes, prior-art and state-of-work assessment, paper and repository investigation, source-code reading when needed, research framing, lightweight exploratory probes, metrics, expected outcomes, and the `implementation-plan.md` handoff contract; an `implementation_engineer` owns minimal implementation, run execution, training or benchmark monitoring, validation evidence, requested output artifacts, and detailed feedback. It is meant for work where the right path emerges through repeated research, implementation/probing, validation, analysis, and revised implementation plans.

## STORM Team

The STORM team is a Stanford STORM-inspired research-writing workflow for knowledge curation. It takes a topic through `topic_research_coordinator`, `perspective_miner`, `expert_interviewer`, `outline_architect`, `cited_article_writer`, and `article_polisher_verifier`, mirroring STORM's pre-writing focus on multi-perspective retrieval-grounded question asking, outline synthesis, cited article generation, and article polishing.

## Software Product Promo Video Team

The software product promo video team is organized as a product-marketing video workflow for software products, mobile apps, websites, and SaaS tools. It takes supplied screenshots, recordings, product links, brand material, or rough notes through a single promo director for positioning, approved script, voiceover generation, measured timing, and audio-informed storyboard, then continues through a merged visual director for visual planning and production, an independent visual reviewer for visual QA and user approval, optional captions when requested, edit assembly, and final promotional video QA. The visual director maintains `visual-source-index.md` as the durable source of truth for supplied images, generated or edited variants, lineage, missing visual needs, and final-use status. The team defaults to visuals plus narration instead of added explanatory text overlays.

## Narrated Presentation Video Team

The narrated presentation video team is organized as a slide-based explainer and teaching-style presentation workflow. It takes user-provided materials, links, rough notes, documents, or topics through a presentation director for research, explanation framing, narration script writing, and slide storyboard planning, then requires full narration-script review before slide/video production, voiceover generation, and simple still-slide video assembly. The producer maintains `media-resource-index.md` as the durable registry for source media, generated slide images, audio clips, logs, and final exports.

## Classroom Simulation Team

The classroom simulation team is organized as a two-role teacher-student demo for agent-to-agent communication. Both agents start classroom file work with `pwd` and write classroom files under the current workspace returned by `pwd`. The `professor` writes assignments or feedback to files with `run_bash`, then sends them to `student` through `send_message_to` with the file paths as references. The `student` reads the referenced file, writes the answer file under the same workspace, and replies to `professor` through `send_message_to`.

## Research To Deck Team

The research-to-deck team is organized as a two-specialist workflow that takes a topic from deep research and reasoning through infographic-style PowerPoint deck production.

## Manga Video Studio Team

The manga video studio team is organized as a story-first creative workflow that takes a manga idea from canon and character design through storyboard, consistent image generation, and narrated motion-comic video assembly.

## Kids Coloring Story Team

The kids coloring story team is organized as a child-friendly printable production workflow for short multi-page A4 coloring stories, coloring bookmarks, coloring sheets, mini coloring books, and activity pages. It takes a theme, Bible verse, value, rough story, or visual idea through age-aware story/activity planning, user-approved page sequence, cute black-and-white line-art asset production, independent child-experience review, and print-ready PDF/PNG packaging. By default, each story image gets its own A4 page; combined contact sheets are preview-only unless explicitly requested.

## Kids Picture Story Team

The kids picture story team is organized as a reading-first illustrated picture-book workflow. It takes an original story, gentle adaptation, source-grounded theme, or rough idea through age- and reading-level-aware story editing, a normally 21-28-page storyboard with rationale for deviations, cohesive full-color page illustration with exact approved words on text-bearing pages or explicit word-free pages, independent picture-book review, and ordered digital or optional print/booklet exports. It is the reading-first counterpart to the kids coloring story team and produces book pages and exports rather than coloring or activity packages.

## Bible Learning Team

The Bible learning team is organized as a context-first teaching workflow that takes a passage, topic, or question from deep background research through teaching preparation, critical review, and default slide-deck production unless the user explicitly wants a teaching-only result.

## Article Writing Team

The article writing team is organized as a two-specialist research-to-article and style-aware writing workflow. The `article_writer` owns the understanding stage as well as drafting: supplied-source reading, workspace and source-code discovery, online research when useful and allowed, documentation or paper reading, source indexing, claim/evidence mapping, style-profile selection through a team-local bundled author-style skill, outline creation, full draft production, bilingual adaptation, and revision. The `article_reviewer` owns the publication-readiness gate for understanding sufficiency, evidence support, outline quality, article structure, style fit, platform fit, bilingual fidelity, and final revision routing.

Each role-agent folder always includes:

- `agent.md`: distilled runtime prompt
- `agent-config.json`: runtime wiring such as `skillNames`, tools, and processors

When a role owns a local bundled skill, the agent folder also includes a `skills/` subtree:

- `skills/<skill-name>/SKILL.md`: fuller specialist workflow and collaboration guidance
- `skills/<skill-name>/templates/`: role-specific artifacts and output templates

Some bundles also include richer local support files such as `skills/<skill-name>/references/` and `skills/<skill-name>/scripts/` when the underlying workflow depends on them.

## Markdown File Reference Style

When documentation or skills refer to a concrete repo-local source file, template, reference document, or script, use a Markdown link instead of a bare path.

Good examples:

- `[design-principles.md](design-principles.md)`
- `[product-promo-brief-template.md](templates/product-promo-brief-template.md)`
- `[shared/narrated-presentation-principles.md](shared/narrated-presentation-principles.md)`

Use backticks for generated runtime artifacts, commands, JSON keys, identifiers, placeholder layout paths, and file names that are examples rather than links to one concrete file. For example, `presentation-brief.md`, `skillNames`, and `<team-root>/agents/<agent-id>/skills/<skill-name>/SKILL.md` are not source links.

This keeps skills easy to navigate while preserving clear monospace formatting for generated artifacts and code-like identifiers.

## Supported Layouts

AutoByteus currently supports two skill packaging patterns.

### 1. Agent-bundled skill

Use this when a skill belongs to one specific agent bundle.

```text
<definition-root>/
  agents/
    <agent-id>/
      agent.md
      agent-config.json
      skills/
        <skill-name>/
          SKILL.md
          templates/
          references/
          scripts/
```

Rules:

- Agent-owned skills must live under the agent's `skills/<skill-name>/` folder, even when the agent has only one skill.
- `agent-config.json` should explicitly declare:
  - `"skillNames": ["<skill-name>"]`
- The skill folder name, configured `skillNames` entry, and `SKILL.md` frontmatter `name:` should match.
- `SKILL.md` being present does not auto-attach that skill to the agent at runtime. Runtime attachment is explicit through `skillNames`.

This repository uses both patterns: most specialist roles use agent-bundled skills, and some roles intentionally attach shared standalone skills directly from `agent-config.json`.

### 2. Standalone shared skill source

Use this when a skill should exist independently from any one agent.

```text
<skill-source-root>/
  skills/
    <skill-name>/
      SKILL.md
      templates/
      references/
      scripts/
```

or equivalently:

```text
<skill-source-root>/
  <skill-name>/
    SKILL.md
    ...
```

Rules:

- A skill folder is recognized by the presence of `SKILL.md` at that folder's top level.
- A directory literally named `skills/` is optional.
- `skills/` is only needed when you want to organize multiple standalone skills under one root.

## Shared Team Reference Files

Some teams also keep a shared reference document under a team-local `shared/` folder, for example:

```text
<team-root>/
  shared/
    design-principles.md
```

When multiple agent-bundled skills in the same team need that shared file, prefer the software-engineering-team pattern:

```text
<team-root>/
  agents/
    <agent-id>/
      skills/
        <skill-name>/
          SKILL.md
          design-principles.md -> ../../../../shared/design-principles.md
```

Rules:

- Keep the canonical shared file in the team's `shared/` folder.
- Create a local symlink inside each consuming skill folder that points to the shared file.
- In the consuming `SKILL.md`, reference the local file name such as `[design-principles.md](design-principles.md)` instead of a brittle relative path like `../../shared/design-principles.md`.
- Use this pattern for shared reference docs, principles, and reusable policy files that belong to one team package but are read by multiple bundled agent skills.
- Do not duplicate the shared file into each skill folder; use one canonical shared file plus symlinks so updates stay synchronized.

## Recommended Practice For Team Packages

Treat `team.md` as the team's coordination contract, not as a second copy of each specialist's skill.

The more complete file-by-file contract is defined in
[`Separation Of Concerns And Agent Package Content Contract`](#separation-of-concerns-and-agent-package-content-contract)
below. Use that contract when a rule could plausibly fit in more than one
file: every rule should have one canonical owner.

### Put In `team.md`

- short team purpose and entry specialist
- member list and ownership boundaries
- high-level delivery flow between members
- handoff expectations, including `send_message_to` usage and required artifact visibility
- issue routing between members
- links or pointers to shared team references

### Put In Team-Shared References

- cross-member operating principles
- shared quality bars and policy rules
- shared artifact conventions that more than one member must respect
- decisions that must stay synchronized across specialists

### Put In Member `SKILL.md`

- role-specific execution steps
- role-specific artifact schemas and templates
- tool-use rules owned by that role
- detailed QA gates owned by that role
- blocking, retry, and send-back behavior for that specialist

### Avoid

- copying role-specific workflow steps from member `SKILL.md` into `team.md`
- listing detailed artifact schemas in `team.md` when a template or skill owns them
- putting tool invocation details, media-generation settings, prompt rules, or validation procedures in `team.md`
- duplicating the same operating rule in both `team.md` and a shared reference file

If a reusable principle, quality bar, or schema applies to all team members,
put its detailed definition in a team-shared reference and point members to it
from `team.md` or their skills. If a rule defines how the team coordinates,
keep its summary in `team.md` and its executable conditions in
`team-config.json`. If a rule applies to one specialist, put it in that
specialist's `SKILL.md`.
Keep `team.md` focused on how the specialists work together.

## Multi-Agent Communication Best Practice

Model inter-agent communication as email with attachments.

The `send_message_to` message body is the email text: it should route the work, name the expected next action, and summarize the handoff briefly. The reference files field is the attachment list: it should carry the durable files that contain the full handoff context.

For reliable agent-team handoffs, use file-backed handoffs by default:

1. Before handing work to another agent, the sending agent must write the full handoff to a local file.
2. The handoff file should preserve the complete context: user request, goals, source material, relevant links, artifact paths, constraints, approval state, current status, blockers, and expected output.
3. The sending agent then calls `send_message_to`.
4. The `send_message_to` message must mention the absolute path of the handoff file.
5. The same handoff file must also be added to the `send_message_to` reference files field, like an email attachment.
6. The receiving agent must read the referenced file before acting. The file is the source of truth; the short message is only routing context.
7. When reporting back, write a result/status file first, then send a short message that mentions and attaches that file.

This pattern is intentionally more explicit than putting all details in the message body. It pushes each specialist to materialize its handoff, gives the receiver a stable artifact to read, reduces context loss, and makes multi-step team workflows easier to audit and resume.

## Specialist Ownership And Outcome-Based Handoffs

Model an agent team as a group of independent specialists rather than as one
agent that manages every other specialist's internal workflow. Each agent
should use its own `SKILL.md` to complete the responsibility it owns and
should not manage another agent's private repository, ticket lifecycle,
branches, worktrees, commits, or implementation details. A receiving agent
should care about the delivered result and its evidence, not how the producing
agent created or stored that result.

When an agent reaches a meaningful stopping point, it should make the outcome
explicit—such as `Completed`, `Blocked`, `Requirement Gap`, or another status
defined by its workflow—before deciding what happens next. It should then:

1. finish and persist the artifacts owned by its stage;
2. call `get_handoff_rules` to retrieve the current conditional routing rules;
3. apply every rule whose condition matches the actual outcome;
4. call `send_message_to` with each exact returned `recipient_address`, carrying
   the concise result, next expected action, and durable artifact references;
5. return the outcome to the user or calling workflow when no rule applies; and
6. stop after the required handoffs succeed instead of polling or continuing
   work owned by the next specialist.

Handoff rules—not hardcoded recipient assumptions—are the source of truth for
workflow progression. The message recipient is selected from the completed
task result, so the same agent can work independently when invoked by a user,
another agent, or a resumed workflow. `delegate_task` is a separate mechanism
for intentionally starting a fresh delegated execution; it is not a substitute
for the normal result-based handoff protocol.

This separation mirrors effective human teams: a specialist performs its own
work, reports an evidence-backed result, and uses the agreed routing rules to
contact the responsible next person. Team definitions should therefore make
ownership boundaries, terminal outcomes, and handoff conditions explicit while
leaving specialist execution details in the owning skills.

### Conditional Result-Based Routing

Use this four-layer ownership model when designing an agent team:

- `SKILL.md` owns the agent's responsibility, operating procedure, required
  artifacts, result classification, validation, recovery, and handoff procedure.
- `team-config.json` owns the conditional routing rules and canonical recipient
  addresses. It is the routing policy, not the agent's implementation guide.
- `team.md` owns the team identity, responsibility boundaries, entry contract,
  and concise summary of the possible workflow paths.
- `agent-config.json` exposes the runtime tools required by the skill, including
  `get_handoff_rules` and `send_message_to` when the agent participates in
  result-based handoffs.

The normal result-based loop is:

1. complete only the responsibility owned by the current agent;
2. persist the required artifacts and validation evidence;
3. produce an explicit result envelope containing status, route-relevant
   classification fields, artifact paths, open risks, and the next expected
   action;
4. call `get_handoff_rules` after the result exists;
5. apply every matching rule from `team-config.json` and send the result to
   each exact returned `recipient_address` with `send_message_to`;
6. return the result to the caller when no rule applies, then stop rather than
   polling or performing the next specialist's work.

This makes routing flexible without making agent responsibilities ambiguous:
the same specialist can be invoked by a user, another agent, or a resumed
workflow, and the completed result—not a hardcoded linear sequence—determines
what happens next. Review gates, specialist escalation, and terminal delivery
are therefore conditional workflow rules rather than universal stages. Keep
normal success rules, recovery rules, and terminal rules mutually clear so a
result cannot be routed both forward and backward accidentally.

## Separation Of Concerns And Agent Package Content Contract

Use the following content contract when creating or reviewing an agent team.
The files have different responsibilities; do not spread one workflow across
several competing prompts.

### One Canonical Owner Per Kind Of Guidance

Treat the package as layered configuration rather than as several prompts that
all describe the same workflow:

| File | Owns | Must not own |
| --- | --- | --- |
| `agent.md` | Runtime identity, role, team context, authoritative skill reminder, runtime-only stance, and the team's universal post-work communication convention. | Detailed work procedure, artifact schemas, another specialist's responsibilities, or the conditional routing table. |
| `team.md` | Team purpose, member boundaries, entry contract, concise workflow paths, team-wide communication policy, and recovery/terminal expectations. | A specialist's checklist, full artifact schema, tool-specific work procedure, or duplicated route conditions. |
| `SKILL.md` | One specialist's reusable responsibility: inputs, work sequence, decisions, artifacts, validation, result classification, recovery, and the post-work handoff procedure. | Canonical recipient addresses, team-wide policy, or a duplicate of the team's complete routing matrix. |
| `team-config.json` | Runtime roster, coordinator, rooted member addresses, and conditional handoff rules. | Specialist implementation instructions, long workflow prose, or duplicated skill checklists. |
| `agent-config.json` | Explicit skill attachment and runtime wiring such as tools, processors, and lifecycle settings. | Behavioral workflow, artifact requirements, or routing logic. |
| `templates/` and shared references | Durable artifact structure, reusable schemas, and principles shared by the owners that use them. | Runtime recipient selection or agent-specific identity. |

The practical ownership rule is:

- If the guidance is reusable whenever the skill is attached to another agent,
  it belongs in `SKILL.md`.
- If it defines how several members cooperate, it belongs in `team.md` or
  `team-config.json`: prose and boundaries in `team.md`, executable routing in
  `team-config.json`.
- If it is only about this runtime agent's identity, tone, or attached-skill
  selection, it belongs in `agent.md`.
- If it only wires definitions into the runtime, it belongs in
  `agent-config.json`.

### The Work-to-Handoff Boundary

Handoff is a short phase after the specialist's work, not a second work
workflow. For a result-based team, the intended lifecycle is:

```text
receive input -> use the attached skill -> persist artifacts and result
-> classify the outcome -> call get_handoff_rules
-> apply every matching rule -> use the team's declared handoff tool
-> send to every exact returned recipient -> stop
```

The layers divide this lifecycle as follows:

- `SKILL.md` defines the work, the evidence and artifacts that must exist, the
  result fields used for routing, and when the work is complete.
- `agent.md` or `team.md` states the universal communication convention. In a
  `send_message_to`-based team, it must explicitly say to use
  `send_message_to` for every required handoff and not to mix it with
  `delegate_task` for the same workflow.
- `team-config.json` decides which conditions match and supplies the canonical
  `recipient_address` values. Agents must not infer or hard-code those
  recipients.
- The agent applies **all** matching rules, because one result may require a
  primary handoff and an informational notification. It returns the result to
  the caller when no rule matches and stops after required handoffs succeed.

`delegate_task` is a separate mechanism for starting a delegated execution. It
is not the normal replacement for a completed-result handoff. A team may use
it deliberately, but that choice must be explicit in the team/agent contract
and must not leave the agent with conflicting instructions to use both
mechanisms for the same transition.

### Separation Review Questions

Before merging a package, ask:

1. Can a reader identify the single file that owns each rule?
2. Can the skill be reused without inheriting stale team member names or
   recipient addresses?
3. Can routing conditions or recipients change in `team-config.json` without
   rewriting the specialist's work procedure?
4. Can a specialist finish its work and hand off without implementing the next
   specialist's responsibility?
5. Are team-wide rules stated once and referenced elsewhere rather than copied
   into every agent and skill prompt?

### `agent.md` — Fixed Agent Shell

Keep `agent.md` short and structurally consistent. It should contain:

1. frontmatter with `name`, `description`, `category`, and `role`;
2. one sentence identifying the agent and team;
3. one instruction naming the bundled skill as the authority for the agent's
   work;
4. the standard post-work handoff transition;
5. only role-specific durable-artifact obligations that are not already owned
   by the skill.

Use this shape for the standard transition:

```text
You are the <role> for the <team>.

Follow the bundled `<skill-name>` skill as the authoritative workflow for your
responsibility, inputs, outputs, validation, and recovery.

After the skill-defined work is complete, persist the result and artifacts,
call `get_handoff_rules`, apply every matching rule, send the result to each
exact returned `recipient_address` with `send_message_to`, and stop. If no rule
matches, return the result to the user or calling workflow.
```

`agent.md` should not contain the team's detailed routing matrix, another
agent's workflow, or a second copy of the skill. Its purpose is identity, skill
binding, and the transition from work to handoff.

### `SKILL.md` — Specialist Work Contract

The skill is the authoritative guide for the agent's own work. It should
contain, in execution order:

- purpose and responsibility boundary;
- required inputs and readiness checks;
- owned work and explicit non-ownership;
- operating sequence and decision points;
- required artifacts and artifact templates;
- validation, quality bars, and user-approval boundaries;
- recovery and escalation conditions;
- the definition of a complete result;
- the result fields needed by the team's handoff rules.

The skill should explain **what outcome to produce**, but should not duplicate
the complete team routing matrix. It may state that the agent must call
`get_handoff_rules` after the result exists; `team-config.json` remains the
authority for the actual conditional recipients.

### `team.md` — Team Contract

`team.md` should contain the team's identity and shared operating model:

- team purpose and entry specialist;
- member responsibilities and ownership boundaries;
- entry contract and required upstream package;
- concise high-level workflow paths, including conditional paths;
- cumulative artifact visibility and communication expectations;
- recovery boundaries and terminal completion conditions.

Keep detailed specialist procedures, checklists, and classification definitions
in the owning skills. Keep the summary accurate when the team has both direct
and review-gated paths.

### `team-config.json` — Routing Policy

`team-config.json` should contain the runtime team roster and conditional
handoff policy:

- member names and agent references;
- coordinator, when the team has one;
- canonical rooted `from` and `to` addresses;
- explicit natural-language rules describing when each handoff applies.

Rules must be based on the completed result, not on an assumed fixed sequence.
They should cover normal success, recovery, informational notifications when
needed, and terminal return. Make mutually exclusive success routes clear;
allow multiple matching rules when one result intentionally requires multiple
messages, such as a primary handoff plus an informational notification.

### `agent-config.json` — Runtime Wiring

`agent-config.json` should explicitly bind the agent's skill and expose every
tool required by that skill. A result-based team member normally needs both
`send_message_to` and `get_handoff_rules`. The configured skill name, skill
folder, and `SKILL.md` frontmatter name must match.

### Result Envelope And Handoff Wording

Before calling `get_handoff_rules`, an agent should persist a concise result
that includes, as applicable:

- status or outcome classification, such as `Completed`, `Blocked`, `Pass`,
  `Fail`, `Requirement Gap`, or `Design Impact`;
- route-relevant classification fields, using the team's exact field names and
  values;
- absolute paths to the durable artifacts and evidence;
- approval state, validation result, assumptions, and open risks;
- the next expected action and any recovery context.

Use this wording pattern in skills and team rules:

```text
After the owned work and required artifacts are complete, classify the result
and call `get_handoff_rules`. Apply every matching rule and send the appropriate
result to each exact returned `recipient_address` using `send_message_to`. If no
rule applies, return the result to the user or calling workflow. After all
required handoffs succeed, stop and do not poll.
```

Do not write “send the result to the recipient” when multiple rules may match.
Use “each exact returned recipient,” and make zero-match behavior explicit.
Do not hardcode normal recipients in the agent shell. `delegate_task` is for
starting a separate delegated execution; it is not a replacement for this
post-work, result-based handoff protocol.

## Canonical Example Team: Evidence-Driven Delivery

For a complete working example, refer to
[`agent-teams/evidence-driven-delivery-team/`](agent-teams/evidence-driven-delivery-team/).
It models a normal human delivery loop with four independent specialists:

```text
/user -> /planner -> /implementer -> /validator
           |              ^              |
           +-> /investigator ------------+
                   |                      |
                   +------> /planner <---+
```

The canonical edges are:

- The runtime entry is `/planner` because `coordinatorMemberName` is
  `planner`; the user or calling workflow sends the request there first.
- `/investigator -> /planner`: initial or task-focused evidence, including
  blocked investigation evidence.
- `/planner -> /implementer`: one ready task or in-scope rework.
- `/planner -> /investigator`: a material unknown prevents defining the next
  task safely.
- `/implementer -> /validator`: implementation and local checks are complete.
- `/implementer -> /planner`: implementation reveals a blocker, invalid
  dependency, or scope mismatch.
- `/validator -> /planner`: validation produces `Pass`, `Fail`, or `Blocked`
  feedback.

Implementer and Validator do not contact Investigator directly. They send
evidence or feedback to Planner, which owns the decision to request focused
investigation or continue implementation.

- **Investigator** establishes evidence for the overall request or the next
  focused task.
- **Planner** is the coordinator and entry specialist. It chooses direct,
  incremental-slice, or discovery-led planning and defines only the next
  smallest valuable task or focused investigation question. Each step has
  explicit scope, expectation, dependencies, and validation conditions.
- **Implementer** executes one ready micro-task and records the actual result.
- **Validator** compares the actual result with the planner's expectation and
  produces evidence-backed `Pass`, `Fail`, or `Blocked` feedback.
- **Planner** consumes the feedback and chooses in-scope rework, the next
  small task, focused investigation, a blocker result, or completion. For a
  large unclear objective, it investigates only enough to make the next step
  safe rather than planning the whole product in advance.

This example demonstrates why the handoff is a separate post-work phase. Each
specialist focuses on its own work and result; after completion, it calls
`get_handoff_rules`, applies every matching rule, sends the required messages,
and stops. Planner coordinates the next step without implementing or
validating, Validator does not fix, and Investigator does not plan. All
handoffs in this example use `send_message_to`; the team config changes the
loop without changing the specialists' core work contracts.

## Recommended Practice For Agent Packages

- If a skill is owned by a single agent, keep it bundled under that agent's `skills/<skill-name>/` folder.
- If a skill is shared across multiple agents, move it to a standalone shared skill source.
- Even when a bundled `skills/<skill-name>/SKILL.md` exists, keep `agent-config.json.skillNames` explicit so the package is self-describing and runtime wiring is deterministic.
- If an agent intentionally reuses a shared standalone skill instead of a bundled local one, keep the specialization in `agent.md` and point `agent-config.json.skillNames` at the shared skill.
- Keep `agent.md` short. Move detailed workflow steps, artifact schemas, and output section structure into `skills/<skill-name>/SKILL.md` and `skills/<skill-name>/templates/` so the same skill format works cleanly for bundled agent skills and custom skills.

## Core Files

### `agent.md`

This is the distilled runtime prompt for the agent.

Keep it short.

It should usually contain only:

- role identity
- short purpose
- which bundled or shared skill is authoritative
- runtime-only specialization that truly belongs in the agent prompt
- tone or review stance if needed
- team communication section when the agent is team-local

### `SKILL.md`

This is the main operating contract when a role has reusable workflow.

Put the real behavior here:

- workflow stages and ordering
- artifact schemas and output expectations
- result classification and the post-work handoff procedure
- validation rules
- blocking rules
- quality bars
- reusable heuristics

The skill may define the result fields and explain when to call
`get_handoff_rules`, but the team's `team-config.json` owns the actual route
conditions and recipient addresses.

### `agent-config.json`

This is the runtime wiring.

Typical contents include:

- `toolNames`
- `skillNames`
- processors
- lifecycle/runtime configuration

Keep `skillNames` explicit even when a bundled local `skills/<skill-name>/SKILL.md` exists. Runtime attachment should stay deterministic and self-describing.

### `team.md`

Short team description and identity.

### `team-config.json`

Team member wiring.

Typical contents include:

- `coordinatorMemberName`
- `members[].memberName`
- `members[].ref`
- `members[].refType`
- `members[].refScope`

## Authoring Best Practices

When a role has a reusable skill, treat `skills/<skill-name>/SKILL.md` as the main operating contract and keep `agent.md` intentionally thin.

### Prefer Positive Operating Contracts

Write agent and skill instructions around the correct result and the successful workflow that produces it.

Good agent guidance should answer:

- what artifact should exist at the end
- what a correct artifact looks like
- what exact inputs the agent should use
- what sequence of actions usually produces the correct result
- what examples the agent can imitate
- what quality checks prove the artifact is ready

Use constraints only when they directly protect the target artifact. A useful negative instruction names a bad output state that would make the artifact fail. An unhelpful negative instruction focuses on an unrelated implementation workaround instead of teaching the agent what to produce.

Prefer this:

```text
Create one complete A4 landscape coloring-page image for page003.
Use cute black-and-white rounded doodle line art, large closed colorable shapes,
a peaceful hillside scene with David and a sheep, and the exact bottom caption
"David cared for the sheep." inside a simple caption band within the page border.
```

Instead of this:

```text
Do not use Python to add the caption later.
```

Positive examples are especially important for generation agents. If the desired final image, document, deck, video, or code artifact should be self-contained, say so as a finished-output requirement and show the correct prompt or artifact shape. Review and packaging roles should then verify and preserve that approved artifact rather than inventing a separate workaround.

When negative guidance is needed, keep it relevant to the target artifact:

```text
When the storyboard requires a caption, the generated page image must include
that exact caption. A generated page without the caption is not ready.
```

This teaches the agent which output fails and why, while the positive prompt still shows how to create the correct result.

### Put In `agent.md`

- role identity and short purpose
- short reminder of which bundled or shared skills are authoritative
- runtime-only specialization that should stay with the agent prompt
- tone or review stance when that matters at runtime

### Put In `SKILL.md`

- reusable workflow steps and stage order
- artifact order, artifact expectations, and the post-work handoff procedure
- result classification, blocking rules, and send-back behavior
- checklists, operating heuristics, and collaboration guidance
- reusable policy or quality bars that should still apply if the skill is attached somewhere else later

### Put In `templates/`

- output structure
- report skeletons
- required sections or tables for durable artifacts

### Avoid

- copying the same workflow rules into both `agent.md` and `SKILL.md`
- keeping artifact schemas or long checklists in `agent.md`
- creating a second mini-skill inside `agent.md` after a proper `SKILL.md` already exists
- splitting one reusable rule across multiple files unless the split has a clear ownership reason

### Update Rule

- When workflow behavior changes, update `SKILL.md` first.
- Update `agent.md` only when the agent's identity, authoritative skill references, runtime-only specialization, or tone need to change too.
- If the same guidance would still matter when the skill is reused without the current bundled `agent.md`, it belongs in `SKILL.md`, not `agent.md`.

## Very Important Authoring Rule

When a role has a bundled or attached skill, put as much reusable behavior as possible into `SKILL.md`, not `agent.md`.

This is important because at runtime the final system prompt is effectively composed from:

- the agent prompt in `agent.md`
- the attached skill prompt content from `SKILL.md`

If the same workflow rules are copied into both places, the runtime prompt becomes larger, noisier, and easier to drift out of sync.

### Practical Rule

If the guidance would still matter when the skill is reused elsewhere, it belongs in `SKILL.md`.

If the guidance only exists because this exact agent has a special runtime identity or tone, it may belong in `agent.md`.

## Bundled Skill Convention

When a skill belongs to one specific agent bundle, keep it under that agent folder's `skills/` directory.

Example:

```text
agents/<agent-id>/skills/<skill-name>/SKILL.md
```

or for a team-local role:

```text
agent-teams/<team-id>/agents/<agent-id>/skills/<skill-name>/SKILL.md
```

Rules:

- the skill folder name should match `agent-config.json.skillNames` and `SKILL.md` frontmatter `name`
- `agent-config.json.skillNames` should explicitly include that skill name
- the presence of `SKILL.md` alone should not be treated as enough runtime wiring

## Team Modeling Convention

Teams are intentionally modeled as direct specialist cooperation.

In practice:

- `team.md` gives the team identity
- `team-config.json` defines the member list, references, conditional handoff
  rules, and canonical recipient addresses
- each specialist owns its own workflow and result contract in `SKILL.md`
- `agent-config.json` exposes the tools that workflow requires
- `team.md` summarizes the team-level paths without duplicating specialist
  procedures

Keep the team description simple and let the real operating detail live with the roles that own it.

## Sanity Check Before Merging Agent Changes

Before considering an agent package update complete, verify:

- `agent.md` is thin
- `SKILL.md` owns the workflow
- `agent-config.json.skillNames` is explicit
- tools in `agent-config.json` match what the workflow actually requires
- team-local handoff names match `team-config.json`
- the team/agent contract declares one handoff mechanism for each workflow
- route conditions and recipient addresses are not duplicated in skills
- reusable schemas and checklists are not duplicated across prompt files

If an `agent.md` starts reading like a second `SKILL.md`, the split is wrong and should be corrected.

The team is intentionally modeled as direct specialist cooperation instead of a separate coordinator agent. Handoffs and rework paths are expressed through `team.md` and `team-config.json`; each specialist's skill defines only the result and post-work handoff procedure needed to participate.
The software engineering team's `delivery_engineer` owns release preparation, versioning, tagging, rollout, deployment, and verification so those responsibilities are explicit instead of being left implicit at the end.

The runtime configuration is intentionally lightweight. After importing these definitions into AutoByteus, users are expected to customize tools, processors, models, and other config details to match their own environment.
