# Foundry VTT - Halo Mythic v4.0 (Unofficial)
[![CI](https://github.com/maximilianmaihoefner/foundryvtt-halo-mythic/actions/workflows/ci.yml/badge.svg)](https://github.com/maximilianmaihoefner/foundryvtt-halo-mythic/actions/workflows/ci.yml)
![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/maximilianmaihoefner/foundryvtt-halo-mythic/main/src/system.json)
![Latest Release Download Count](https://img.shields.io/github/downloads/maximilianmaihoefner/foundryvtt-halo-mythic/latest/mythic.zip)
![Repository License](https://img.shields.io/github/license/maximilianmaihoefner/foundryvtt-halo-mythic)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/maximilianmaihoefner/foundryvtt-halo-mythic/issues)

Implements the [Halo Mythic](https://www.reddit.com/r/HaloMythic/) role-playing game into the [Foundry Virtual Tabletop](https://foundryvtt.com).

This System implementation, as well as Halo Mythic itself, are unofficial and are not endorsed by or affiliated with Microsoft.

## Features
tbd

## Inconsistencies
- This implementation of Halo Mythic interprets Wounds in a more traditional Hit Point way, meaning, it is
  good to have high current Wounds and bad to lose Wounds.

## Installation

> This System is not complete and should be considered alpha software.
  Things might break or are simply not working at all. If you encounter any issues please
  feel free to create an [Issue](https://github.com/maximilianmaihoefner/foundryvtt-halo-mythic/issues/new/choose).

> Make sure to create a Backup of your existing Worlds if you are updating to a newer Version.
  Things might break in irreversible ways, so make sure to always have a Backup on Hand.

- Open up Foundry and navigate to the Setup Screen.
- Select "Game Systems" and then click on the "Install System"-Button on the lower left part of the window.
- Enter: `https://github.com/maximilianmaihoefner/foundryvtt-halo-mythic/releases/latest/download/system.json`
  into the "Manifest URL"-Field and click the "Install"-Button.
- Foundry will now download the lastest Version of Halo Mythic.
- Now you can set up a world using the "Halo Mythic 4.0"-System like you would do with every other System.

## TODO
- [ ] Add 'Appearance'-Box to Biography-Tab
- [ ] Add 'Background'-Box to Biography-Tab
- [ ] Calculate Max-Wounds, applying lifestyle bonuses
- [ ] Allow adding other Equipment to Inventory, not just weapons.
- [ ] Add Settings-overwrite to allow incompatible upbringing and environment combinations
- [ ] Add Settings-overwrite to change movement/carrying multipliers.
- [ ] Add Definitions for Educations.
- [ ] Implement 'fast foot' for initiative rolls.
- [X] ~~Implement Mythic characteristics.~~
- [ ] Add Special Damage options to Medical-Tab.
- [X] ~~Auto calculate Damage for players and enemies.~~
- [ ] Add compendium for weapons.
- [ ] Add compendium for npcs.
- [ ] Consume Ammo when Weapons are shot.
- [ ] Implement reload rules.
- [ ] Add macro support.
- [ ] Create Player Character Macro (a wizard for creating player characters)
- [ ] Create Npc Macro
- [ ] Create Encounter Macro
- [ ] Maybe add [Quench](https://github.com/schultzcole/FVTT-Quench) Tests

## Copyright
This project is licensed under the terms of the GNU LGPL v3 license.

Halo Mythic Role-playing game created by Vorked.

Halo © Microsoft Corporation. FoundryVTT - Halo Mythic was created under Microsoft's
["Game Content Usage Rules"](https://www.xbox.com/en-US/developers/rules)
using assets from Halo, and it is not endorsed by or affiliated with Microsoft.

### Image Credits
- [BR55 Image](https://halo.fandom.com/wiki/BR55_Service_Rifle?file=H5G_Render_BR55_Service_Rifle.png) from Halo Alpha User [Dab1001](https://halo.fandom.com/wiki/User:Dab1001)
- [BR85N Image](https://halo.fandom.com/wiki/BR85N_Service_Rifle?file=H5G_Render_BattleRifle.png) from Halo Alpha User [Haloprov](https://halo.fandom.com/wiki/User:Haloprov)
- [DMR M392 Image](https://halo.fandom.com/wiki/M392_Designated_Marksman_Rifle?file=HReach-M392-DMR-Profile.png) from Halo Alpha User [Vektor0](https://halo.fandom.com/wiki/User:Vektor0)
- [DMR M395 Image](https://halo.fandom.com/wiki/M395_Designated_Marksman_Rifle?file=H4-M395DMR-SideRender.png) from Halo Alpha User [Haloprov](https://halo.fandom.com/wiki/User:Haloprov)
- [M90 Image](https://www.halopedia.org/File:H3-M90-Shotgun-Side.png) from Halopedia User [Shazamikaze](https://www.halopedia.org/User:Shazamikaze)
- [M6C Image](https://halo.fandom.com/wiki/M6C_Personal_Defense_Weapon_System?file=H2A_Render_M6C.png) from Halo Alpha User [Grunty89](https://halo.fandom.com/wiki/User:Grunty89)
- [M9 Image](https://halo.fandom.com/wiki/M9_High-Explosive_Dual-Purpose_grenade?file=H2A_M9Frag.png) from Halo Alpha User [LazyReader](https://halo.fandom.com/wiki/User:LazyReader)
- [MA37 Image](https://halo.fandom.com/wiki/MA37_Individual_Combat_Weapon_System?file=HaloReach_-_MA37.png) from Halo Alpha User [Shazamikaze](https://www.halopedia.org/User:Shazamikaze)
- [Combat Knife Image](https://www.halopedia.org/File:Combat_Knife.png) from Halopedia User [Subtank](https://www.halopedia.org/User:Subtank)

### Missing Images
- M6A
- Napalm Grenade
- Police Baton
- Smoke Screen Grenade
- Taser Gun

## Contributing

### Build
```bash
npm run build
```

### Tests
```bash
npm run test
```
