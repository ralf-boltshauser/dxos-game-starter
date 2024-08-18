import { Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import React from "react";
import { Player } from "../schema";

export const Host = ({ space }: { space: Space }) => {
  const players = useQuery(space, Filter.schema(Player));

  console.log(players);

  return (
    <div>
      <h2>Host dashboard</h2>
      {players.map((p) => {
        return (
          <div
            key={p.playerId}
            className="flex flex-row justify-start items-center gap-4"
          >
            <h2> {p.playerName}</h2>
            <div className="flex flex-row gap-2 justify-start items-center">
              {Array.from({ length: p.number }).map((_, i) => {
                return (
                  <span className="w-5 h-5" key={i}>
                    🚗
                  </span>
                );
              })}
              {Array.from({ length: 10 - p.number }).map((_, i) => {
                return (
                  <span className="w-5 h-5" key={i}>
                    🚙
                  </span>
                );
              })}
              <span className="w-5 h-5" key={"target"}>
                🏁
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
