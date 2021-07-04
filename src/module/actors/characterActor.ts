/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { environments } from "../environments";
import { lifestyles } from "../lifestyles";
import { Special, upbringings } from "../upbringings";

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
      [key: string]: {
        name: string;
        result: number;
        special: {
          [key: string]: Special;
        };
      };
      0: {
        name: string;
        result: number;
        special: {
          [key: string]: Special;
        };
      };
      1: {
        name: string;
        result: number;
        special: {
          [key: string]: Special;
        };
      };
      2: {
        name: string;
        result: number;
        special: {
          [key: string]: Special;
        };
      };
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
  }
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
    if (actorData.type === "character")
      this._prepareCharacterData(data as CharacterData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data: CharacterData): void {
    console.log("data", data);

    let experienceCost = 0;
    const experienceSummary = [];

    const characteristicExperienceCost: { [key: string]: number } = {
      "0": 0,
      "1": 200,
      "2": 400,
      "3": 800,
      "4": 1200,
      "5": 1600
    };

    const advSkills = [
      "cryptography",
      "demolition",
      "medicationHuman",
      "medicationCovenant",
      "medicationMgalekgolo",
      "security",
      "technologyHuman",
      "technologyCovenant",
      "technologyForerunner"
    ];

    for (const [key, skill] of Object.entries(data.skills)) {
      switch (key) {
        case "appeal":
        case "deception":
        case "negotiation":
          skill.defaultCharacteristics = ["ch"];
          break;
        case "athletics":
          skill.defaultCharacteristics = ["ag", "str"];
          break;
        case "camouflage":
        case "investigation":
        case "navigationGroundAir":
        case "navigationSpace":
        case "navigationSlipspace":
        case "survival":
          skill.defaultCharacteristics = ["int", "per"];
          break;
        case "command":
          skill.defaultCharacteristics = ["ld"];
          break;
        case "cryptography":
        case "demolition":
        case "medicationHuman":
        case "medicationCovenant":
        case "medicationMgalekgolo":
        case "security":
        case "technologyHuman":
        case "technologyCovenant":
        case "technologyForerunner":
          skill.defaultCharacteristics = ["int"];
          break;
        case "evasion":
        case "stunting":
          skill.defaultCharacteristics = ["ag"];
          break;
        case "gambling":
          skill.defaultCharacteristics = ["int", "ch"];
          break;
        case "interrogation":
          skill.defaultCharacteristics = ["ch", "ld", "int"];
          break;
        case "pilotGround":
        case "pilotAir":
        case "pilotSpace":
          skill.defaultCharacteristics = ["ag", "int"];
          break;
        case "intimidation":
          skill.defaultCharacteristics = ["str", "ch", "ld", "int"];
          break;
      }
      if (skill.defaultCharacteristics) {
        skill.characteristic = skill.defaultCharacteristics[0];
      } else {
        skill.characteristic = "str";
        console.error("No defaultCharacteristics for", key);
      }
      skill.adv = advSkills.includes(key);
    }

    const upbringing = upbringings.find(value => value.name === data.infos.upbringing);
    const environment = environments.find(value => value.name === data.infos.environment);

    const getLifestyleData = (index: number) => {
      const lifestyle = data.infos.lifestyle[index];
      const lifestyleDefinition = lifestyles.find(value => value.name === lifestyle.name);
      const outcome = lifestyleDefinition?.outcomes.find(
        value => value.min >= lifestyle.result && lifestyle.result <= value.max
      );
      const special = outcome?.special.map((value, index) => ({
        ...value,
        ...lifestyle.special[index]
      }));

      return {
        ...lifestyle,
        ...lifestyleDefinition,
        special: {...special}
      };
    };

    data.infos.lifestyle = {
      '0': getLifestyleData(0),
      '1': getLifestyleData(1),
      '2': getLifestyleData(2)
    };

    for (const [key, characteristic] of Object.entries(data.characteristics)) {
      let bonus = 0;
      const upbringingSpecial = upbringing?.special.find(value => value.attribute === key);
      const environmentSpecial = environment?.special.find(value => value.attribute === key);
      const lifestyle1Special = Object.values(data.infos.lifestyle["0"].special).find(value => value.attribute === key);
      const lifestyle2Special = Object.values(data.infos.lifestyle["1"].special).find(value => value.attribute === key);
      const lifestyle3Special = Object.values(data.infos.lifestyle["2"].special).find(value => value.attribute === key);
      if (upbringingSpecial) {
        bonus += upbringingSpecial.modifier;
        console.log('upbringing characteristic bonus', key, bonus);
      }
      if (environmentSpecial) {
        bonus += environmentSpecial.modifier;
        console.log('environment characteristic bonus', key, bonus);
      }
      if (lifestyle1Special) {
        bonus += lifestyle1Special.modifier;
        console.log('lifestyle1Special characteristic bonus', key, bonus);
      }
      if (lifestyle2Special) {
        bonus += lifestyle2Special.modifier;
        console.log('lifestyle2Special characteristic bonus', key, bonus);
      }
      if (lifestyle3Special) {
        bonus += lifestyle3Special.modifier;
        console.log('lifestyle3Special characteristic bonus', key, bonus);
      }

      characteristic.value =
        bonus + (characteristic.rawValue || 0) + (characteristic.advancement || 0) * 5;
      characteristic.mod = Math.floor(characteristic.value / 10);

      experienceCost += characteristicExperienceCost[characteristic.advancement];

      if (key == "ag") {
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
            ) / 2
        };
      }
    }

    const carry = data.characteristics.str.value + data.characteristics.t.value;

    data.carryingCapacity = {
      carry,
      lift: carry * 2,
      push: carry * 4
    };

    const languageCount = Object.keys(data.languages).length;
    if (languageCount > 1) {
      experienceCost += (languageCount - 1) * 150;
    }

    // TODO weaponTrainings can be obtained for free trough soldier-types.
    for (const [key, training] of Object.entries(data.weaponTrainings)) {
      switch (key) {
        case "basic":
          if (training) experienceCost += 150;
          break;
        case "infantry":
        case "vehicle":
        case "melee":
          if (training) experienceCost += 150;
          break;
        case "heavy":
          if (training) experienceCost += 250;
          break;
        case "advanced":
        case "longRange":
        case "explosive":
          if (training) experienceCost += 300;
          break;
      }
    }

    const factionTrainingsCount = Object.values(data.factionTrainings).filter(Boolean).length;
    console.log("factionTrainingsCount:", factionTrainingsCount);

    if (factionTrainingsCount > 1) {
      const factionTrainingsCost = (factionTrainingsCount - 1) * 300;
      console.log("factionTrainingsCost:", factionTrainingsCost);

      experienceCost += factionTrainingsCost;
    }

    data.experienceUnspent = data.experience - experienceCost;
    data.experienceSpent = experienceCost;
  }
}
