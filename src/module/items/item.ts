import { WeaponData } from '../data/item';

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

    if (this.data.type === 'weapon') this._prepareWeaponData(this.data.data);
  }

  _prepareWeaponData(data: WeaponData): void {
    console.log('_prepareWeaponData', data);
  }
}
