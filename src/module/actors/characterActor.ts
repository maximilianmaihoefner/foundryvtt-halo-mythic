/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
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

export interface CharacterData {
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
}

export class MythicCharacterActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData(): void {
    super.prepareData();

    const actorData = this.data;
    const { data } = actorData;
    // const { flags } = actorData;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character')
      this._prepareCharacterData(data as CharacterData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data: CharacterData): void {
    console.log('data', data);

    const advSkills = [
      'cryptography',
      'demolition',
      'medicationHuman',
      'medicationCovenant',
      'medicationMgalekgolo',
      'security',
      'technologyHuman',
      'technologyCovenant',
      'technologyForerunner',
    ];

    for (const [key, skill] of Object.entries(data.skills)) {
      switch (key) {
        case 'appeal':
        case 'deception':
        case 'negotiation':
          skill.defaultCharacteristics = ['ch'];
          break;
        case 'athletics':
          skill.defaultCharacteristics = ['ag', 'str'];
          break;
        case 'camouflage':
        case 'investigation':
        case 'navigationGroundAir':
        case 'navigationSpace':
        case 'navigationSlipspace':
        case 'survival':
          skill.defaultCharacteristics = ['int', 'per'];
          break;
        case 'command':
          skill.defaultCharacteristics = ['ld'];
          break;
        case 'cryptography':
        case 'demolition':
        case 'medicationHuman':
        case 'medicationCovenant':
        case 'medicationMgalekgolo':
        case 'security':
        case 'technologyHuman':
        case 'technologyCovenant':
        case 'technologyForerunner':
          skill.defaultCharacteristics = ['int'];
          break;
        case 'evasion':
        case 'stunting':
          skill.defaultCharacteristics = ['ag'];
          break;
        case 'gambling':
          skill.defaultCharacteristics = ['int', 'ch'];
          break;
        case 'interrogation':
          skill.defaultCharacteristics = ['ch', 'ld', 'int'];
          break;
        case 'pilotGround':
        case 'pilotAir':
        case 'pilotSpace':
          skill.defaultCharacteristics = ['ag', 'int'];
          break;
        case 'intimidation':
          skill.defaultCharacteristics = ['str', 'ch', 'ld', 'int'];
          break;
      }
      if (skill.defaultCharacteristics) {
        skill.characteristic = skill.defaultCharacteristics[0];
      } else {
        skill.characteristic = 'str';
        console.error('No defaultCharacteristics for', key);
      }
      skill.adv = advSkills.includes(key);
    }

    for (const [key, characteristic] of Object.entries(data.characteristics)) {
      // Calculate the modifier using d20 rules.
      characteristic.value =
        (characteristic.rawValue || 0) + (characteristic.advancement || 0) * 5;
      characteristic.mod = Math.floor(characteristic.value / 10);

      if (key == 'ag') {
        const { mod } = characteristic;
        data.movement = {
          half: mod > 0 ? mod : 0.5,
          full: mod > 0 ? mod * 2 : 1,
          charge: mod > 0 ? mod * 3 : 2,
          run: mod > 0 ? mod * 6 : 3,
          sprint: mod * 8,

          jump: data.characteristics.str.mod / 4,
          leap:
            Math.max(
              data.characteristics.str.mod,
              data.characteristics.ag.mod
            ) / 2,
        };
      }
    }

    const carry = data.characteristics.str.value + data.characteristics.t.value;

    data.carryingCapacity = {
      carry,
      lift: carry * 2,
      push: carry * 4,
    };
  }
}
