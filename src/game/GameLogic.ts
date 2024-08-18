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
    const gameState = create(GameState, {
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
