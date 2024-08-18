import useActiveGameState from "@/lib/hooks/useActiveGameState";
import useGameSpace from "@/lib/hooks/useGameSpace";
import useMyPlayer from "@/lib/hooks/useMyPlayer";
import { Filter } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import React from "react";
import { Button } from "../components/ui/button";
import { Player } from "../schema";
import { GameLogic } from "./GameLogic";

export const Game = () => {
  const { space } = useGameSpace();
  const players = useQuery(space, Filter.schema(Player));
  const myPlayer = useMyPlayer();

  const activeGameState = useActiveGameState();

  const gameLogic = new GameLogic(space);

  if (activeGameState) {
    gameLogic.checkWin({ player: myPlayer, gameState: activeGameState });
  }

  return (
    <div>
      <h2>Race! </h2>

      {!activeGameState?.hasHost &&
        players.map((p) => {
          return (
            <div key={p.playerId}>
              {p.playerName}: {p.number}
            </div>
          );
        })}
      <Button
        onClick={() => {
          myPlayer.number += 1;
        }}
      >
        +1
      </Button>
    </div>
  );
};
