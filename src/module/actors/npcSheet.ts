/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 08/14/2021
 */
export class MythicNpcSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['mythic', 'sheet', 'npc'],
      template: 'systems/mythic/templates/actor/npc-sheet.html',
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

    // Redefine the template data references to the actor.
    data.actor = actorData;
    data.data = actorData.data;
    data.rollData = this.actor.getRollData.bind(this.actor);

    console.log('actor', data);

    return data;
  }
}
