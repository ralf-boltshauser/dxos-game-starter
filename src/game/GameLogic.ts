import { GameState, GameStateEnum, Player } from "@/schema";
import { create, Space } from "@dxos/client/echo";

export class GameLogic {
  space: Space;
  minPlayers = 1;

  constructor(space: Space) {
    this.space = space;
  }

  async startGame({
    hasHost,
    creatorId,
  }: {
    hasHost: boolean;
    creatorId: string;
  }) {
    // check if game state already exists by spaceId
    const gameStates = await this.space.db
      .query({
        type: GameState.Type,
        spaceId: this.space.id,
      })
      .run();

    if (gameStates.results.length > 0) {
      return;
    }
    const gameState = create(GameState, {
      spaceId: this.space.id,
      state: GameStateEnum.LOBBY,
      hasHost,
      creatorId,
      createdAt: Date.now(),
    });

    this.space.db.add(gameState);
  }

  checkWin({ player, gameState }: { player: Player; gameState: GameState }) {
    if (player.number >= 10) {
      gameState.state = GameStateEnum.FINISHED;
    }
  }

  async joinPlayer({
    playerName,
    playerId,
  }: {
    playerName: string;
    playerId: string;
  }) {
    // check if player already exists by playerId
    const players = await this.space.db
      .query({
        type: Player.Type,
        playerId,
      })
      .run();

    if (players.results.length > 0) {
      return;
    }

    this.space.db.add(
      create(Player, {
        playerName,
        playerId,
        ready: false,
        number: 0,
        totalWins: 0,
      })
    );
  }

  removePlayer(player: Player) {
    this.space.db.remove(player);
  }
}
