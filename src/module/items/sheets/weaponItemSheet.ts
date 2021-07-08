/**
 * TODO write ngDoc
 *
 * @since 06/14/2021
 */
export class MythicWeaponItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions(): ItemSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ['mythic', 'sheet', 'item', 'weapon'],
      template: 'systems/mythic/templates/items/weapon.html',
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  getData(
    options?: Application.RenderOptions
  ):
    | Promise<ItemSheet.Data<ItemSheet.Options>>
    | ItemSheet.Data<ItemSheet.Options> {
    const data = super.getData() as any;
    const actorData = this.item.data.toObject(false);

    // Redefine the template data references to the actor.
    data.actor = actorData;
    data.data = actorData.data;
    data.rollData = this.item.getRollData.bind(this.item);
    data.editable = this.isEditable;
    data.showFiring = this.isEditable || data.magazin || data.ammunition || data.reload;
    data.showFiringModes = this.isEditable || Object.keys(data.fireModes ?? {}).length > 0;

    return data;
  }

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    if (!position) {
      return;
    }
    const sheetBody = (this.element as JQuery).find('.sheet-body');
    const bodyHeight = position.height - 192;
    sheetBody.css('height', bodyHeight);
    return position;
  }

  public activateListeners(html: JQuery): void {
    super.activateListeners(html);

    html.find('.add-firing-mode').on('click', this._addFiringMode.bind(this));
    html
      .find('.remove-firing-mode')
      .on('click', this._removeFiringMode.bind(this));
  }

  async _addFiringMode(event: Event): Promise<void> {
    event.preventDefault();

    const newFireMode = {
      mode: '',
      value: 0,
    };

    if (this.item.data.data.fireModes) {
      const { fireModes } = this.item.data.data;
      fireModes.push(newFireMode);

      await this.item.update({
        'data.fireModes': fireModes,
      });
    } else {
      await this.item.update({
        'data.fireModes': [newFireMode],
      });
    }
  }

  async _removeFiringMode(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.item.update({
        'data.fireModes': { [`-=${dataset.key}`]: null },
      });
    }
  }
}
