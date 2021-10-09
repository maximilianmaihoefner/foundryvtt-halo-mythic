/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { RollDialog } from '../apps/roll-dialog';
import { WeaponRollDialog } from '../apps/weapon-roll-dialog';
import { Characteristic, Skill } from '../data/character';
import { environments } from '../definitions/environments';
import { lifestyles } from '../definitions/lifestyles';
import { upbringings } from '../definitions/upbringings';

export class MythicCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['mythic', 'sheet', 'character'],
      template: 'systems/mythic/templates/actor/character-sheet.html',
      width: 715,
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
    const actorData = this.actor.data.toObject(false);
    console.log('sheet data', data);
    console.log('sheet actorData', actorData);

    // Redefine the template data references to the actor.
    data.actor = actorData;
    data.data = actorData.data;
    data.rollData = this.actor.getRollData.bind(this.actor);

    console.log('actor', data);

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
        Skill & { label: string; otherCharacteristics: string[]; value: number }
      >(data.data.skills)) {
        if (game instanceof Game) {
          skill.label = game.i18n.localize(`mythic.skill.${key}`);
        }
        skill.otherCharacteristics = allCharacteristics.filter(
          (value) =>
            !skill.defaultCharacteristics ||
            !skill.defaultCharacteristics.includes(value)
        );

        if (skill.characteristic) {
          const characteristic = Array.isArray(skill.characteristic) ? skill.characteristic[0] : skill.characteristic;

          const bonus =
            skill.advancement > 0
              ? (skill.advancement - 1) * 10
              : skill.adv
              ? -40
              : -20;
          skill.value =
            data.data.characteristics[characteristic].value + bonus;
        }
      }
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

      const roll = new Roll(dataset.roll, rollData);
      const label = dataset.label ? `Rolling ${dataset.label}` : '';
      await roll.roll().toMessage({
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

    if (game instanceof Game) {
      console.log('dataset', dataset, game.user?.targets);
    }

    const rollDialog = await WeaponRollDialog.create({
      characteristic: dataset.characteristic,
    });

    if (dataset.itemId) {
      const item = this.actor.items.get(dataset.itemId);
      await item?.update({
        characteristic: rollDialog.characteristic,
      });
    }

    const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

    const roll = new Roll(
      `floor((@characteristics.${rollDialog.characteristic}.value + @bonus - 1d100) / 10)`,
      rollData
    );
    const label = dataset.label ? `Rolling ${dataset.label}` : '';
    await roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
    });
  }

  async _addEducation(event: Event): Promise<void> {
    event.preventDefault();

    const newEducation = {
      name: '',
      characteristic: '',
      advancement: 0,
    };

    if (this.actor.data.data.educations) {
      const educations = Object.values(this.actor.data.data.educations);
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

    if (this.actor.data.data.equipment) {
      const equipments = Object.values(this.actor.data.data.equipment);
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

    if (this.actor.data.data.languages) {
      const languages = Object.values(this.actor.data.data.languages);
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

    if (this.actor.data.data.abilities) {
      const abilities = Object.values(this.actor.data.data.abilities);
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
}
