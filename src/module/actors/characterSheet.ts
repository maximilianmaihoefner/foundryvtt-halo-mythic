/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
// import { duplicate } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { RollDialog } from '../apps/roll-dialog';
import { WeaponRollDialog } from '../apps/weapon-roll-dialog';
import { Characteristic } from '../data/actor';
import { MythicCharacterData, Skill } from '../data/character';
import { environments } from '../definitions/environments';
import { lifestyles } from '../definitions/lifestyles';
import { upbringings } from '../definitions/upbringings';
import tippy from 'tippy.js';

const flipInt = (n: number) => {
  let digit,
    result = 0;

  while (n) {
    digit = n % 10; //  Get right-most digit. Ex. 123/10 → 12.3 → 3
    result = result * 10 + digit; //  Ex. 123 → 1230 + 4 → 1234
    n = (n / 10) | 0; //  Remove right-most digit. Ex. 123 → 12.3 → 12
  }

  return result;
};

export class MythicCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions(): ActorSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ['mythic', 'sheet', 'character'],
      template: 'systems/mythic/templates/actor/character-sheet.hbs',
      width: 770,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'core',
        },
      ],
    });
  }

  /** @override */
  getData() {
    const data = super.getData() as any;
    const actorData = data.actor.data;
    data.data = actorData.data;
    data.flags = actorData.flags;
    data.rollData = data.actor.getRollData();
    data.data.locked = false;

    console.log('sheet data', data);

    data.data.upbringings = upbringings;

    const upbringing = upbringings.find(
      (value) => value.name === data.data.infos.upbringing
    );
    data.data.environments = environments.map((value) => ({
      ...value,
      disabled:
        upbringing &&
        upbringing.environments.length > 0 &&
        !upbringing.environments.includes(value.name),
    }));

    data.data.lifestyles = lifestyles;

    console.log('data.data.infos.lifestyle:', data.data.infos.lifestyle);
    console.log('data.data.abilities', data.data.abilities);

    const allCharacteristics = [];

    if (data.data.characteristics) {
      for (const [key, characteristic] of Object.entries<
        Characteristic & { label: string; labelShort: string }
      >(data.data.characteristics)) {
        if (game instanceof Game) {
          characteristic.label = game.i18n.localize(
            `mythic.characteristic.${key}`
          );
          characteristic.labelShort = game.i18n.localize(
            `mythic.characteristic.short.${key}`
          );
        }

        allCharacteristics.push(key);
      }
    }

    if (data.data.skills) {
      for (const [key, skill] of Object.entries<
        Skill & { label: string; otherCharacteristics: string[] }
      >(data.data.skills)) {
        if (game instanceof Game) {
          skill.label = game.i18n.localize(`mythic.skill.${key}`);
        }
        skill.otherCharacteristics = allCharacteristics.filter(
          (value) =>
            !skill.defaultCharacteristics ||
            !skill.defaultCharacteristics.includes(value)
        );
      }
    }

    if (data.data.weaponTrainings) {
      console.log(
        'weaponTrainings before: ',
        data.data.weaponTrainings,
        data.data.weaponTrainings2
      );
      data.data.weaponTrainings2 = Object.entries(data.data.weaponTrainings)
        // .filter((entry) => typeof entry[0] === 'string' && !isNumeric(entry[0]))
        .map(([key, value]) => {
          if (!(game instanceof Game)) {
            return;
          }
          return {
            key,
            value,
            title: game.i18n.localize(`mythic.weaponTraining.${key}.title`),
            examples: game.i18n.localize(
              `mythic.weaponTraining.${key}.examples`
            ),
          };
        });
      console.log(
        'weaponTrainings after: ',
        data.data.weaponTrainings,
        data.data.weaponTrainings2
      );
    }

    if (data.data.factionTrainings) {
      console.log(
        'factionTrainings before: ',
        data.data.weaponTrainings,
        data.data.weaponTrainings2
      );
      data.data.factionTrainings2 = Object.entries(data.data.factionTrainings)
        // .filter((entry) => typeof entry[0] === 'string' && !isNumeric(entry[0]))
        .map(([key, value]) => {
          if (!(game instanceof Game)) {
            return;
          }
          return {
            key,
            value,
            title: game.i18n.localize(`mythic.factionTraining.${key}.title`),
          };
        });
      console.log(
        'factionTrainings after: ',
        data.data.weaponTrainings,
        data.data.weaponTrainings2
      );
    }

    return data;
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Rollable abilities.
    html.find('.rollable').on('click', this._onRoll.bind(this));
    html.find('.weapon-hit').on('click', this._rollHit.bind(this));

    html.find('.addEducation').on('click', this._addEducation.bind(this));
    html
      .find('.remove-education')
      .on('click', this._removeEducation.bind(this));
    html.find('.add-equipment').on('click', this._addEquipment.bind(this));
    html
      .find('.remove-equipment')
      .on('click', this._removeEquipment.bind(this));
    html.find('.addLanguage').on('click', this._addLanguage.bind(this));
    html.find('.remove-language').on('click', this._removeLanguage.bind(this));

    html.find('.add-ability').on('click', this._addAbility.bind(this));
    html.find('.remove-ability').on('click', this._removeAbility.bind(this));

    html.find('.add-exp-expense').on('click', this._addExpExpense.bind(this));
    html
      .find('.remove-exp-expense')
      .on('click', this._removeExpExpense.bind(this));

    // Delete Inventory Item
    html
      .find('.item-delete')
      .on(
        'click',
        async (
          event: JQuery.ClickEvent<
            HTMLElement,
            undefined,
            HTMLElement,
            HTMLElement
          >
        ) => {
          event.preventDefault();
          const element = event.currentTarget;
          const { dataset } = element;

          console.log('deleteItem:', dataset);

          const itemId = dataset.itemId;
          if (!itemId) {
            return;
          }
          const item = this.actor.items.get(itemId);
          if (!item) {
            return;
          }
          console.log('item:', item);
          await item.delete({});
          // element.slideUp(200, () => this.render(false));
        }
      );

    html
      .find('.open-solider-types')
      .on(
        'click',
        async (
          event: JQuery.ClickEvent<
            HTMLElement,
            undefined,
            HTMLElement,
            HTMLElement
          >
        ) => {
          if (game instanceof Game) {
            console.log('showing solider types');
            const soldierTypes = game.packs.get('mythic.humanSoldierTypes');
            soldierTypes?.render(true);
          }
        }
      );

    tippy('.characteristic-header', {
      placement: 'right',
      followCursor: true,
      allowHTML: true,
    });
  }

  protected async _onDropItemCreate(
    itemData: ItemData['_source'][] | ItemData['_source']
  ): Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]> {
    const itemsData = Array.isArray(itemData) ? itemData : [itemData];

    for (const item of itemsData) {
      if (item.type === 'soldierType') {
        const soldierType = this.actor.items.find(
          (e) => e.type === 'soldierType'
        );
        if (soldierType) {
          await soldierType.delete();
          ui.notifications?.error(
            'Only one Soldier-Type is allowed per Character'
          );

          // itemsData.findSplice((value) => value === item);
        }
      }
    }

    return super._onDropItemCreate(itemsData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event The originating click event
   * @private
   */
  async _onRoll(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();
    const element = event.currentTarget;
    const { dataset } = element;

    console.log('dataset', dataset);

    if (dataset.roll) {
      const rollDialog = await RollDialog.create();
      const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

      const label = dataset.label ? `Rolling ${dataset.label}` : '';
      const roll = new Roll(dataset.roll, rollData, { async: true });
      const rollResult = await roll.roll();
      await rollResult.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
      });
    }
  }

  async _rollHit(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ) {
    event.preventDefault();
    const element = event.currentTarget;
    const { dataset } = element;

    console.log('dataset', dataset);

    if (!dataset.itemId) {
      console.error('ItemId is missing in dataset', dataset);
      return;
    }

    const rollDialog = await WeaponRollDialog.create({
      characteristic: dataset.characteristic,
    });

    const weaponItem = this.actor.items.get(dataset.itemId);
    console.log('actor items', this.actor.items);
    await weaponItem?.update({
      characteristic: rollDialog.characteristic,
    });

    const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

    // If the roll is equal to or less than the modified characteristic, the attack hits
    const hitRoll = new Roll(
      `1d100 - @bonus`,
      // `1d100 < (@characteristics.${rollDialog.characteristic}.value + @bonus)`,
      rollData,
      { async: true }
    );
    const hitResult = await hitRoll.roll();

    const chosenWarfareCharacteristic =
      this.actor.data.data.characteristics[rollDialog.characteristic].value;
    const success =
      hitResult.total && hitResult.total <= chosenWarfareCharacteristic;
    console.log(
      'total:',
      hitResult.total,
      'result',
      hitResult.result,
      'dice',
      hitResult.dice
    );
    const label = dataset.label ? `Rolling ${dataset.label}` : '';

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      roll: JSON.stringify(hitResult.toJSON()),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      content: await renderTemplate('systems/mythic/templates/chat/hit.hbs', {
        characteristicValue: chosenWarfareCharacteristic,
        success,
        total: hitResult.total,
        tooltip: await hitResult.getTooltip(),
      }),
    });

    if (!hitResult.total || hitResult.total > chosenWarfareCharacteristic) {
      console.log('To-Hit Test failed.');
      return;
    }

    // If the player has a target selected, we roll its evasion.
    // TODO GM may choose other roll, see page 70, STEP THREE: OPPONENT OPPOSES THE ATTACK
    if (game instanceof Game && game.user?.targets) {
      for (const target of game.user.targets) {
        if (!target.actor) {
          continue;
        }

        let hitLocation = 0;
        if (hitResult.total) {
          const total = hitResult.total;
          if (total < 10) {
            hitLocation = total * 10;
          } else {
            hitLocation = flipInt(total);
          }
        }

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: target.actor }),
          sound: CONFIG.sounds.notification,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate(
            'systems/mythic/templates/chat/opponent-hit-action.hbs',
            {
              actorId: target.id,
              attackerId: this.actor.id,
              evasionValue: (target.actor.data.data as MythicCharacterData)
                .skills.evasion.value,
              hitLocation: hitLocation,
              itemId: weaponItem?.id,
            }
          ),
        });
      }
    }
  }

  async _addEducation(event: Event): Promise<void> {
    event.preventDefault();

    const newEducation = {
      name: '',
      characteristic: '',
      advancement: 0,
    };

    if ((this.actor.data.data as MythicCharacterData).educations) {
      const educations = Object.values(
        (this.actor.data.data as MythicCharacterData).educations
      );
      educations.push(newEducation);

      await this.actor.update({
        'data.educations': { ...educations },
      });
    } else {
      await this.actor.update({
        'data.educations': { 0: newEducation },
      });
    }
  }

  async _removeEducation(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        'data.educations': { [`-=${dataset.key}`]: null },
      });
    }
  }

  async _addEquipment(event: Event): Promise<void> {
    event.preventDefault();

    const newEquipment = {
      name: '',
      amount: 0,
      cost: 0,
      weight: 0,
    };

    if ((this.actor.data.data as MythicCharacterData).equipment) {
      const equipments = Object.values(
        (this.actor.data.data as MythicCharacterData).equipment
      );
      equipments.push(newEquipment);

      await this.actor.update({
        'data.equipment': { ...equipments },
      });
    } else {
      await this.actor.update({
        'data.equipment': { 0: newEquipment },
      });
    }
  }

  async _removeEquipment(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        'data.equipment': { [`-=${dataset.key}`]: null },
      });
    }
  }

  async _addLanguage(event: Event): Promise<void> {
    event.preventDefault();

    if ((this.actor.data.data as MythicCharacterData).languages) {
      const languages = Object.values(
        (this.actor.data.data as MythicCharacterData).languages
      );
      languages.push('');

      await this.actor.update({
        'data.languages': { ...languages },
      });
    } else {
      await this.actor.update({
        'data.languages': { 0: '' },
      });
    }
  }

  async _removeLanguage(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        'data.languages': { [`-=${dataset.key}`]: null },
      });
    }
  }

  async _addAbility(event: Event): Promise<void> {
    event.preventDefault();

    console.log('_addAbility');

    const newAbility = {
      name: '',
      description: '',
    };

    if ((this.actor.data.data as MythicCharacterData).abilities) {
      const abilities = Object.values(
        (this.actor.data.data as MythicCharacterData).abilities
      );
      abilities.push(newAbility);

      await this.actor.update({
        'data.abilities': { ...abilities },
      });
    } else {
      await this.actor.update({
        'data.abilities': { 0: newAbility },
      });
    }
  }

  async _removeAbility(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        'data.abilities': { [`-=${dataset.key}`]: null },
      });
    }
  }

  async _addExpExpense(event: Event): Promise<void> {
    event.preventDefault();

    console.log('_addAbility');

    const newExpense = {
      name: '',
      cost: 0,
    };

    if ((this.actor.data.data as MythicCharacterData).experienceSummary) {
      const expenses = Object.values(
        (this.actor.data.data as MythicCharacterData).experienceSummary
      );
      expenses.push(newExpense);

      await this.actor.update({
        'data.experienceSummary': { ...expenses },
      });
    } else {
      await this.actor.update({
        'data.experienceSummary': { 0: newExpense },
      });
    }
  }

  async _removeExpExpense(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        'data.experienceSummary': { [`-=${dataset.key}`]: null },
      });
    }
  }
}
