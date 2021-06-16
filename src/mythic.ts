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

  // Combat.prototype.rollInitiative = rollInitiative;

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

/**
 * Overide of rollInititative to prevent messages in chat windows
 * Roll initiative for one or multiple Combatants within the Combat entity
 * @param {Array|string} ids        A Combatant id or Array of ids for which to roll
 * @param {string|null} formula     A non-default initiative formula to roll. Otherwise the system default is used.
 * @param {Object} messageOptions   Additional options with which to customize created Chat Messages
 * @return {Promise.<Combat>}       A promise which resolves to the updated Combat entity once updates are complete.
 */
async function rollMythicInitiative(ids/*, formula=null, messageOptions={}*/) {
  // Structure input data
  ids = typeof ids === 'string' ? [ids] : ids;
  const currentId = this.combatant.id;

  // Iterate over Combatants, performing an initiative roll for each
  const [updates] = ids.reduce((results, id) => {
    let [updates] = results;

    // Get Combatant data
    const c = this.combatants.get(id);
    if (!c) return results;

    // Roll initiative
    const initiative = c.actor.rollInitiative(!!c.getFlag('CoC7', 'hasGun'));
    updates.push({ _id: id, initiative: initiative });

    // Return the Roll and the chat data
    return results;
  }, [[], []]);
  if (!updates.length) return this;

  // Update multiple combatants
  await this.updateEmbeddedDocuments('Combatant', updates);

  // Ensure the turn order remains with the same combatant
  await this.update({ turn: this.turns.findIndex(t => t.id === currentId) });

  // Create multiple chat messages
  // await CONFIG.ChatMessage.entityClass.create(messages);

  // Return the updated Combat
  return this;
}
