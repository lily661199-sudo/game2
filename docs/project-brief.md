# Project brief — Dream Tide financial-literacy game

**Status:** approved Define handoff; Ideate in progress  
**DT phase:** Ideate  
**Requirements version:** 0.1

## Goal

Create a short, browser-playable financial-literacy adventure for elementary students. Learners practice planning pocket money and making cautious, informed choices about investment risk.

## Target users and context

- **Primary:** elementary school students. Exact grade, age, and reading range remain open.
- **Secondary:** teachers and caregivers who introduce or discuss the learning activity.
- **Context:** classroom or home use is assumed, not yet confirmed.

## Evidence and pain points

- **Confirmed evidence:** the project owner's original brief requests a life-finance/investment unit, two interactive levels, a key earned by solving each level, per-level scores, a final progress summary, and web deployment.
- **Confirmed design reference:** the project owner supplied a Little Nightmares reference and a low-angle, oversized-room screenshot as mood/quality references.
- **Hypotheses to test:** money planning and investment risk may feel abstract to children; terminology or dense text may overload younger readers; a dark visual mood may improve curiosity but must remain age-appropriate.
- No student interviews, classroom observations, or playtest evidence have been collected.

## Problem statement

Elementary learners need an age-appropriate way to reason about saving, spending, and investment risk through concrete choices, with feedback that helps them explain the consequence of a decision.

## Inputs, processing, and outputs

- **Inputs:** a learner's choice in each of two short scenarios.
- **Processing:** deterministic answer checking, explanatory feedback, score and key updates.
- **Outputs:** per-level score, learning feedback, earned keys, and an end-of-journey progress summary.
- No personal data or real money is required.

## AI role and authority

No AI is used at runtime. The AI supports design and implementation only. Learning scores and game feedback must remain deterministic and reviewable.

## MVP and non-goals

- **MVP:** two short scenarios; one about planning pocket money and saving, one about diversification and investment risk; each correct solution unlocks a key; per-level score; final progress summary; responsive web delivery.
- **Non-goals:** real investing, simulated asset trading, financial product recommendations, account creation, collection of identifiable learner data, copying Little Nightmares characters or assets.
- **Current shipped build:** one pocket-money allocation question and one risk/diversification question. Candidate gameplay mechanisms have not yet been compared through the game-design tournament.

## Constraints and risks

- Use child-readable Traditional Chinese and age-appropriate language.
- Avoid presenting investment as guaranteed profit; discuss risk and adult guidance.
- Keep the requested eerie storybook mood without reproducing protected game art.
- Current deployment is static GitHub Pages/Netlify. Three.js export is intended to remain a static-web workflow.
- Blender export depends on installing/configuring the required Blender Toolkit add-on and Blender MCP server.

## Delivery context

Browser game, currently published in the `lily661199-sudo/game2` repository with a GitHub Pages workflow; Netlify is a secondary static-host option.

## Success measures

**Owner-approved operational definitions (not measured results):** learning accuracy and explanation/transfer quality (L); completion and voluntary replay (E); brief non-identifying competence/retry items (M); recoverable error/retry and facilitator challenge observations (A); rapid unreasoned guessing (G); instruction rereads/confusion reports (C). These are not measured yet.

## Locked educational reward profile

- Positive-factor weights: `wL=.50`, `wE=.15`, `wM=.10`, `wA=.25`.
- Penalty coefficients: `pG=.15`, `pC=.10`.
- Hard gates: none.
- The profile and the operational evidence definitions are user-approved; no student observations or numeric targets exist yet.

## Assumptions to test

1. Children can explain why saving some money before spending helps.
2. Children can recognize that putting all investment money in one choice concentrates risk.
3. Brief narrative feedback is understood without a teacher explaining every answer.
4. The dark, cinematic mood feels intriguing rather than frightening to the intended age range.

## Acceptance examples

1. A correct response earns the level's key; an incorrect response receives explanatory feedback and cannot advance until the learner retries correctly.
2. Each level displays its own score.
3. The ending reports total score, keys earned, and a clear progress statement.
4. The experience works at mobile and desktop widths and does not require a user account.
5. The game explains that investment can lose value and does not promise returns.
6. If a Blender model is included, the source `.blend` and web-ready `.glb` are retained, and the web game remains usable if 3D loading fails.

## Open questions

- Is the intended use classroom, home, or both?
- Which grade/reading range should the Traditional Chinese target, and can explain-back prompts fit?
- What numeric targets should be set before a supervised prototype observation?
- Which gameplay concept and visual direction should be selected after the required tournament and style comparison?
- Blender Toolkit and Blender MCP are installed/enabled; Codex restart and starting both local listeners in Blender remain necessary before modeling.

## User approval

Empathize and Define approved on 2026-11-24. User selected the learning-first weights, balanced G/C penalties with no hard gates, and asked to handle Blender add-on/MCP setup before modeling.
