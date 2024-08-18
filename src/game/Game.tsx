import { Filter, Space } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { Button } from "../components/ui/button";
import { GameState, GameStateEnum, Racer } from "../schema";

// export type TaskListProps = {
//   tasks?: Task[];
//   onInviteClick?: () => any;
//   onTaskCreate?: (text: string) => any;
//   onTaskRemove?: (task: Task) => any;
//   onTaskTitleChange?: (task: Task, newTitle: string) => any;
//   onTaskCheck?: (task: Task, checked: boolean) => any;
// };

export const Game = ({ space }: { space: Space }) => {
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
      <h2>Race! </h2>

      {racers.map((r) => {
        return (
          <div key={r.playerId}>
            {r.playerName}: {r.number}
          </div>
        );
      })}
      <Button
        onClick={() => {
          myRacer.number += 1;
        }}
      >
        +1
      </Button>
    </div>
  );
};
