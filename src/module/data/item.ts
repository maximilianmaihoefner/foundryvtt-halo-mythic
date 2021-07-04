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
  fireModes: FireMode[];
}

interface WeaponDataSource {
  type: 'weapon';
  data: WeaponDataSourceData;
}

export type ItemDataSource = WeaponDataSource;
