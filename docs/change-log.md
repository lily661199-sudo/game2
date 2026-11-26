# Change log

## 2026-11-24 — Initialize skill-governed project records

- Added draft DT-SDLC state and a project brief based on the owner's original request and subsequent profile choices.
- Added an Empathize evidence/assumption register and decision log.
- No gameplay code, deployed files, or remote GitHub state changed in this step.
- Installed Blender 5.3 add-ons for MCP for Blender and Blender Toolkit 1.4.4; configured the Codex server for safe mode, telemetry disabled, and localhost.
- Project owner approved Define and its proposed observable-measure plan; moved the state to Ideate.
- Open work: generate/select a visual direction; start/verify Blender listeners after app/session reload; create 3D character/scenes/animation after style selection; continue SDLC design/build/verification/release and final acceptance.
- Completed the eight-concept, three-generation game-design tournament with five separated AI review lenses and transparent G/P/D and R_edu pre-scores; prepared a student worksheet and instructor rubric. Gameplay selection remains pending; no gameplay code or assets changed.

## 2026-11-25 — Integrated concept and ImageGen CLI

- Project owner selected a combined Goal Drawer + Pocket Satchel + Lantern Route concept and requested three ImageGen style images, followed by coherent Blender scenes, characters, and animation in the chosen style. Saved the integrated mechanic and three separate style prompts.
- After explicit approval, created an ignored project-local Python 3.12 venv, installed the OpenAI Python SDK, added `tools/imagegen.ps1`, and verified CLI help plus a dry-run payload. The API key is stored only as a Windows-user-encrypted credential outside the repository.
- The user securely saved an API key, but the first ImageGen request returned HTTP 429 because the API organization has no credits. The user declined paid credits and asked for GPT to make the options without payment; created three original SVG concept illustrations in the same composition, one each for handcrafted stop-motion, layered paper storybook, and stylized low-poly cinema. These are not ImageGen API outputs. No further API requests were sent.
- Combined all three self-contained vector concepts into one labelled comparison image at `assets/style-concepts/style-triptych.svg`; validated that the parent SVG and each embedded panel parse successfully.
- Replaced that first-pass board with three matching-composition Blender 5.3 Cycles renders (1600×900 each) and a single labelled PNG comparison at `assets/style-concepts/blender-style-triptych.png`; the third direction uses a distinct cool-blue geometric palette. No paid API calls were retried. The images are style studies, not a claim of final-parity art; detailed production assets and animation wait for style selection.
- Owner selected direction 2 (layered paper storybook). Added a project visual-style decision and a dedicated responsive stylesheet that re-skins the title, level, answer, score, key, and progress screens; the selected Blender concept image now anchors the in-game scene art. No paid API request was made.
- Used Blender 5.3 background mode to save an editable paper-harbor `.blend`, export a 1.9 MB GLB, and render the selected scene. Added a 72-frame looping idle animation for the traveler, and a Three.js runtime that loads the GLB into the level scene while retaining the rendered image as a fallback. The market/lighthouse-specific set dressing still needs a later art pass. No ImageGen request was made.

## 2026-11-26 — 沉浸式點擊場景
- 關卡改為滿版夢境場景與角落得分/進度/鑰匙 HUD。
- 點擊場景微光才展開題卡，支援關閉、再次開啟與點選音效。
- 保留兩關理財題、答題計分、通關鑰匙與結尾進步成果。

## 2026-11-26 — 3D 探索與部署修復
- 場景加入可行走、跳躍的小小夢魔紙藝角色；支援 WASD、方向鍵、空白鍵與手機觸控方向鍵。
- 3D 寶箱亮點依場景投影定位；靠近場景物件後點擊或按 E 才展開理財題卡。
- Pages artifact 上傳和部署拆成兩個 job，避免 GitHub Actions artifact 索引延遲造成部署失敗。

## 2026-11-26 — 房間內 3D 探索
- 將平面背景關卡改為 Three.js 封閉室內場景，含木地板、花紋壁紙、壁板、窗、老式櫃子、書架、桌燈與地毯。
- 角色可在房間內用 WASD 走動、跳躍、拖曳轉動視角，並避開家具。
- 寶箱/燈塔機關有房內位置；角色走近後才可按 E 或點擊亮點開啟題目。
- 手機保留觸控方向鍵，兩關各自切換房間布置與氛圍。
