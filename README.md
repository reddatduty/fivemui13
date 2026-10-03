# fivemui13

Professional FiveM vehicle tuning NUI inspired by high-end GTA garage/tuning interfaces.

## Included

- Liquid-glass dark garage UI with animated states and responsive scaling
- Top-right Cash, Bank, Diamante and Lei balances
- Paint: Normal, Matte, Metallic, Chrome and Chameleon
- Engine Stage 1–4 plus premium Stage 4 Turbo
- Suspension and armor levels
- Dynamic vehicle body-part slots based on `GetNumVehicleMods`
- Vehicle-specific liveries
- Neon, headlights and tire smoke with premium rainbow options
- 32 wheel presets split across GTA-style wheel categories
- 30 engine sound profiles from 12kk to 500kk
- Preview/equip flow with one final multi-currency checkout
- Search, reset, cart removal, totals and confirmation modal
- Browser demo mode plus FiveM NUI message/callback bridge

## Install

Put the resource in your FiveM resources folder and add:

```cfg
ensure fivemui13
```

Use `/tuningui` or **F7** while inside a vehicle.

## Integration

The front-end sends these NUI callbacks:

- `preview`
- `revertPreview`
- `checkout`
- `requestVehicleSupport`
- `close`

`client.lua` already exposes preview/revert events and forwards checkout to `fivemui13:checkout`.

For production, validate all prices, balances and owned upgrades server-side. The browser values are presentation data and must not be trusted for economy logic.
