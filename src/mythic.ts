/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 *          you may want to put a (link to a) license or copyright
 *          notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 *           determines how others may use and modify your system
 */
import { MythicActor } from './module/actors/actor';
import { MythicCharacterSheet } from './module/actors/characterSheet';
import { MythicNpcSheet } from "./module/actors/npcSheet";
import { MythicCombat, MythicCombatant } from "./module/combat/mythicCombat";
import { MythicItem } from './module/items/item';
import { MythicWeaponItemSheet } from './module/items/sheets/weaponItemSheet';
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';

Handlebars.registerHelper('checkedIf', (condition) =>
  condition ? 'checked' : ''
);

Handlebars.registerHelper('attrIf', (attr, condition) =>
  condition ? attr : ''
);
Handlebars.registerHelper('ifCond', (v1, v2, options) => {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse();
});
Handlebars.registerHelper('json', (context) =>
  JSON.stringify(context, null, 2)
);

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log(`
__________________________________________________________
 _   _       _         __  __       _   _     _
| | | | __ _| | ___   |  \\/  |_   _| |_| |__ (_) ___
| |_| |/ _\` | |/ _ \\  | |\\/| | | | | __| '_ \\| |/ __|
|  _  | (_| | | (_) | | |  | | |_| | |_| | | | | (__
|_| |_|\\__,_|_|\\___/  |_|  |_|\\__, |\\__|_| |_|_|\\___| v4.0
                              |___/
==========================================================
`);
  console.log('mythic | Initializing mythic');

  // Assign custom classes and constants here
  CONFIG.Actor.documentClass = MythicActor;
  CONFIG.Item.documentClass = MythicItem;
  CONFIG.Combat.documentClass = MythicCombat;
  CONFIG.Combatant.documentClass = MythicCombatant;

  // Debug flags
  CONFIG.debug.hooks = false;

  CONFIG.Combat.initiative.formula = '1d10 + @characteristics.ag.mod';
  // Combatant.prototype._getInitiativeFormula = getInitiativeFormula;

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('mythic', MythicCharacterSheet, {
    types: ['character'],
    makeDefault: true,
  });
  Actors.registerSheet('mythic', MythicNpcSheet, {
    types: ['npc'],
    makeDefault: true,
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('mythic', MythicWeaponItemSheet, {
    types: ['weapon'],
    makeDefault: true,
  });
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once('setup', () => {
  // Do anything after initialization but before
  // ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', async () => {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  // Hooks.on('hotbarDrop', (bar, data, slot) => createMythicMacro(data, slot));
});

// const createMythicMacro = (data, slot) => {};

// Add any additional hooks if necessary
// export const getInitiativeFormula = function (this: any): string {
//   const { actor } = this;
//   if (!actor) return '1d10';
//
//   return `1d10 + ${actor.data.data.characteristics.ag.mod}`;
// };
