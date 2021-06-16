/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { RollDialog } from '../apps/roll-dialog';

export class MythicCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['boilerplate', 'sheet', 'character'],
      template: 'systems/mythic/templates/actor/character-sheet.html',
      width: 715,
      height: 600,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'core' }]
    });
  }

  /** @override */
  getData(): ActorSheet.Data {
    const data = super.getData() as any;
    const actorData = (this.actor.data as any).toObject(false);

    // Redefine the template data references to the actor.
    data.actor = actorData;
    data.data = actorData.data;
    data.rollData = this.actor.getRollData.bind(this.actor);

    const allCharacteristics = [];

    if (data.data.characteristics) {
      for (let [key, characteristic] of Object.entries(data.data.characteristics)) {
        // @ts-ignore
        characteristic.label = game.i18n.localize('mythic.characteristic.' + key);
        // @ts-ignore
        characteristic.labelShort = game.i18n.localize('mythic.characteristic.short.' + key);

        allCharacteristics.push(key);
      }
    }

    if (data.data.skills) {
      for (let [key, skill] of Object.entries(data.data.skills)) {
        // @ts-ignore
        skill.label = game.i18n.localize('mythic.skill.' + key);
        // @ts-ignore
        skill.otherCharacteristics = allCharacteristics.filter(value => !skill.defaultCharacteristics || !skill.defaultCharacteristics.includes(value));

        // @ts-ignore
        if (skill.characteristic) {
          // @ts-ignore
          const a = skill.advancement > 0 ? (skill.advancement - 1) * 10 : skill.adv ? -40 : -20;
          // @ts-ignore
          skill.value = data.data.characteristics[skill.characteristic].value + a;
          // @ts-ignore
          console.log('skill.value', skill.value);
        }
      }
    }

    console.log('getData', data);

    return data;
  }

  protected activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Rollable abilities.
    html.find('.rollable').on('click', this._onRoll.bind(this));

    html.find('.addEducation').on('click', this._addEducation.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').on('click', async event => {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = element.dataset;

      console.log('deleteItem:', dataset);

      const item = this.actor.items.get(dataset.itemId);
      console.log('item:', item);
      await item.delete({});
      // element.slideUp(200, () => this.render(false));
    });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    console.log('dataset', dataset);

    if (dataset.roll) {
      const rollDialog = await RollDialog.create({});
      const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

      console.log('rollData', rollData);
      let roll = new Roll(dataset.roll, rollData);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      await roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
      });
    }
  }

  async _addEducation(event) {
    event.preventDefault();

    const newEducation = {
      name: '',
      characteristic: '',
      mod: 0,
    };

    // @ts-ignore
    if (this.actor.data.data.educations) {
      // @ts-ignore
      this.actor.data.data.educations.push(newEducation);
    } else {
      // @ts-ignore
      this.actor.data.data.educations = [newEducation];
    }
    console.log(this.actor.data.data);
  }
}
