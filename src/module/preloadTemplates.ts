export const preloadTemplates = async (): Promise<void> => {
  const templatePaths: string[] = [
    // Add paths to "systems/mythic/templates"
  ];

  return loadTemplates(templatePaths);
};
