# Define — problem, scope, and success evidence

**Phase status:** approved by project owner on 2026-11-24  
**Requirements version:** 0.1  
**Educational reward profile:** user-approved learning-first weights; see project state and decision log.

## Problem statement

Elementary learners need a short and engaging way to practice planning pocket money and reasoning about investment risk. Abstract concepts should become visible through choices and consequences, and incorrect answers should give a safe retry with a clear explanation. The current prototype has the requested structure, but its learning value, age fit, and cinematic visual direction have not been tested with students.

## MVP boundary

Keep the user's original two-level requirement as the product constraint. Candidate mechanisms within that boundary will be compared before changing gameplay:

1. **Pocket-money planning:** distinguish spending, saving, and short-term wants.
2. **Investment-risk reasoning:** recognize concentration risk, uncertainty, and the value of learning before deciding.
3. **Progression:** each level requires a correct solution to earn its key; score is visible per level; the ending reports progress.
4. **Delivery:** responsive, static browser game for GitHub Pages/Netlify.
5. **Art direction:** original, child-appropriate dark storybook mood with cinematic scale and light; no copied Little Nightmares assets.
6. **Blender path:** model in Blender, preserve `.blend`, export `.glb`, and make the web fallback functional. This is contingent on the approved local add-on/MCP setup.

## Non-goals

- Real-money transactions, actual investment advice, product promotion, or promises of return.
- Accounts, personal profiles, or individually identifiable learner tracking.
- Formal education research or publication claims.
- Reproducing the referenced game's characters, environment assets, logos, or exact scenes.

## Owner-approved operational measures

These operational definitions were approved by the project owner on 2026-11-24. They are **not observed results**. During concept comparison, all component ratings remain **AI pre-scores**. For a later supervised prototype test, record only anonymous aggregate counts/notes; do not add analytics or transmit learner data.

| Component | Proposed evidence | Collection approach |
|---|---|---|
| **L — Learning** | Correct reasoning on the two target concepts plus a short transfer/explain-back response in the learner's own words | Brief facilitator rubric; compare scenario choice with explanation, not just completion or score |
| **E — Engagement** | Completion of both levels, voluntary replay, and persistence after a recoverable mistake | Anonymous session tally; interpret time-on-task in context, never as the sole engagement measure |
| **M — Motivation/self-efficacy** | Learner's confidence to make a simple money plan and willingness to try again after an error | Two or three age-readable, non-identifying end-of-session items; optional verbal response |
| **A — Appropriate challenge/flow** | Whether learners can finish with retries, understand instructions, and report an appropriate level of challenge | Retry/hint counts plus facilitator observation and a simple child-friendly challenge rating |
| **G — Guessing/exploitation** | Rapid answer changes or selections with no explanation; answer-copying if tested in a group | Facilitator observation; do not infer guessing from speed alone |
| **C — Cognitive overload** | Requests for repeated clarification, instruction rereads, confusion reports, or inability to explain the task | Facilitator tally and an optional "was anything confusing?" question |

No universal numeric success thresholds are claimed. Set thresholds with the owner after age range and use setting are confirmed, before collecting player evidence.

## Main risks and responses

- **Guessing masks learning:** compare explanations or transfer responses as well as selected answers.
- **Reading load exceeds age level:** use short sentences, common vocabulary, read-aloud by facilitator if needed; confirm grade range.
- **Dark visuals feel frightening:** test comfort with the intended age range; keep atmosphere mysterious, not threatening or graphic.
- **Investment lesson suggests certainty:** explicitly show uncertainty and that investment can lose value; avoid real-world recommendations.
- **Child privacy:** no accounts or remote telemetry for learners; use anonymous aggregates only if a supervised prototype test is approved.
- **3D performance or missing assets:** retain a lightweight fallback scene and test mobile loading before accepting the Blender build.

## Acceptance examples

1. A learner can explain that saving some money protects a future goal, even if they initially pick a distractor.
2. A learner can identify that concentrating all funds in one investment exposes them to more risk, without being told that any investment guarantees profit.
3. Wrong answers show concept-specific feedback and require a correct answer before the key is earned.
4. Scores and the final progress summary communicate growth without labeling a child as a failure.
5. Each concept can be completed with no personal account or real financial information.
6. The 3D scene is original, age-appropriate, responsive, and has a fallback if WebGL or GLB loading fails.

## Open questions

- Confirm classroom, home, or both; exact grade/reading range.
- Confirm whether explain-back/transfer prompts are acceptable within the two-level interaction constraint.
- Define practical numeric prototype targets after the intended test context is known.
- Both Blender add-ons are installed/enabled; Codex restart and starting both local listeners remain necessary before modeling.

## Gate

Approved by the project owner on 2026-11-24. Proceed to relevant evidence review and concept generation; the tournament profile remains locked.
