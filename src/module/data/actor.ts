/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 10/09/2021
 */
import { CharacterDataSource } from "./character";
import { NpcDataSource } from "./npc";

export type ActorDataSource = CharacterDataSource | NpcDataSource;
