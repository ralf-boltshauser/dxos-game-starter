import { Button } from "@/components/ui/button";
import { GameState, GameStateEnum, Racer } from "@/schema";
import { Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import React from "react";

export default function Finished({ space }: { space: Space }) {
  const racers = useQuery(space, Filter.schema(Racer));
  const gameStates = useQuery(space, Filter.schema(GameState));
  const restart = () => {
    // loop over racers, and set number to 0, for first place increment totalWins by 1
    const winner = racers.reduce((acc, r) => {
      if (r.number > acc.number) {
        return r;
      }
      return acc;
    }, racers[0]);
    racers.map((r) => {
      r.number = 0;
      if (r.playerId === winner.playerId) {
        r.totalWins += 1;
      }
    });

    if (gameStates.length > 0) {
      gameStates[0].state = GameStateEnum.LOBBY;
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-bold">Leaderboard</h2>

      {racers
        .toSorted((a, b) => b.number - a.number)
        .map((r, index) => {
          return (
            <div key={r.playerId} className={`text-[2rem]`}>
              {r.playerName}: {r.number}, with total wins:{" "}
              {r.totalWins + (index == 0 ? 1 : 0)}
            </div>
          );
        })}
      <Button onClick={restart}>Restart</Button>
    </div>
  );
}
