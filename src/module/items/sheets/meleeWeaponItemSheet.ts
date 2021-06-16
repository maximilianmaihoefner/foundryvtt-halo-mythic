/**
 * TODO write ngDoc
 *
 * @since 06/14/2021
 */
export class MythicMeleeWeaponItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic", "sheet", "item", "meleeWeapon"],
      template: 'systems/mythic/templates/items/melee-weapon.html',
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  getData() {
    const data = super.getData() as any;
    const itemData = (this.item.data as any).toObject(false);

    // Redefine the template data references to the actor.
    data.item = itemData;
    data.data = itemData.data;

    console.log('item data', data);

    return data;
  }

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = (this.element as JQuery).find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }
}
