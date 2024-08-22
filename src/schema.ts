import { S, TypedObject } from "@dxos/echo-schema";

export enum GameStateEnum {
  LOBBY = "LOBBY",
  COUNTDOWN = "COUNTDOWN",
  INPROGRESS = "INPROGRESS",
  FINISHED = "FINISHED",
}

export class GameState extends TypedObject({
  typename: "example.GameState",
  version: "0.1.0",
})({
  spaceId: S.String,
  state: S.Enums(GameStateEnum),
  hasHost: S.Boolean,
  creatorId: S.String,
  createdAt: S.Number,
}) {}

export class Player extends TypedObject({
  typename: "example.Player",
  version: "0.1.0",
})({
  playerId: S.String,
  playerName: S.String,
  ready: S.Boolean,
  number: S.Number,
  totalWins: S.Number,
}) {}
