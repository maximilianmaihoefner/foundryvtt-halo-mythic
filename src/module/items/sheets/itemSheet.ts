/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/21/2021
 */
export class MythicItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions(): ItemSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic", "sheet", "item"],
      template: "systems/mythic/templates/items/item.hbs",
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description"
        }
      ]
    });
  }

  getData(options?: Partial<ItemSheet.Options>): Promise<ItemSheet.Data> | ItemSheet.Data {
    const data = super.getData() as any;
    const itemData = data.item.data;
    data.data = itemData.data;
    data.flags = itemData.flags;
    data.rollData = this.item.getRollData();

    data.data.description = data.data.description;

    return data;
  }
}
