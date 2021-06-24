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
import { MythicCharacterActor } from './module/actors/characterActor';
import { MythicCharacterSheet } from './module/actors/characterSheet';
import { MythicItem } from './module/items/item';
import { MythicWeaponItemSheet } from './module/items/sheets/weaponItemSheet';
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';

Handlebars.registerHelper('checkedIf', (condition) =>
  condition ? 'checked' : ''
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
  console.log('mythic | Initializing mythic');

  // Assign custom classes and constants here
  // @ts-ignore
  CONFIG.Actor.documentClass = MythicCharacterActor;
  // @ts-ignore
  CONFIG.Item.documentClass = MythicItem;

  // Debug flags
  CONFIG.debug.hooks = false;

  // @ts-ignore
  CONFIG.Combat.initiative.formula = '1d10 + @characteristics.ag.mod';
  // @ts-ignore
  // Combatant.prototype._getInitiativeFormula = getInitiativeFormula;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('mythic', MythicCharacterSheet, {
    types: ['character'],
    makeDefault: true,
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('mythic', MythicWeaponItemSheet, {
    types: ['meleeWeapon'],
    makeDefault: true,
  });

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
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
