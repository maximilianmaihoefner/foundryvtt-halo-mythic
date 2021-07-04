/**
 * TODO write ngDoc
 *
 * @since 06/13/2021
 */
export class RollDialog extends Dialog {
  static async create(
    templateData: {
      bonus?: number;
    } = {}
  ): Promise<{ bonus: number }> {
    const template = await renderTemplate(
      'systems/mythic/templates/apps/roll-dialog.html',
      templateData
    );

    return new Promise((resolve) => {
      const dialog = new RollDialog({
        title: 'Roll',
        default: 'Roll',
        content: template,
        buttons: {
          roll: {
            label: 'Roll',
            callback: (html) =>
              resolve({
                bonus: Number((html as JQuery).find('#bonus').val()),
              }),
          },
        },
      });
      dialog.render(true);
    });
  }

  private constructor(
    dialogData: Dialog.Data,
    options?: Partial<Dialog.Options>
  ) {
    super(dialogData, options);
  }
}
