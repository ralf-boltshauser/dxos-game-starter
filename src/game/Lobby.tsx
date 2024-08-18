import { Filter, Space, useQuery } from "@dxos/react-client/echo";
import React from "react";
import NameComponent from "../components/NameComponent";
import { Button } from "../components/ui/button";
import { GameState, GameStateEnum, Racer } from "../schema";
export default function Lobby({
  space,
  isHost,
  onInviteClick,
}: {
  space: Space;
  isHost: boolean;
  onInviteClick: () => any;
}) {
  const gameState = useQuery(space, Filter.schema(GameState));
  const racers = useQuery(space, Filter.schema(Racer));

  return (
    <div>
      <h2>Lobby</h2>
      {!isHost && <NameComponent space={space} />}
      <Button onClick={onInviteClick}>Invite</Button>
      <h2>Members</h2>
      <ul>
        {racers.map((racer) => (
          <li key={racer.playerId}>{racer.playerName}</li>
        ))}
      </ul>
      <Button
        onClick={() => {
          if (gameState.length > 0) {
            gameState[0].state = GameStateEnum.RACING;
          }
        }}
      >
        Start Game
      </Button>
    </div>
  );
}
