/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/09/2021
 */
import { CharacterDataSource } from './character';
import { NpcDataSource } from './npc';

export interface Characteristic {
  rawValue: number;
  advancement: number;
  min: number;

  value: number;
  mod: number;
}

export interface BaseCharacter {
  characteristics: {
    str: Characteristic;
    t: Characteristic;
    ag: Characteristic;
    wfr: Characteristic;
    wfm: Characteristic;
    int: Characteristic;
    per: Characteristic;
    cr: Characteristic;
    ch: Characteristic;
    ld: Characteristic;
  };
  mythicCharacteristics: {
    str: {
      value: number;
    };
    t: {
      value: number;
    };
    ag: {
      value: number;
    };
  };
  wounds: {
    current: number;
    max: number;
  };
  armor: {
    head: number;
    chest: number;
    arms: number;
    legs: number;
  };
}

export type ActorDataSource = CharacterDataSource | NpcDataSource;
