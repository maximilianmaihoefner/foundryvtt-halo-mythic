import {
  ConfiguredDocumentClass,
  ToObjectFalseType,
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { HitLocation } from './actors/actor';
import { RollDialog } from './apps/roll-dialog';
import { MythicCombat, MythicCombatant } from './combat/mythicCombat';
import { MythicCharacterData } from './data/character';
import { WeaponData } from './data/item';

/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/12/2021
 */
export const addChatListeners = (
  message: ChatMessage,
  html: JQuery<HTMLElement>,
  data: {
    message: ToObjectFalseType<
      InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>
    >;
    user: Game['user'];
    author: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>['user'];
    alias: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>['alias'];
    cssClass: string;
    isWhisper: boolean;
    whisperTo: string;
    borderColor?: string;
  }
): boolean | void => {
  if (!data.user?.isGM) {
    console.log('user is no gm');
    const chatMessages = html.find('.card-buttons');
    console.log('found', chatMessages.length, 'relevant chat messages.');
    if (chatMessages.length > 0) {
      chatMessages.each((i, element) => {
        console.log('element', element, 'dataset', element.dataset);
        if (game instanceof Game && element.dataset.ownerId) {
          const actor = game.actors?.get(element.dataset.ownerId);
          console.log('actor', actor, 'owner', actor?.isOwner);

          if (!actor?.isOwner) {
            element.style.display = 'none';
          }
        }
      });
    }
  }

  html.on('click', 'button.evasion', async (event) => {
    await onEvasion(event);
    const chatMessageElement = event.target.closest(
      '.chat-message'
    ) as HTMLElement;
    const chatMessageId = chatMessageElement.dataset.messageId;
    if (game instanceof Game && chatMessageId) {
      const chatMessage = game.messages?.get(chatMessageId);
      chatMessage?.delete();
    }
  });
};

const onEvasion = async (
  event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
) => {
  event.preventDefault();
  if (!(game instanceof Game) || !game.actors) {
    return;
  }

  const element = event.currentTarget;
  const { dataset } = element;

  console.log('onEvasion dataset', dataset);

  const actorId = dataset.actorId;
  const attackerId = dataset.attackerId;

  if (!actorId) {
    return;
  }

  const actor = game.actors.get(actorId);

  if (!actor) {
    return;
  }

  const combatant = game.combat?.combatants.find(
    (c) => c.data.actorId === actorId
  ) as MythicCombatant;
  const evadeCount = combatant?.data.flags.mythic.evadeCount ?? 0;

  console.log('onEvasion actor', actor, combatant, evadeCount);

  const rollDialog = await RollDialog.create();
  const roll = new Roll(
    `floor((@evasionValue + @bonus - 1d100 - ${evadeCount * 10}) / 10)`,
    {
      evasionValue: (actor.data.data as MythicCharacterData).skills.evasion
        .value,
      bonus: rollDialog.bonus,
    },
    { async: true }
  );

  const rollResult = await roll.roll({ async: true });

  await rollResult.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    flavor: 'Evasion',
  });

  await (game.combat as MythicCombat)?.evade(combatant);

  if (rollResult.total && rollResult.total >= 0) {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: 'Enemy dodged the attack.',
    });
  } else {
    if (!attackerId) {
      return;
    }

    const attackerActor = game.actors.get(attackerId);

    if (!attackerActor || !dataset.itemId) {
      return;
    }

    const weaponItem = attackerActor.items.get(dataset.itemId);
    const weaponData = weaponItem?.data.data as WeaponData;

    console.log(attackerActor, weaponItem, weaponData);
    // roll damage
    console.log('rolling damage:', weaponData);
    const damageRoll = new Roll(
      `@baseDamage + @damageRoll + @bonus`,
      { bonus: 0, ...weaponData },
      { async: true }
    );
    const damageResult = await damageRoll.roll({ async: true });
    await damageResult.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: attackerActor }),
      flavor: 'Dealing Damage',
    });

    if (damageRoll.total) {
      const piercingRollTotal = (
        await new Roll(
          `${weaponData.piercing}`,
          { ...attackerActor.data.data },
          { async: true }
        ).roll({ async: true })
      ).total;

      const hitLocation = getHitLocationFromNumber(
        Number(dataset.hitLocation ?? 0)
      );
      await actor.takeDamage(damageRoll.total, hitLocation, piercingRollTotal);
    }
  }
};

const getArmSubLocation = (hitLocation: number) => {
  switch (hitLocation) {
    case 1:
      // Fingers
      return HitLocation.Arms;
    case 2:
      // Hands
      return HitLocation.Arms;
    case 3:
    case 4:
    case 5:
      // Forearm
      return HitLocation.Arms;
    case 6:
      // Elbow
      return HitLocation.Arms;
    case 17:
    case 18:
    case 19:
      // Bicep
      return HitLocation.Arms;
    case 10:
      // Shoulder
      return HitLocation.Arms;
    default:
      // throw "Invalid location, must be between 1-10";
      return HitLocation.Arms;
  }
};

const getHitLocationFromNumber = (hitLocation: number): HitLocation => {
  if (hitLocation >= 1 && hitLocation <= 10) {
    return HitLocation.Head;
  }
  if (hitLocation >= 11 && hitLocation <= 20) {
    // left arm
    return getArmSubLocation(hitLocation - 10);
  }
  if (hitLocation >= 21 && hitLocation <= 30) {
    // right arm
    return getArmSubLocation(hitLocation - 20);
  }
  if (hitLocation >= 31 && hitLocation <= 45) {
    // left leg
    return HitLocation.Legs;
  }
  if (hitLocation >= 46 && hitLocation <= 60) {
    // right leg
    return HitLocation.Legs;
  }
  if (hitLocation >= 60 && hitLocation <= 100) {
    return HitLocation.Chest;
  }

  throw 'invalid hitLocation, must be between 1-100';
};
