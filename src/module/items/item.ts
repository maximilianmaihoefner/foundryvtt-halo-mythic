/**
 * TODO write ngDoc
 *
 * @since 06/14/2021
 */
export class MythicItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const data = itemData.data;

    if (this.type === 'meleeWeapon') this._prepareMeleeWeaponData(data);
    if (this.type === 'rangedWeapon') this._prepareRangedWeaponData(data);
  }

  _prepareMeleeWeaponData(data) {
    console.log('_prepareMeleeWeaponData', data);
  }

  _prepareRangedWeaponData(data) {
    console.log('_prepareRangedWeaponData', data);
  }
}
