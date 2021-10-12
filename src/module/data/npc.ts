import { BaseCharacter } from "./actor";

/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/09/2021
 */
export interface NpcData extends BaseCharacter {
}

export interface NpcDataSource {
  type: 'npc';
  data: NpcData;
}
