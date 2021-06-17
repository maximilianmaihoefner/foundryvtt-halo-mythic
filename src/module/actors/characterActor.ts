/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
export class MythicCharacterActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(data);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data) {
    console.log('data', data);

    if (!data.characteristics) {
      data.characteristics = {
        "str": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "t": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "ag": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "wfr": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "wfm": {
          "rawValue": 0,
          advancement: 0,
          "min": 0
        },
        "int": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "per": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "cr": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "ch": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        },
        "ld": {
          "rawValue": 0,
          "advancement": 0,
          "min": 0
        }
      }
    }

    if (!data.mythicCharacteristics) {
      data.mythicCharacteristics = {
        str: {
          value: 0
        },
        t: {
          value: 0
        },
        ag: {
          value: 0
        }
      };
    }

    if (!data.skills) {
      data.skills = {
        appeal: {
          advancement: 0,
        },
        athletics: {
          advancement: 0,
        },
        camouflage: {
          advancement: 0,
        },
        command: {
          advancement: 0,
        },
        cryptography: {
          advancement: 0,
        },
        deception: {
          advancement: 0,
        },
        demolition: {
          advancement: 0,
        },
        evasion: {
          advancement: 0,
        },
        gambling: {
          advancement: 0,
        },
        interrogation: {
          advancement: 0,
        },
        intimidation: {
          advancement: 0,
        },
        investigation: {
          advancement: 0,
        },
        medicationHuman: {
          advancement: 0,
        },
        medicationCovenant: {
          advancement: 0,
        },
        medicationMgalekgolo: {
          advancement: 0,
        },
        navigationGroundAir: {
          advancement: 0,
        },
        navigationSpace: {
          advancement: 0,
        },
        navigationSlipspace: {
          advancement: 0,
        },
        negotiation: {
          advancement: 0,
        },
        pilotGround: {
          advancement: 0,
        },
        pilotAir: {
          advancement: 0,
        },
        pilotSpace: {
          advancement: 0,
        },
        security: {
          advancement: 0,
        },
        stunting: {
          advancement: 0,
        },
        survival: {
          advancement: 0,
        },
        technologyHuman: {
          advancement: 0,
        },
        technologyCovenant: {
          advancement: 0,
        },
        technologyForerunner: {
          advancement: 0,
        }
      };
    }

    const advSkills = ['cryptography', 'demolition', 'medicationHuman', 'medicationCovenant', 'medicationMgalekgolo', 'security', 'technologyHuman', 'technologyCovenant', 'technologyForerunner'];

    for (let [key, skill] of Object.entries(data.skills)) {
      switch (key) {
        case 'appeal':
        case 'deception':
        case 'negotiation':
          // @ts-ignore
          skill.defaultCharacteristics = ['ch'];
          break;
        case 'athletics':
          // @ts-ignore
          skill.defaultCharacteristics = ['ag', 'str'];
          break;
        case 'camouflage':
        case 'investigation':
        case 'navigationGroundAir':
        case 'navigationSpace':
        case 'navigationSlipspace':
        case 'survival':
          // @ts-ignore
          skill.defaultCharacteristics = ['int', 'per'];
          break;
        case 'command':
          // @ts-ignore
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
          // @ts-ignore
          skill.defaultCharacteristics = ['int'];
          break;
        case 'evasion':
        case 'stunting':
          // @ts-ignore
          skill.defaultCharacteristics = ['ag'];
          break;
        case 'gambling':
          // @ts-ignore
          skill.defaultCharacteristics = ['int', 'ch'];
          break;
        case 'interrogation':
          // @ts-ignore
          skill.defaultCharacteristics = ['ch', 'ld', 'int'];
          break;
        case 'pilotGround':
        case 'pilotAir':
        case 'pilotSpace':
          // @ts-ignore
          skill.defaultCharacteristics = ['ag', 'int'];
          break;
        case 'intimidation':
          // @ts-ignore
          skill.defaultCharacteristics = ['str', 'ch', 'ld', 'int'];
          break;
      }
      // @ts-ignore
      if (skill.defaultCharacteristics) {
         // @ts-ignore
        skill.characteristic = skill.defaultCharacteristics[0];
      } else {
         // @ts-ignore
        skill.characteristic = 'str';
        console.error('No defaultCharacteristics for', key);
      }
      // @ts-ignore
      skill.adv = advSkills.includes(key);
    }

    for (let [key, characteristic] of Object.entries(data.characteristics)) {
      // Calculate the modifier using d20 rules.
      // @ts-ignore
      characteristic.value = (characteristic.rawValue || 0) + (characteristic.advancement || 0) * 5;
      // @ts-ignore
      characteristic.mod = Math.floor((characteristic.value) / 10);

      if (key == 'ag') {
        // @ts-ignore
        const mod = characteristic.mod;
        data.movement = {
          half: mod > 0 ? mod * 1 : 0.5,
          full: mod > 0 ? mod * 2 : 1,
          charge: mod > 0 ? mod * 3 : 2,
          run: mod > 0 ? mod * 6 : 3,
          sprint: mod * 8,
        };
      }
    }

    const carry = data.characteristics['str'].value + data.characteristics['t'].value;

    data.carryingCapacity = {
      carry: carry,
      lift: carry * 2,
      push: carry * 4,
    }
  }

  // async update(data: object, options?: object): Promise<Entity> {
  //   console.log('calling character update:', data,  options);
  //
  //   // Need a _id
  //   // @ts-ignore
  //   if (!data._id) {
  //     data["_id"] = this.id;
  //   }
  //
  //   // Context informations (needed for unlinked token update)
  //   // options.parent = this.parent;
  //   // options.pack = this.pack;
  //
  //   // Only on linked Actor
  //   // if (data.token?.actorLink || (data.token?.actorLink === undefined && this.data.token.actorLink)) {
  //   //   // Update the token name/image if the sheet name/image changed, but only if they was previously the same
  //   //   ["name", "img"].forEach((fieldName) => {
  //   //     if (
  //   //       data[fieldName] &&
  //   //       this.data[fieldName] === this.data.token[fieldName] &&
  //   //       this.data[fieldName] !== data[fieldName]
  //   //     ) {
  //   //       data["token." + fieldName] = data[fieldName];
  //   //     }
  //   //   });
  //   // }
  //
  //   // if (data['data.languages']) {
  //   //   console.log('update languages...')
  //   //   // @ts-ignore
  //   //   data.languages = data['data.languages'];
  //   //   return this;
  //   // }
  //
  //   // Now using updateDocuments
  //   data = data instanceof Array ? data : [data];
  //   // @ts-ignore
  //   return Actor.updateDocuments(data, options);
  //
  //   // return super.update(data, options);
  // }
}
