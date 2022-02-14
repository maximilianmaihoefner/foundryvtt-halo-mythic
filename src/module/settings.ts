import { MODULE_ID, MythicSettings } from '../consts';

export const registerSettings = (): void => {
  if (!(game instanceof Game)) {
    return;
  }

  game.settings.register(MODULE_ID, MythicSettings.autoEvasion, {
    name: 'Auto Evasion',
    default: true,
    type: Boolean,
    scope: 'world',
    config: true,
    // TODO describe auto-evasion setting.
    hint: 'TODO',
  });

  game.settings.register(MODULE_ID, MythicSettings.autoDamage, {
    name: 'Auto Damage',
    default: true,
    type: Boolean,
    scope: 'world',
    config: true,
    // TODO describe auto-damage setting.
    hint: 'TODO',
  });

  // const autoEvasion = game.settings.get('mythic', 'auto-evasion');
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ClientSettings {
    interface Values {
      'mythic.auto-evasion': boolean;
      'mythic.auto-damage': boolean;
    }
  }
}
