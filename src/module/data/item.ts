/**
 * TODO write ngDoc
 *
 * @since 07/04/2021
 */

interface FireMode {
  mode: string;
  value: number;
}

export interface WeaponData {
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

interface SoldierTypeDataSource {
  type: 'soldierType';
  data: {
    [key: string]: any;
  };
}

interface WeaponDataSource {
  type: 'weapon';
  data: WeaponData;
}

interface ItemsDataSource {
  type: 'item';
  data: {
    [key: string]: any;
  };
}

export type ItemDataSource =
  | SoldierTypeDataSource
  | WeaponDataSource
  | ItemsDataSource;
