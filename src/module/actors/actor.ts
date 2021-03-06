/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { MythicCombatant } from '../combat/mythicCombat';
import { BaseCharacter, Characteristic } from '../data/actor';
import { MythicCharacterData, Lifestyle } from '../data/character';
import { NpcData } from '../data/npc';
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

    console.log('preparing actor', this);

    if (this.data.type === 'character')
      this._prepareCharacterData(this.data.data);
    if (this.data.type === 'npc') this._prepareNpcData(this.data.data);
  }

  prepareBaseData() {
    super.prepareBaseData();
    console.log('prepareBaseData', this);
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    console.log('prepareDerivedData', this);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data: MythicCharacterData): void {
    console.log('_prepareCharacterData', data);

    // Split Items
    data.soldierType = this.items.find((e) => e.type === 'soldierType');
    data.weapons = this.items.filter((e) => e.type === 'weapon');
    data.items = this.items.filter((e) => e.type === 'item');

    let experienceCost = data.soldierType?.data.data.expCost ?? 0;
    Object.entries(data.experienceSummary).forEach(
      (value) => (experienceCost += value[1].cost)
    );

    const experienceSummary: {
      name: string;
      cost: number;
      readonly: boolean;
    }[] = [];
    if (data.soldierType) {
      experienceSummary.push({
        name: `SoldierType: ${data.soldierType.name}`,
        cost: data.soldierType.data.data.expCost,
        readonly: true,
      });
    }

    const characteristicExperienceCost: { [key: string]: number } = {
      '0': 0,
      '1': 200,
      '2': 400,
      '3': 800,
      '4': 1200,
      '5': 1600,
    };

    const upbringing = upbringings.find(
      (value) => value.name === data.infos.upbringing
    );
    const environment = environments.find(
      (value) => value.name === data.infos.environment
    );

    const getLifestyleData = (index: 0 | 1 | 2): Lifestyle => {
      const lifestyle = data.infos.lifestyle[index];
      const lifestyleDefinition = lifestyles.find(
        (value) => value.name === lifestyle.name
      );
      const outcome = lifestyleDefinition?.outcomes.find(
        (value) =>
          value.min >= lifestyle.result && lifestyle.result <= value.max
      );
      const special = outcome
        ? outcome.special.map((value, i) => ({
            ...value,
            ...lifestyle.special[i],
          }))
        : [];

      return {
        ...lifestyle,
        ...lifestyleDefinition,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

      let soldierTypeCharacteristicValue = 0;
      let soldierTypeCharacteristicAdvancement = 0;
      if (data.soldierType) {
        console.log('data.soldierType', data.soldierType.data.data);
        soldierTypeCharacteristicValue =
          data.soldierType.data.data.characteristics[key].value;
        soldierTypeCharacteristicAdvancement =
          data.soldierType.data.data.characteristics[key].advancement;
      }

      const advancement =
        (characteristic.advancement || 0) +
        soldierTypeCharacteristicAdvancement;

      characteristic.value =
        bonus +
        soldierTypeCharacteristicValue +
        (characteristic.rawValue || 0) +
        advancement * 5;

      characteristic.mod = Math.floor(characteristic.value / 10);

      experienceCost +=
        characteristicExperienceCost[characteristic.advancement];

      if (key == 'ag') {
        const mod = characteristic.mod + data.mythicCharacteristics.ag.value;
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

    const carry =
      data.characteristics.str.value +
      data.characteristics.t.value +
      (data.mythicCharacteristics.str.value +
        data.mythicCharacteristics.t.value) *
        10;

    data.carryingCapacity = {
      carry,
      lift: carry * 2,
      push: carry * 4,
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

      if (skill.characteristic) {
        const characteristic = Array.isArray(skill.characteristic)
          ? skill.characteristic[0]
          : skill.characteristic;

        const bonus =
          skill.advancement > 0
            ? (skill.advancement - 1) * 10
            : skill.adv
            ? -40
            : -20;
        const value =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (data.characteristics[characteristic] as Characteristic).value +
          bonus;
        console.log('skill:', key, value, bonus);
        skill.value = value;
      }
    }

    const languageCount = Object.keys(data.languages).length;
    if (languageCount > 1) {
      experienceCost += (languageCount - 1) * 150;
    }

    for (const [key, training] of Object.entries(data.weaponTrainings)) {
      const includedInSoldierType =
        data.soldierType?.data.data.trainings.includes(key) ?? false;

      if (includedInSoldierType) {
        data.weaponTrainings[key] = true;
        continue;
      }

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

    // TODO apply faction training based on faction, this cased issues when changing factions
    // if (data.infos.faction) {
    //   data.factionTrainings[data.infos.faction] = true;
    // }

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
    data.autoExperienceSummary = experienceSummary;

    console.log('finish _prepareCharacterData', data);
  }

  _prepareNpcData(data: NpcData): void {
    console.log('data', data);
    for (const [key, characteristic] of Object.entries(data.characteristics)) {
      const bonus = 0;

      characteristic.value =
        bonus +
        (characteristic.rawValue || 0) +
        (characteristic.advancement || 0) * 5;
      characteristic.mod = Math.floor(characteristic.value / 10);
    }
  }

  async takeDamage(
    damage: number,
    hitLocation: HitLocation,
    pierce = 0
  ): Promise<void> {
    const data = this.data.data as BaseCharacter;
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
        console.error('invalid hit location.');
        break;
    }

    // TODO add shield rules (Page 99)
    if (data.shields.value > 0) {
      await this.update({
        'data.shields.value': data.shields.value - damage,
      });
      return;
    }

    // damage resistance = armor at location + toughness modifier
    const damageResistance =
      armor + data.characteristics.t.mod + data.mythicCharacteristics.t.value;

    const remainingDamageResistance = Math.clamped(
      damageResistance - pierce,
      0,
      damageResistance > 0 ? damageResistance : 0
    );

    const wounds = Math.clamped(damage - remainingDamageResistance, 0, damage);
    const currentWounds = data.wounds.value - wounds;

    console.log(
      'dealing amount of damage',
      damageResistance,
      remainingDamageResistance,
      damage,
      hitLocation,
      pierce,
      wounds
    );

    // TODO according to the rules, a character is only unconscious when hitting 0 hp and only dies after receiving
    //      their max hp in damage again, so maxWounds * 2
    if (currentWounds <= 0) {
      // await ChatMessage.create({
      //   speaker: ChatMessage.getSpeaker({ actor: this }),
      //   sound: CONFIG.sounds.dice,
      //   type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      //   content: 'Character reached wound maximum!',
      // });

      if (game instanceof Game && this.id) {
        const combatant = game.combat?.combatants.find(
          (c) => c.data.actorId === this.id
        ) as MythicCombatant;
        console.log('marking combatant as defeated', combatant);
        await combatant?.update({
          defeated: true,
        });
      }
      // TODO implement character death.
    }
    await this.update({
      'data.wounds.value': currentWounds,
    });
  }
}
