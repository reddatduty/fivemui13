# fivemui13

Standalone browser-only GTA V / FiveM tuning UI prototype.

Open `index.html` directly in a browser.

## Current build

- Transparent center area for the actual GTA/FiveM vehicle
- Reference-style left tuning rail + adjacent parts panel + right configuration panel
- Much squarer, denser UI with less rounded styling
- 40+ separate tuning tabs, including individual body systems such as Spoiler, Front Bumper, Rear Bumper, Side Skirts, Exhaust, Frame, Grille, Hood, Fenders, Roof, Plate Holder, Interior Trim, Dashboard, Seats, Steering Wheel, Shifter, Trunk, Engine Block, Air Filter, Struts, Arch Covers, Aerials, Fuel Tank and more
- Custom colorful SVG artwork for every tuning category and product thumbnail
- Premium items use falling-gold particles
- Stationary 3D shopping cart rendered from the uploaded `model.gltf` geometry
- The cart does not spin
- Add-to-build animation moves the entire selected upgrade card from its real screen position to the foreground/center first, then shrinks/arcs it into a random position inside the cart
- Cart-entry impact particles appear only at the final drop point
- Full shopping-cart drawer and multi-currency totals
- Cash, Bank, Diamante and Lei balances
- Three checkout animations: card insert, card swipe, and contactless tap
- UI cannot be closed until the purchase animation finishes
- After a successful browser-demo purchase, the tuning UI closes automatically

No server, Lua, framework, npm, or build step is required.
