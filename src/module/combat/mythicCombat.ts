/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/11/2021
 */
import { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import { CombatantData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import { MythicActor } from "../actors/actor";

const TURN_HISTORY = 'turnHistory';
const EVADE_COUNT = 'evadeCount';

export class MythicCombat extends Combat {
  async startCombat(): Promise<this | undefined> {
    await this.setFlag('mythic', TURN_HISTORY, []);
    return super.startCombat();
  }

  async nextRound(): Promise<this | undefined> {
    await this._pushHistory(this.combatants.map(c => (c as MythicCombatant).getState()));
    await this._pushHistory('newRound');
    this.combatants.forEach(c => (c as MythicCombatant).setState({ [EVADE_COUNT]: 0 }));
    return super.nextRound();
  }

  async previousRound(): Promise<this | undefined> {
    const round = Math.max(this.round - 1, 0);

    if (round > 0) {
      const turnHistory = (this.getFlag('mythic', TURN_HISTORY) as []).slice();
      const result = turnHistory.pop();

      let roundState: { id: string; [EVADE_COUNT]: number }[];

      if (Array.isArray(result)) {
        roundState = result;
      } else {
        const index = turnHistory.lastIndexOf('newRound' as never);
        turnHistory.splice(index);
        roundState = turnHistory.pop() as unknown as any[];
      }
      await this.setFlag('mythic', TURN_HISTORY, turnHistory);

      for (let s of roundState) {
        this.combatants.forEach(c => {
          if (c.id === s.id) {
            (c as MythicCombatant).setState({ [EVADE_COUNT]: s[EVADE_COUNT] });
          }
        });
      }
    }

    return super.previousRound();
  }

  async _pushHistory(data: any) {
    const turnHistory = (this.data.flags.mythic.turnHistory ?? []).slice();
    turnHistory.push(data as never);
    return this.setFlag('mythic', TURN_HISTORY, turnHistory);
  }

  async _popHistory() {
    // if (game instanceof Game) {
    //   game.socket?.emit()
    // }
    const turnHistory = this.data.flags.mythic.turnHistory.slice();
    const result = turnHistory.pop();
    await this.setFlag('mythic', TURN_HISTORY, turnHistory);
    return result;
  }

  async evade(combatant: MythicCombatant) {
    await this._pushHistory(combatant.getState());

    return combatant.evade();
  }
}

export class MythicCombatant extends Combatant {
  protected _onCreate(data: CombatantData["_source"], options: DocumentModificationOptions, userId: string) {
    super._onCreate(data, options, userId);
    void this.setFlag('mythic', EVADE_COUNT, 0);
  }

  // TODO add "Battle mind" ability (page 48) (add intellect mod instead of agility mod)
  // TODO add "fast foot" ability (page 48) (roll initiative twice take higher result)
  protected _getInitiativeFormula(): string {
    let formula = '1d10 + @characteristics.ag.mod';
    if ((this.actor as MythicActor)?.data.data.mythicCharacteristics > 0) {
      // TODO round to 1 if smaller 1
      formula += '+ floor(@mythicCharacteristics.ag.value / 2)';
    }
    return formula;
  }

  async evade() {
    const evadeCount = this.data.flags.mythic.evadeCount;

    return this.update({
      [`flags.mythic.${EVADE_COUNT}`]: evadeCount + 1,
    })
  }

  setState(data: { [EVADE_COUNT]: number }) {
    return this.update({
      [`flags.mythic.${EVADE_COUNT}`]: data[EVADE_COUNT],
    })
  }

  getState() {
    return {
      id: this.id,
      [EVADE_COUNT]: this.data.flags.mythic.evadeCount,
    };
  }
}
