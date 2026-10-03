# fivemui13

Standalone browser-only GTA V / FiveM tuning UI prototype.

Open `index.html` directly in a browser. No server, Lua, framework, npm, or build step is required.

## Current prototype

- Transparent UI only — no fake garage, lights, scene, or decorative page background
- Reference-style left tuning catalog + right configuration panel
- Liquid / soft glass surfaces
- Cash, Bank, Diamante and Lei balances
- Colors: Normal, Matte, Metallic, Chrome and Chameleon
- Engine Stage 1–4 and premium Stage 4 Turbo
- Suspension, armor, body components, liveries, neon, headlights, tire smoke, wheels
- 30 engine sound presets from 12kk to 500kk
- Custom SVG icons and illustrated option thumbnails
- Premium items have continuous falling-gold particles
- Exact low-poly geometry extracted from the uploaded `model.gltf` is rendered as the 3D shopping cart
- Adding a part animates the selected tuning card along a curved path into the 3D cart
- Cart reacts physically with bounce, rotation and particle impact
- Checkout randomly plays one of three separate payment sequences based on the uploaded Bancard POS animation: card insert, card swipe, or contactless tap
- The tuning UI is locked during the purchase animation and automatically closes only after it finishes
- Browser demo includes an `OPEN TUNING UI` button after the simulated close so the flow can be tested repeatedly
