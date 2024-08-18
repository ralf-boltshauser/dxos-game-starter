import { Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { GameState, GameStateEnum, Racer } from "../schema";

// export type TaskListProps = {
//   tasks?: Task[];
//   onInviteClick?: () => any;
//   onTaskCreate?: (text: string) => any;
//   onTaskRemove?: (task: Task) => any;
//   onTaskTitleChange?: (task: Task, newTitle: string) => any;
//   onTaskCheck?: (task: Task, checked: boolean) => any;
// };

export const Host = ({ space }: { space: Space }) => {
  const identity = useIdentity();
  const racers = useQuery(space, Filter.schema(Racer));
  const myRacer = racers.find(
    (r) => r.playerId == identity.identityKey.toString()
  );

  const gameStates = useQuery(space, Filter.schema(GameState));

  if (myRacer?.number >= 10 && gameStates?.length > 0) {
    gameStates[0].state = GameStateEnum.FINISHED;
  }

  return (
    <div>
      <h2>Host dashboard</h2>
      {racers.map((r) => {
        return (
          <div
            key={r.playerId}
            className="flex flex-row justify-start items-center gap-4"
          >
            <h2> {r.playerName}</h2>
            <div className="flex flex-row gap-2 justify-start items-center">
              {Array.from({ length: r.number }).map((_, i) => {
                return (
                  <span className="w-5 h-5" key={i}>
                    🚗
                  </span>
                );
              })}
              {Array.from({ length: 10 - r.number }).map((_, i) => {
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
