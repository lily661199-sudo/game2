# Decision log

| ID | Date | Decision | Source/status | Consequence |
|---|---|---|---|---|
| D-001 | 2026-11-24 | Use learning-first weights: L/E/M/A = 50/15/10/25. | Explicit user selection | Lock before concept generation/scoring. |
| D-002 | 2026-11-24 | Use guessing penalty G=.15 and cognitive-overload penalty C=.10; no hard gates. | Explicit user selection | Use deterministic `R_edu`; do not claim the score is learning evidence. |
| D-003 | 2026-11-24 | Handle Blender add-on/MCP setup before modeling. | Explicit user selection | Check toolchain; request action-time confirmation before installing/running third-party components. |
| D-004 | 2026-11-24 | DT-SDLC interaction mode is teaching. | Inferred from applying DT-SDLC and game-design Teaching mode to an elementary financial-literacy game | Use guided gates and teaching artifacts; do not mark approvals without explicit user decisions. |
| D-005 | 2026-11-24 | Install both the MCP for Blender and Blender Toolkit local add-ons, with localhost connections. | Explicit user selection and install confirmation | Use MCP safe mode; disable telemetry; keep both listeners loopback-only. |
| D-006 | 2026-11-24 | Empathize phase approved; proceed to Define. | Explicit user selection | Continue under the teaching-mode stage gates. |
| D-007 | 2026-11-24 | Define framing and proposed anonymous L/E/M/A/G/C measures approved. | Explicit user selection | Proceed to Ideate; candidate ratings remain AI pre-scores until player testing. |
| D-008 | 2026-11-24 | Ideate research review and 8-concept tournament completed; shortlist B/A/D awaits owner selection. | `docs/game-design-tournament.md`; AI-only review | Do not implement a gameplay change until concept selection; next prepare exactly three visual directions. |
| D-009 | 2026-11-25 | Combine concepts A (Goal Drawer), B (Pocket Satchel), and D (Lantern Route) as one integrated two-interaction game. | Explicit owner direction | Use a finite-resource plan and visible goal progress, carried objects, and cinematic consequence paths. |
| D-010 | 2026-11-25 | After style selection, create all character/environment art and animation in Blender to follow one approved visual bible. | Explicit owner direction | Do not finalize 3D appearance before the three style options are reviewed and one is selected. |
| D-011 | 2026-11-25 | Set up the ImageGen CLI fallback because the built-in generator is unavailable. | Explicit owner authorization | Keep the API key local to the user's shell; generate the three separate style concepts after the user enters the key. |
| D-012 | 2026-11-25 | Do not purchase API credits; use assistant-authored, no-API SVG visual directions for style selection. | Explicit owner direction after API returned zero-credit 429 | Clearly distinguish SVG concept art from ImageGen; all final 3D work follows the selected direction. |
| D-013 | 2026-11-25 | Select visual direction 2: layered paper storybook. | Explicit owner selection | Apply the paper-cut palette, layered edges, and gentle storybook lighting to the browser interface, environments, character, and animation. |
