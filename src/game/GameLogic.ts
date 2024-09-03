import useActiveGameState from "@/lib/hooks/useActiveGameState";
import useGameSpace from "@/lib/hooks/useGameSpace";
import useMyPlayer from "@/lib/hooks/useMyPlayer";
import { GameState, GameStateEnum, Player } from "@/schema";
import { create, Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";

export class GameLogic {
  space: Space;
  activeGameState: GameState;
  players: Player[] = [];
  myPlayer: Player;
  minPlayers = 1;
  playerDefault = {
    number: 0,
  };

  constructor() {
    const { space } = useGameSpace();
    this.space = space;
    this.activeGameState = useActiveGameState();
    this.players = useQuery(space, Filter.schema(Player));
    this.myPlayer = useMyPlayer();
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

  checkWin({ player }: { player: Player }) {
    if (player.number >= 10) {
      this.activeGameState.state = GameStateEnum.FINISHED;
    }
  }

  resetPlayer(player: Player) {
    // for each property in playerDefault, set to player
    Object.keys(this.playerDefault).forEach((key) => {
      player[key] = this.playerDefault[key];
    });
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
        totalWins: 0,
        ...this.playerDefault,
      })
    );
  }

  removePlayer(player: Player) {
    this.space.db.remove(player);
  }
}
