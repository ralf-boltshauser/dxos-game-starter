import { useClient } from "@dxos/react-client";
import { useSpace } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { GameLogic } from "./GameLogic";
export default function Lobby() {
  const space = useSpace();
  const gameLogic = new GameLogic(space);
  const navigate = useNavigate();
  const identity = useIdentity();
  const client = useClient();

  return (
    <div>
      <h2>Home</h2>
      {space && (
        <div>
          <Button
            onClick={() => {
              gameLogic.startGame({
                hasHost: false,
                creatorId: identity.identityKey.toString(),
              });
              gameLogic.joinPlayer({
                playerId: identity.identityKey.toString(),
                playerName: identity.profile?.displayName || "Player",
              });

              navigate(`/game/${space.id}`);
            }}
          >
            Start as Player
          </Button>
          <Button
            onClick={async () => {
              gameLogic.startGame({
                hasHost: true,
                creatorId: identity.identityKey.toString(),
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
