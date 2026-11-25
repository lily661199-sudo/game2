# Game-design tournament — Ideate

**Status:** AI concept pre-score; owner selection pending  
**Date:** 2026-11-24  
**Decision profile:** `L/E/M/A = .50/.15/.10/.25`; guessing penalty `.15`; cognitive-load penalty `.10`; no hard gates.  
**Confidence:** medium for design fit; low for actual learner outcomes. No student playtest data exists.

## Evidence and design implications

The OECD financial-literacy framework covers money and transactions, planning/managing finances, and risk/reward. It explicitly includes budgeting, distinguishing needs and wants, planning for future costs, and understanding that investments can lose money. It also separates identifying information, analysing situations, evaluating issues, and applying knowledge. The two levels therefore use a concrete plan and a risk decision, with feedback that asks for a reason rather than rewarding a lucky choice. This framework concerns 15-year-olds, so it informs the concepts but does not establish reading-level suitability for younger children. [OECD PISA 2022 framework](https://www.oecd.org/en/publications/pisa-2022-assessment-and-analytical-framework_dfe0bf9c-en/full-report/component-4.html)

Taiwan's public elementary financial-education materials are described as age-banded and intended for middle and upper elementary grades, with teacher guides and worksheets. This supports treating grade range and facilitator use as open design variables rather than assuming a single reading level. [TPEx elementary financial-literacy materials announcement](https://www.zlps.kh.edu.tw/view/index.php?DataId=189049&MainMenuId=20563&MainType=0&SubMenuId=20607&SubType=101&WebID=143&Work=View&page=1)

Game-based financial education has promising but context-dependent evidence: a four-country RCT with 2,220 students reported a positive average effect, while a Colombian randomized school experiment reported heterogeneous results and no significant general treatment effect. These studies justify testing, not claiming this two-level prototype is effective. [Cannistrà et al. (2024)](https://www.sciencedirect.com/science/article/pii/S0147596724000441), [Rodriguez-Raga & Martinez-Camelo (2022)](https://www.sciencedirect.com/science/article/pii/S2214635021001507)

The owner supplied *Little Nightmares* as a mood/quality reference: oversized rooms, strong light contrast, and a small vulnerable protagonist. The concepts below use original storybook spaces and avoid its characters, scenes, names, and assets.

## Fixed brief and scoring protocol

Every concept must retain two short levels, one interaction in each, correct answer required for each key, visible per-level score, an ending progress summary, static web delivery, elementary-safe Traditional Chinese, no real money/accounts, and no promise of investment returns. Level 1 teaches planning spending/saving toward a goal; Level 2 teaches uncertainty and concentration risk. A correct answer must be accompanied by a brief reason or an in-game consequence prompt where feasible; total interaction count remains two.

Eight neutral IDs were assigned before scoring. Five separate structured review passes were applied: (1) game design, (2) first-time learner, (3) financial-domain accuracy, (4) learning-evidence validity, (5) production feasibility. They are separate perspectives in one AI review, **not five independent human experts**. Each pass challenges likely failure modes; scores below are the reconciled pre-scores, not student evidence.

### Rubrics (0–100)

- **G — Game experience:** learnability 15%, agency 20%, pacing/tension 20%, feedback/causality 20%, variety/replay 15%, recovery/fairness 10%.
- **P — Purpose fit** (used instead of formal research validity because this is a product prototype, not a study): learning-goal/correctness alignment 30%, elementary audience/context 20%, assessment and explanation fit 20%, child-safety/privacy 15%, two-level/web brief fit 15%.
- **D — Development feasibility:** vertical-slice cost 20%, browser/tool fit 20%, content scalability 15%, art/motion/audio scope 15%, testability 15%, maintainability 15%.
- Default shortlist eligibility: G≥75, P≥75, D≥75, and all brief hard constraints pass. No G/C hard gate was selected by the owner.

Educational diagnostic score: `R_edu = clamp(.50L + .15E + .10M + .25A - .15G_guess - .10C, 0, 100)`. Here L/E/M/A/G_guess/C are **AI estimates of how the design might support or expose the named signals**, not measured learner values. This diagnostic is not substituted for the separate G/P/D ranking and is not an efficacy result.

## Generation 1 — deliberately different mechanics

| ID | Core verb and 30–60 second loop | Trade-off, recovery, and key condition | Cheapest prototype probe |
|---|---|---|---|
| A | **Allocate**: drag three pocket-money tokens into “spend now / save for goal” slots; see the goal meter and remaining wants. Level 2 places a fixed set of fictional tokens across baskets. | Immediate want vs future goal; retry after a short consequence card. Key needs a feasible plan and risk-spreading reason. | Clickable two-screen HTML with deterministic plans. |
| B | **Pack**: choose a small set of objects before leaving a dim room; each object represents spending, saving, or preparation. In Level 2, pack clues about uncertain outcomes before choosing where fictional funds go. | Limited bag space makes opportunity cost visible; feedback reveals consequence and allows one retry. | Paper cards, then simple drag/drop. |
| C | **Listen and infer**: inspect audio/visual clues from a shadowy shop, then select a plan; second level reads changing weather clues and chooses a risk response. | Information is incomplete; optional clue reread supports recovery, but can raise reading/listening load. | Static clue cards and choice panel. |
| D | **Route-plan**: choose a path through oversized rooms where doors represent goal, want, and delay; Level 2 chooses a route through uncertain “storm” outcomes. | Route length vs safety; consequence shown as a short animated tableau. | Two branching diagrams with CSS transitions. |
| E | **Sort and classify**: sort purchase cards into “need/want/later” to reach a goal; then classify investment outcome cards by possible gain/loss and risk. | Time pressure is intentionally absent; retries are explicit. Key requires correct category plus one explanation choice. | Card-sort prototype with keyboard/touch support. |
| F | **Stabilize**: tune a lantern fuel meter by splitting tokens between tonight and the future; Level 2 stabilizes a bridge by distributing fictional supplies among uncertain paths. | More safety can mean slower progress; feedback demonstrates downside without suggesting guaranteed outcomes. | Sliders plus deterministic outcome table. |
| G | **Negotiate**: choose a response to a character pressuring the player to spend; Level 2 asks whether to follow a boastful “sure win” claim or pause, compare, and spread risk. | Social pressure vs independent reasoning; hints model a pause-and-check strategy. | Dialogue tree mockup. |
| H | **Rewind**: make a plan, see a short consequence, then rewind once and change one decision; Level 2 compares a concentrated choice with a diversified one under two possible outcomes. | Learning from counterfactuals; rewind must not become unlimited answer fishing. Key requires selecting the safer reasoning pattern and identifying uncertainty. | Branching slides or HTML states. |

### Review pass notes

| Lens | Main challenge applied |
|---|---|
| Game designer | Keep choice→consequence→feedback legible, avoid a cinematic wrapper that hides the financial decision. |
| First-time learner | Prefer visible quantities, familiar contexts, short instructions, forgiving retry; beware abstract tokens and unclear metaphors. |
| Financial-domain reviewer | Avoid calling diversification “safe” or implying gains; disclose uncertainty and possible loss; distinguish saving from investing. |
| Learning-evidence reviewer | Score reasoning/explain-back, not speed or completion alone; keep interaction burden within two scenarios. |
| Production director | Static browser, keyboard/touch access, short build, low asset dependence, straightforward deterministic scoring. |

Initial lens concerns: A has clear causal feedback but may read like a quiz; B's object metaphor risks ambiguity; C has the strongest atmosphere but can overtax reading; D's branching animation could become expensive; E has the clearest assessment but weakest fantasy; F makes trade-offs visible but could confuse “stability” with guaranteed financial safety; G makes social pressure relevant but needs careful writing; H teaches counterfactuals but risks answer fishing. No candidate fails the user's hard constraints at concept level.

## Generation 2 — evolution based on review concerns

Mutations were kept visibly distinct; none adds a third scored interaction.

| ID | Evolved form | Change from G1 |
|---|---|---|
| A2 | **Goal drawer**: tokens snap into spend/save slots; a progress shadow previews the future goal. Second level uses visibly uncertain outcome tiles and asks the learner to spread a small fictional amount. | Retains A's allocation verb; strengthens causal preview and removes arithmetic beyond small whole numbers. |
| B2 | **Object story**: three carried objects reveal which wants can wait; second-level clues reveal that the same basket may rise or fall. | Keeps packing verb, but adds a facilitator-readable visual legend to reduce metaphor ambiguity. |
| C2 | **Quiet clue room**: two icon clues plus optional one-line audio/text hint; learner explains by choosing a short reason. | Reduces reading burden, preserves inference. |
| D2 | **Single branching route**: one meaningful fork per level, with the other consequence shown in a two-panel preview rather than a full branching map. | Cuts animation/content scope while retaining consequence comparison. |
| E2 | **Unhurried card table**: no timer, immediate reason feedback, one retry, with same visual card grammar in both levels. | Builds stronger fairness/flow while retaining sort/classify. |
| F2 | **Storm bridge**: visualizes possible loss on a single path and variable outcomes across paths; feedback explicitly says spreading risk cannot remove all risk. | Corrects “stable = safe” misconception. |
| G2 | **Pause-and-check dialogue**: one character makes an exaggerated guarantee claim; learner chooses a question to ask, then responds. | Requires checking a claim instead of merely selecting the obviously “good” character. |
| H2 | **One rewind token**: after seeing an outcome, learner may change one plan; a short explanation locks in the key. | Constrains answer fishing and foregrounds reflection. |

## Generation 3 — shortlist-ready variants

| ID | Final candidate used for scoring | Prototype boundary |
|---|---|---|
| A | **Goal Drawer** — direct allocation, visible goal progress, two uncertain outcomes in Level 2, single retry, a short reason choice. | Two scenes, one allocation interaction each, simple token UI. |
| B | **The Pocket Satchel** — pack familiar objects to show a want that can wait and a future goal; Level 2 uses uncertain path tokens and a “spread the risk” reason. | Two object-selection interactions; visual metaphor must be tested for comprehension. |
| C | **Quiet Clue Room** — infer a budget choice from two clues, then use uncertainty clues to choose how to distribute a fictional amount; optional replayable hint. | Two clue panels; avoid audio dependence and keep all clues visible. |
| D | **The Lantern Route** — choose a route that protects a future goal in Level 1; choose between concentrated and spread fictional tokens on a storm route in Level 2; see both outcomes. | One fork per level; CSS/illustrated consequence panels rather than 3D branching. |
| E | **The Unhurried Card Table** — classify need/want/later, then classify possible gain/loss and risk; short reason card unlocks each key. | Low-complexity card UI, highest assessment clarity. |
| F | **Storm Bridge** — allocate limited preparation tokens between current use and a future goal; then spread tokens across uncertain bridge routes, understanding risk remains. | Sliders with accessible buttons and deterministic outcome examples. |
| G | **Pause Before the Promise** — respond to spending pressure, then examine a fictional “guaranteed gain” claim by asking a question and choosing a risk-aware response. | Dialogue scenes; careful wording and age fit need review. |
| H | **One Rewind** — plan, view an outcome, spend one rewind to revise, then compare two uncertain outcomes in Level 2. | Counterfactual feedback; strict single rewind. |

## Scores and shortlist

All ratings below are AI pre-scores (0–100), not observations. `R_edu` is diagnostic only. G/P/D scores use the published rubric above. Every candidate clears the default floors; Pareto fronts are formed over G/P/D (higher is better). Front 1 is A, B, D; tie-break rule is lower dimension first, then mean G/P/D, then prototype cost. Among these, B is a balanced lead; A offers the fastest direct prototype; D offers the strongest cinematic movement with manageable scope.

| ID | L | E | M | A | Guess G | Load C | R_edu | Game G | Purpose P | Feasibility D | Pareto | Confidence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A Goal Drawer | 90 | 74 | 78 | 75 | 85 | 80 | 61.9 | 83 | 88 | 91 | 1 | Medium |
| B Pocket Satchel | 87 | 82 | 82 | 82 | 78 | 75 | 65.3 | 86 | 91 | 88 | 1 | Medium |
| C Quiet Clue Room | 78 | 90 | 85 | 70 | 65 | 62 | 62.6 | 89 | 82 | 76 | 2 | Low–medium |
| D Lantern Route | 85 | 80 | 82 | 80 | 80 | 75 | 63.2 | 88 | 89 | 84 | 1 | Medium |
| E Unhurried Card Table | 80 | 75 | 75 | 65 | 55 | 60 | 60.8 | 77 | 83 | 95 | 2 | Medium |
| F Storm Bridge | 90 | 80 | 79 | 83 | 82 | 78 | 65.6 | 85 | 90 | 82 | 2 | Medium |
| G Pause Before the Promise | 85 | 86 | 82 | 78 | 70 | 70 | 65.6 | 88 | 88 | 78 | 3 | Low–medium |
| H One Rewind | 82 | 86 | 80 | 75 | 73 | 70 | 62.7 | 86 | 84 | 80 | 3 | Low–medium |

**Initial AI shortlist (superseded by owner direction below):**

1. **B — The Pocket Satchel:** best balanced G/P/D profile and strong activity fit. Main risk: children may not infer what an object stands for; teach its visual meaning in-scene.
2. **A — Goal Drawer:** clearest direct financial decision and cheapest build. Main risk: can feel like a worksheet unless consequences are dramatized.
3. **D — The Lantern Route:** strongest cinematic story movement while keeping costs contained. Main risk: route metaphor must not obscure the financial lesson.

F has the highest estimated R_edu but misses the first Pareto front due feasibility; G is engaging but dialogue and claim-checking may be too text-heavy. The pre-score differences are small and should not be interpreted as empirical certainty. A short supervised observation with the intended grade band could reorder them.

## Owner gameplay direction

On 2026-11-25 the project owner directed that A + B + D be combined. See `docs/combined-gameplay.md` for the integrated two-interaction concept. The remaining gate is visual-style selection. No final gameplay implementation or Blender model is authorized by this tournament artifact alone.
