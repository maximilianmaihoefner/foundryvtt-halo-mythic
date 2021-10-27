export const preloadTemplates = async (): Promise<
  Handlebars.TemplateDelegate[]
> => {
  const templatePaths: string[] = [
    'systems/mythic/templates/actor/partials/advancements.hbs',
  ];

  return loadTemplates(templatePaths);
};
