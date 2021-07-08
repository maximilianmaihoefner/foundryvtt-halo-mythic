export const preloadTemplates = async (): Promise<Handlebars.TemplateDelegate[]> => {
  const templatePaths: string[] = [
    // Add paths to "systems/mythic/templates"
  ];

  return loadTemplates(templatePaths);
};
