import { BaseCharacter } from './actor';

/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/09/2021
 */
export type NpcData = BaseCharacter;

export interface NpcDataSource {
  type: 'npc';
  data: NpcData;
}
