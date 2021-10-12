/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { BaseCharacter } from "../data/actor";
import { CharacterData, Lifestyle } from "../data/character";
import { NpcData } from "../data/npc";
import { environments } from '../definitions/environments';
import { lifestyles } from '../definitions/lifestyles';
import { upbringings } from '../definitions/upbringings';

export enum HitLocation {
  Head,
  Arms,
  Chest,
  Legs,
}

export class MythicActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData(): void {
    super.prepareData();

    if (this.data.type === 'character')
      this._prepareCharacterData(this.data.data);
    if (this.data.type === 'npc')
      this._prepareNpcData(this.data.data);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data: CharacterData): void {
    console.log('data', data);

    let experienceCost = 0;
    const experienceSummary = [];

    const characteristicExperienceCost: { [key: string]: number } = {
      '0': 0,
      '1': 200,
      '2': 400,
      '3': 800,
      '4': 1200,
      '5': 1600,
    };

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
      if (!skill.characteristic) {
        if (skill.defaultCharacteristics) {
          const value = skill.defaultCharacteristics[0];
          console.error('No characteristic for', key, ', using:', value);
          skill.characteristic = value;
        } else {
          skill.characteristic = 'str';
          console.error('No defaultCharacteristics for', key);
        }
      }
      skill.adv = advSkills.includes(key);
    }

    const upbringing = upbringings.find(
      (value) => value.name === data.infos.upbringing
    );
    const environment = environments.find(
      (value) => value.name === data.infos.environment
    );

    const getLifestyleData = (index: 0|1|2): Lifestyle => {
      const lifestyle = data.infos.lifestyle[index];
      const lifestyleDefinition = lifestyles.find(
        (value) => value.name === lifestyle.name
      );
      const outcome = lifestyleDefinition?.outcomes.find(
        (value) =>
          value.min >= lifestyle.result && lifestyle.result <= value.max
      );
      const special = outcome ? outcome.special.map((value, i) => ({
        ...value,
        ...lifestyle.special[i],
      })) : [];

      return {
        ...lifestyle,
        ...lifestyleDefinition,
        // @ts-ignore
        special: { ...special },
      };
    };

    data.infos.lifestyle = {
      0: getLifestyleData(0),
      1: getLifestyleData(1),
      2: getLifestyleData(2),
    };

    for (const [key, characteristic] of Object.entries(data.characteristics)) {
      let bonus = 0;
      const upbringingSpecial = upbringing?.special.find(
        (value) => value.attribute === key
      );
      const environmentSpecial = environment?.special.find(
        (value) => value.attribute === key
      );
      const lifestyle1Special = Object.values(
        data.infos.lifestyle['0'].special
      ).find((value) => value.attribute === key);
      const lifestyle2Special = Object.values(
        data.infos.lifestyle['1'].special
      ).find((value) => value.attribute === key);
      const lifestyle3Special = Object.values(
        data.infos.lifestyle['2'].special
      ).find((value) => value.attribute === key);
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
        bonus +
        (characteristic.rawValue || 0) +
        (characteristic.advancement || 0) * 5;
      characteristic.mod = Math.floor(characteristic.value / 10);

      experienceCost +=
        characteristicExperienceCost[characteristic.advancement];

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

    const languageCount = Object.keys(data.languages).length;
    if (languageCount > 1) {
      experienceCost += (languageCount - 1) * 150;
    }

    // TODO weaponTrainings can be obtained for free trough soldier-types.
    for (const [key, training] of Object.entries(data.weaponTrainings)) {
      switch (key) {
        case 'basic':
          if (training) experienceCost += 150;
          break;
        case 'infantry':
        case 'vehicle':
        case 'melee':
          if (training) experienceCost += 150;
          break;
        case 'heavy':
          if (training) experienceCost += 250;
          break;
        case 'advanced':
        case 'longRange':
        case 'explosive':
          if (training) experienceCost += 300;
          break;
      }
    }

    const factionTrainingsCount = Object.values(data.factionTrainings).filter(
      Boolean
    ).length;
    console.log('factionTrainingsCount:', factionTrainingsCount);

    if (factionTrainingsCount > 1) {
      const factionTrainingsCost = (factionTrainingsCount - 1) * 300;
      console.log('factionTrainingsCost:', factionTrainingsCost);

      experienceCost += factionTrainingsCost;
    }

    data.experienceUnspent = data.experience - experienceCost;
    data.experienceSpent = experienceCost;
  }

  _prepareNpcData(data: NpcData): void {
    console.log('data', data);
    for (const [key, characteristic] of Object.entries(data.characteristics)) {
      let bonus = 0;

      characteristic.value =
        bonus +
        (characteristic.rawValue || 0) +
        (characteristic.advancement || 0) * 5;
      characteristic.mod = Math.floor(characteristic.value / 10);
    }
  }

  async takeDamage(damage: number, hitLocation: HitLocation, pierce: number = 0): Promise<void> {
    const data = (this.data.data as BaseCharacter);
    let armor = 0;

    switch (hitLocation) {
      case HitLocation.Head:
        armor = data.armor.head;
        break;
      case HitLocation.Arms:
        armor = data.armor.arms;
        break;
      case HitLocation.Chest:
        armor = data.armor.chest;
        break;
      case HitLocation.Legs:
        armor = data.armor.legs;
        break;
      default:
        console.error('invalid hit location.')
        break;
    }

    // damage resistance = armor at location + toughness modifier
    const damageResistance = armor + data.characteristics.t.mod;
    const wounds = damageResistance - pierce - damage;
    const currentWounds = data.wounds.current + wounds;
    console.log('dealing amount of damage', damageResistance, damage, hitLocation, pierce, wounds);

    // TODO implement character death.
    if (currentWounds > 0) {

    }
    await this.update({
      'data.wounds.current': currentWounds,
    });
  }
}
