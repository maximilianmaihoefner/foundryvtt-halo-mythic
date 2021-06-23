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
import { MythicMeleeWeaponItemSheet } from './module/items/sheets/meleeWeaponItemSheet';
import { MythicRangedWeaponItemSheet } from './module/items/sheets/rangedWeaponItemSheet';
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
  console.log('mythic | Initializing mythic');

  // Assign custom classes and constants here
  // @ts-ignore
  CONFIG.Actor.documentClass = MythicCharacterActor;
  // @ts-ignore
  CONFIG.Item.documentClass = MythicItem;

  // Debug flags
  CONFIG.debug.hooks = false;

  // @ts-ignore
  CONFIG.Combat.initiative.formula = "1d10 + @characteristics.ag.mod";
  // @ts-ignore
  Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('mythic', MythicCharacterSheet, { types: ['character'], makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('mythic', MythicMeleeWeaponItemSheet, { types: ['meleeWeapon'], makeDefault: true });
  Items.registerSheet('mythic', MythicRangedWeaponItemSheet, { types: ['rangedWeapon'], makeDefault: true });

  Handlebars.registerHelper('checkedIf', function (condition) {
    return (condition) ? 'checked' : '';
  });
  Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context, null, 2);
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
Hooks.once('setup', function () {
  // Do anything after initialization but before
  // ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
  // Do anything once the system is ready
});

// Add any additional hooks if necessary
export const _getInitiativeFormula = function() {
  const actor = this.actor;
  if ( !actor ) return "1d10";

  return "1d10 + " + actor.data.data.characteristics.ag.mod;
};
