import { Special } from '../definitions/upbringings';

/**
 * TODO write ngDoc
 *
 * @since 07/04/2021
 */

export interface Characteristic {
  rawValue: number;
  advancement: number;
  min: number;

  value: number;
  mod: number;
}

export interface Skill {
  advancement: number;
  /**
   * Advanced skill.
   */
  adv: boolean;
  characteristic: string;
  defaultCharacteristics: string[];
}

export interface Lifestyle {
  name: string;
  result: number;
  special: {
    [key: string]: Special;
  };
}

export interface CharacterDataSourceData {
  infos: {
    soldierType: string;
    faction: string;
    rank: string;
    height: string;
    weight: string;
    specialisation: string;
    gender: string;
    race: string;
    upbringing: string;
    environment: string;
    lifestyle: {
      0: Lifestyle;
      1: Lifestyle;
      2: Lifestyle;
    };
  };
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
  skills: {
    appeal: Skill;
    athletics: Skill;
    camouflage: Skill;
    command: Skill;
    cryptography: Skill;
    deception: Skill;
    demolition: Skill;
    evasion: Skill;
    gambling: Skill;
    interrogation: Skill;
    intimidation: Skill;
    investigation: Skill;
    medicationHuman: Skill;
    medicationCovenant: Skill;
    medicationMgalekgolo: Skill;
    navigationGroundAir: Skill;
    navigationSpace: Skill;
    navigationSlipspace: Skill;
    negotiation: Skill;
    pilotGround: Skill;
    pilotAir: Skill;
    pilotSpace: Skill;
    security: Skill;
    stunting: Skill;
    survival: Skill;
    technologyHuman: Skill;
    technologyCovenant: Skill;
    technologyForerunner: Skill;
  };
  educations: {
    name: string;
    characteristic: string;
    advancement: number;
  }[];
  movement: {
    half: number;
    full: number;
    charge: number;
    run: number;
    sprint: number;
    jump: number;
    leap: number;
  };
  carryingCapacity: {
    carry: number;
    lift: number;
    push: number;
  };
  languages: {
    [key: string]: string;
  };
  credits: number;
  equipment: {
    [key: string]: {
      name: string;
      amount: number;
      cost: number;
      weight: number;
    };
  };
  abilities: {
    [key: string]: {
      name: string;
      description: string;
    }
  };
  experience: number;
  experienceSpent: number;
  experienceUnspent: number;
  factionTrainings: {
    human: boolean;
    covenant: boolean;
    forerunner: boolean;
  };
  weaponTrainings: {
    basic: boolean;
    infantry: boolean;
    vehicle: boolean;
    melee: boolean;
    heavy: boolean;
    advanced: boolean;
    longRange: boolean;
    explosive: boolean;
  };
}

interface CharacterDataSource {
  type: 'character';
  data: CharacterDataSourceData;
}

export type ActorDataSource = CharacterDataSource;
/*| other types... */
