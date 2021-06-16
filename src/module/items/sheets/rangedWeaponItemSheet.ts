/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 06/14/2021
 */
export class MythicRangedWeaponItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic", "sheet", "item", "rangedWeapon"],
      template: 'systems/mythic/templates/items/ranged-weapon.html',
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }
}
