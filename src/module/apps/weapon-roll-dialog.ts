/**
 * TODO write ngDoc
 *
 * @since 06/13/2021
 */
export class WeaponRollDialog extends Dialog {
  static async create(templateData: object): Promise<{ characteristic: string; bonus: number }> {
    const template = await renderTemplate(
      'systems/mythic/templates/apps/weapon-roll-dialog.html',
      templateData
    );

    return new Promise((resolve) => {
      const dialog = new WeaponRollDialog({
        content: template,
        buttons: {
          roll: {
            label: 'Roll',
            callback: (html) =>
              resolve({
                characteristic: String((html as JQuery).find('#characteristic').val()),
                bonus: Number((html as JQuery).find('#bonus').val()),
              }),
          },
        },
      });
      dialog.render(true);
    });
  }

  private constructor(dialogData: DialogData, options?: Application.Options) {
    super(dialogData, options);
  }
}
