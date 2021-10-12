/**
 * TODO write ngDoc
 *
 * @since 06/12/2021
 */
import { RollDialog } from "../apps/roll-dialog";
import { WeaponRollDialog } from "../apps/weapon-roll-dialog";
import { MythicCombat, MythicCombatant } from "../combat/mythicCombat";
import { Characteristic } from "../data/actor";
import { Skill } from "../data/character";
import { WeaponData } from "../data/item";
import { environments } from "../definitions/environments";
import { lifestyles } from "../definitions/lifestyles";
import { upbringings } from "../definitions/upbringings";
import { HitLocation } from "./actor";

const getArmSubLocation = (location: number) => {
  switch (location) {
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

  throw "invalid hitLocation, must be between 1-100";
};

const flipInt = (n: number) => {
  let digit, result = 0;

  while (n) {
    digit = n % 10;  //  Get right-most digit. Ex. 123/10 → 12.3 → 3
    result = (result * 10) + digit;  //  Ex. 123 → 1230 + 4 → 1234
    n = n / 10 | 0;  //  Remove right-most digit. Ex. 123 → 12.3 → 12
  }

  return result;
};

export class MythicCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic", "sheet", "character"],
      template: "systems/mythic/templates/actor/character-sheet.html",
      width: 715,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "core"
        }
      ]
    });
  }

  /** @override */
  getData() {
    const data = super.getData() as any;
    const actorData = this.actor.data.toObject(false);
    console.log("sheet data", data);
    console.log("sheet actorData", actorData);

    // Redefine the template data references to the actor.
    data.actor = actorData;
    data.data = actorData.data;
    data.rollData = this.actor.getRollData.bind(this.actor);

    console.log("actor", data);

    data.data.upbringings = upbringings;

    const upbringing = upbringings.find(
      (value) => value.name === data.data.infos.upbringing
    );
    data.data.environments = environments.map((value) => ({
      ...value,
      disabled:
        upbringing &&
        upbringing.environments.length > 0 &&
        !upbringing.environments.includes(value.name)
    }));

    data.data.lifestyles = lifestyles;

    console.log("data.data.infos.lifestyle:", data.data.infos.lifestyle);
    console.log("data.data.abilities", data.data.abilities);

    const allCharacteristics = [];

    if (data.data.characteristics) {
      for (const [key, characteristic] of Object.entries<Characteristic & { label: string; labelShort: string }>(data.data.characteristics)) {
        if (game instanceof Game) {
          characteristic.label = game.i18n.localize(
            `mythic.characteristic.${key}`
          );
          characteristic.labelShort = game.i18n.localize(
            `mythic.characteristic.short.${key}`
          );
        }

        allCharacteristics.push(key);
      }
    }

    if (data.data.skills) {
      for (const [key, skill] of Object.entries<Skill & { label: string; otherCharacteristics: string[]; value: number }>(data.data.skills)) {
        if (game instanceof Game) {
          skill.label = game.i18n.localize(`mythic.skill.${key}`);
        }
        skill.otherCharacteristics = allCharacteristics.filter(
          (value) =>
            !skill.defaultCharacteristics ||
            !skill.defaultCharacteristics.includes(value)
        );

        if (skill.characteristic) {
          const characteristic = Array.isArray(skill.characteristic) ? skill.characteristic[0] : skill.characteristic;

          const bonus =
            skill.advancement > 0
              ? (skill.advancement - 1) * 10
              : skill.adv
                ? -40
                : -20;
          skill.value =
            data.data.characteristics[characteristic].value + bonus;
        }
      }
    }

    return data;
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Rollable abilities.
    html.find(".rollable").on("click", this._onRoll.bind(this));
    html.find(".weapon-hit").on("click", this._rollHit.bind(this));

    html.find(".addEducation").on("click", this._addEducation.bind(this));
    html
      .find(".remove-education")
      .on("click", this._removeEducation.bind(this));
    html.find(".add-equipment").on("click", this._addEquipment.bind(this));
    html
      .find(".remove-equipment")
      .on("click", this._removeEquipment.bind(this));
    html.find(".addLanguage").on("click", this._addLanguage.bind(this));
    html.find(".remove-language").on("click", this._removeLanguage.bind(this));

    html.find(".add-ability").on("click", this._addAbility.bind(this));
    html.find(".remove-ability").on("click", this._removeAbility.bind(this));

    // Delete Inventory Item
    html
      .find(".item-delete")
      .on(
        "click",
        async (
          event: JQuery.ClickEvent<HTMLElement,
            undefined,
            HTMLElement,
            HTMLElement>
        ) => {
          event.preventDefault();
          const element = event.currentTarget;
          const { dataset } = element;

          console.log("deleteItem:", dataset);

          const itemId = dataset.itemId;
          if (!itemId) {
            return;
          }
          const item = this.actor.items.get(itemId);
          if (!item) {
            return;
          }
          console.log("item:", item);
          await item.delete({});
          // element.slideUp(200, () => this.render(false));
        }
      );
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event The originating click event
   * @private
   */
  async _onRoll(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();
    const element = event.currentTarget;
    const { dataset } = element;

    console.log("dataset", dataset);

    if (dataset.roll) {
      const rollDialog = await RollDialog.create();
      const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

      const roll = new Roll(dataset.roll, rollData);
      const label = dataset.label ? `Rolling ${dataset.label}` : "";
      await roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  async _rollHit(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ) {
    event.preventDefault();
    const element = event.currentTarget;
    const { dataset } = element;

    console.log("dataset", dataset);

    if (!dataset.itemId) {
      console.error("ItemId is missing in dataset", dataset);
      return;
    }

    const rollDialog = await WeaponRollDialog.create({
      characteristic: dataset.characteristic
    });

    const weaponItem = this.actor.items.get(dataset.itemId);
    const weaponData = weaponItem?.data.data as WeaponData;
    await weaponItem?.update({
      characteristic: rollDialog.characteristic
    });

    const rollData = { ...this.getData().data, bonus: rollDialog.bonus };

    // If the roll is equal to or less than the modified characteristic, the attack hits
    const roll = new Roll(
      `1d100`,
      // `1d100 < (@characteristics.${rollDialog.characteristic}.value + @bonus)`,
      rollData,
      { async: true }
    );
    const hitResult = await roll.roll({ async: true });

    console.log("total:", hitResult.total, "result", hitResult.result);
    const label = dataset.label ? `Rolling ${dataset.label}` : "";
    await hitResult.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label
      // create: false
    });

    // If the player has a target selected, we roll its evasion.
    // TODO GM may choose other roll, see page 70, STEP THREE: OPPONENT OPPOSES THE ATTACK
    if (game instanceof Game && game.user?.targets) {
      for (let target of game.user?.targets) {
        if (!target.actor) {
          continue;
        }


        console.log("game.combat?.combatant.data", game.combat?.combatant.getFlag("mythic", "attackCount"));

        const combatant = game.combat?.combatants.find(c => c.data.actorId === target.actor?.id) as MythicCombatant;
        console.log("combatant", combatant);

        const evadeCount = combatant?.getFlag("mythic", "evadeCount") as number ?? 0;

        const actorData = target.actor.data;
        console.log("target actor:", actorData);
        const roll = new Roll(
          `floor((@skills.evasion.value + @bonus - 1d100 - ${evadeCount * 10}) / 10)`,
          { bonus: 0, ...actorData.data },
          { async: true }
        );
        const evasionResult = await roll.roll({ async: true });
        await evasionResult.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: target.actor }),
          flavor: "Enemy Evasion"
        });

        await (game.combat as MythicCombat).evade(combatant);

        if (evasionResult.total && evasionResult.total >= 0) {
          await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: target.actor }),
            sound: CONFIG.sounds.dice,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            // content: await renderTemplate('', {}),
            content: "Enemy dodged the attack."
          });
        } else {
          // roll damage
          console.log("rolling damage:", weaponData);
          const damageRoll = new Roll(
            `@baseDamage + @damageRoll + @bonus`,
            { bonus: 0, ...weaponData },
            { async: true }
          );
          const damageResult = await damageRoll.roll({ async: true });
          await damageResult.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: "Dealing Damage"
          });

          if (damageRoll.total) {
            const piercingRollTotal = (await new Roll(
              weaponData.piercing,
              { ...this.actor.data.data },
              { async: true }
            ).roll({ async: true })).total;

            let location = 0;
            if (hitResult.total) {
              const total = hitResult.total;
              if (total < 10) {
                location = total * 10;
              } else {
                location = flipInt(total);
              }
            }
            const hitLocation = getHitLocationFromNumber(location);
            await target.actor.takeDamage(damageRoll.total, hitLocation, piercingRollTotal);
          }
        }
      }
    }
  }

  async _addEducation(event: Event): Promise<void> {
    event.preventDefault();

    const newEducation = {
      name: "",
      characteristic: "",
      advancement: 0
    };

    if (this.actor.data.data.educations) {
      const educations = Object.values(this.actor.data.data.educations);
      educations.push(newEducation);

      await this.actor.update({
        "data.educations": { ...educations }
      });
    } else {
      await this.actor.update({
        "data.educations": { 0: newEducation }
      });
    }
  }

  async _removeEducation(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        "data.educations": { [`-=${dataset.key}`]: null }
      });
    }
  }

  async _addEquipment(event: Event): Promise<void> {
    event.preventDefault();

    const newEquipment = {
      name: "",
      amount: 0,
      cost: 0,
      weight: 0
    };

    if (this.actor.data.data.equipment) {
      const equipments = Object.values(this.actor.data.data.equipment);
      equipments.push(newEquipment);

      await this.actor.update({
        "data.equipment": { ...equipments }
      });
    } else {
      await this.actor.update({
        "data.equipment": { 0: newEquipment }
      });
    }
  }

  async _removeEquipment(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        "data.equipment": { [`-=${dataset.key}`]: null }
      });
    }
  }

  async _addLanguage(event: Event): Promise<void> {
    event.preventDefault();

    if (this.actor.data.data.languages) {
      const languages = Object.values(this.actor.data.data.languages);
      languages.push("");

      await this.actor.update({
        "data.languages": { ...languages }
      });
    } else {
      await this.actor.update({
        "data.languages": { 0: "" }
      });
    }
  }

  async _removeLanguage(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        "data.languages": { [`-=${dataset.key}`]: null }
      });
    }
  }

  async _addAbility(event: Event): Promise<void> {
    event.preventDefault();

    console.log("_addAbility");

    const newAbility = {
      name: "",
      description: ""
    };

    if (this.actor.data.data.abilities) {
      const abilities = Object.values(this.actor.data.data.abilities);
      abilities.push(newAbility);

      await this.actor.update({
        "data.abilities": { ...abilities }
      });
    } else {
      await this.actor.update({
        "data.abilities": { 0: newAbility }
      });
    }
  }

  async _removeAbility(
    event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    const element = event.currentTarget;
    const { dataset } = element;

    if (dataset.key) {
      await this.actor.update({
        "data.abilities": { [`-=${dataset.key}`]: null }
      });
    }
  }
}
