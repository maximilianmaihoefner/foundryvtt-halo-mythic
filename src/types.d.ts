/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 07/04/2021
 */
import { MythicActor } from './module/actors/actor';
import { ActorDataSource } from './module/data/actor';
import { ItemDataSource } from './module/data/item';
import { MythicItem } from './module/items/item';

declare global {
  interface DocumentClassConfig {
    Actor: typeof MythicActor;
    Item: typeof MythicItem;
  }
  interface SourceConfig {
    Actor: ActorDataSource;
    Item: ItemDataSource;
  }
  interface DataConfig {
    // TODO data after prepareData.
    Actor: ActorDataSource;
    Item: ItemDataSource;
  }
  interface FlagConfig {
    Combat: {
      mythic: {
        turnHistory: any[];
      };
    };
    Combatant: {
      mythic: {
        evadeCount: number;
      };
    };
  }
}
