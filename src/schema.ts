import { S, TypedObject } from "@dxos/echo-schema";

export enum GameStateEnum {
  LOBBY = "LOBBY",
  RACING = "RACING",
  FINISHED = "FINISHED",
}

export class GameState extends TypedObject({
  typename: "example.GameState",
  version: "0.1.0",
})({
  state: S.Enums(GameStateEnum),
}) {}

export class Racer extends TypedObject({
  typename: "example.Racer",
  version: "0.1.0",
})({
  playerId: S.String,
  playerName: S.String,
  number: S.Number,
  totalWins: S.Number,
}) {}
