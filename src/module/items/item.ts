/**
 * TODO write ngDoc
 *
 * @since 06/14/2021
 */
export class MythicItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData(): void {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const { data } = itemData;

    if (this.type === 'weapon') this._prepareWeaponData(data);
  }

  _prepareWeaponData(data: object): void {
    console.log('_prepareMeleeWeaponData', data);
  }
}
