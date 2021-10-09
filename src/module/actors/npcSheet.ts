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
}
