/**
 * TODO write ngDoc
 *
 * @since 06/14/2021
 */
export class MythicWeaponItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
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

  /** @override */
  getData() {
    const data = super.getData();
    // const itemData = this.item.data.toObject(false);

    // Redefine the template data references to the actor.
    // data.item = itemData;
    // data.data = itemData.data;

    console.log('item data', data);

    return data;
  }

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
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

    // @ts-ignore
    if (this.item.data.data.fireModes) {
      // @ts-ignore
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
