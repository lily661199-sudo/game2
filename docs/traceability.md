# Requirements traceability — draft

| Requirement | Source | Current implementation | Evidence/test | Status |
|---|---|---|---|---|
| R-01: Teach everyday financial literacy to elementary learners. | Owner brief + approved Define | Two financial themes; tournament has 8 AI-pre-scored candidates | `docs/game-design-tournament.md`; no learner study yet | Concept gate pending; grade/reading range open |
| R-02: Provide two levels with one interactive exercise each. | Owner brief | Current build has two deterministic questions; tournament candidates preserve the two-interaction limit | `docs/game-design-tournament.md` | Existing build; new gameplay selection pending |
| R-03: Correct solution is required for a level key. | Owner brief | Correct response unlocks key; incorrect response requires retry | Source inspection only | Implemented |
| R-04: Display a score for every level. | Owner brief | Per-level score display | Source inspection only | Implemented |
| R-05: Show final progress outcome. | Owner brief | Total score, key count, progress label | Source inspection only | Implemented; educational validity untested |
| R-06: Deploy as a web experience. | Owner brief | Static files and GitHub Pages workflow in repository | Remote push completed earlier; deployment health not verified in this audit | Implemented; hosting check pending |
| R-07: Reach the requested cinematic mood with original assets. | Owner visual reference | Original SVG room, dark lighting and responsive panels | `docs/game-design-tournament.md`; visual gate follows gameplay selection | Draft direction; three variants to follow after concept choice |
| R-08: Use Blender model(s) for web. | Owner brief and later Blender-path choice | No `.blend`/`.glb` currently in game | `docs/blender-setup.md` | Add-ons installed/enabled; listeners need activation and verification |
