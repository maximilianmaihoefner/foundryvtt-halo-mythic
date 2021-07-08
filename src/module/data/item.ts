/**
 * TODO write ngDoc
 *
 * @since 07/04/2021
 */

interface FireMode {
  mode: string;
  value: number;
}

export interface WeaponDataSourceData {
  tags: string[];
  alias: string;
  faction: string;
  characteristic: string;
  fireModes: FireMode[];
  // "fireModes": {},
  weaponType: string;
  damageRoll: string;
  baseDamage: string;
  piercing: string;
  range: string;
  cost: string;
  weight: string;
  description: string;
  attachments: [];
  magazin: string;
  ammunition: string;
  reload: string;
}

interface WeaponDataSource {
  type: 'weapon';
  data: WeaponDataSourceData;
}

export type ItemDataSource = WeaponDataSource;
