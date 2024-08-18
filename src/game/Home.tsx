import { useClient } from "@dxos/react-client";
import { create, useSpace } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { useNavigate } from "react-router-dom";
import NameComponent from "../components/NameComponent";
import { Button } from "../components/ui/button";
import { GameState, GameStateEnum, Racer } from "../schema";
export default function Lobby() {
  const space = useSpace();
  const navigate = useNavigate();
  const identity = useIdentity();
  const client = useClient();

  return (
    <div>
      <h2>Home</h2>
      <NameComponent space={space} />
      {space && (
        <div>
          {space.id}
          <Button
            onClick={() => {
              const gameState = create(GameState, {
                state: GameStateEnum.LOBBY,
              });
              space?.db.add(gameState);
              space?.db.add(
                create(Racer, {
                  playerId: identity.identityKey.toString(),
                  playerName: identity.profile?.displayName || "Anonymous",
                  number: 0,
                  totalWins: 0,
                })
              );
              navigate(`/space/${space.id}`);
            }}
          >
            Start as Player
          </Button>
          <Button
            onClick={async () => {
              const gameState = create(GameState, {
                state: GameStateEnum.LOBBY,
              });
              space?.db.add(gameState);
              await client.halo.updateProfile({
                displayName: "Host",
              });
              navigate(`/host/${space.id}`);
            }}
          >
            Start as Host
          </Button>
        </div>
      )}
    </div>
  );
}
