import { Button } from "@/components/ui/button";
import useActiveGameState from "@/lib/hooks/useActiveGameState";
import { GameStateEnum, Player } from "@/schema";
import { Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import React from "react";

export default function Ranking({ space }: { space: Space }) {
  const players = useQuery(space, Filter.schema(Player));
  const activeGameState = useActiveGameState();

  const restart = () => {
    // loop over racers, and set number to 0, for first place increment totalWins by 1
    const winner = players.reduce((acc, p) => {
      if (p.number > acc.number) {
        return p;
      }
      return acc;
    }, players[0]);
    players.map((p) => {
      p.number = 0;
      if (p.playerId === winner.playerId) {
        p.totalWins += 1;
      }
    });

    if (activeGameState) {
      activeGameState.state = GameStateEnum.LOBBY;
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-bold">Leaderboard</h2>

      {players
        .toSorted((a, b) => b.number - a.number)
        .map((p, index) => {
          return (
            <div key={p.playerId} className={`text-[2rem]`}>
              {p.playerName}: {p.number}, with total wins:{" "}
              {p.totalWins + (index == 0 ? 1 : 0)}
            </div>
          );
        })}
      <Button onClick={restart}>Back to lobby</Button>
    </div>
  );
}
