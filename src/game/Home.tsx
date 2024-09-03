import { useClient, useShell } from "@dxos/react-client";
import { useSpace } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { GameLogic } from "./GameLogic";
export default function Lobby() {
  const space = useSpace();
  const gameLogic = new GameLogic();
  const navigate = useNavigate();
  const identity = useIdentity();
  const client = useClient();
  const shell = useShell();

  return (
    <div>
      <h2>Home</h2>
      <h2>Rooms you have access to:</h2>
      <div className="flex flex-col gap-2">
        {client.spaces.get().map((space) => (
          <div key={space.id} className="flex flex-row gap-4 items-center">
            <h3>{space.id.substring(0, 5)}...</h3>
            <Button
              onClick={() => {
                // gameLogic.startGame({
                //   hasHost: false,
                //   creatorId: identity.identityKey.toString(),
                // });
                // gameLogic.joinPlayer({
                //   playerId: identity.identityKey.toString(),
                //   playerName: identity.profile?.displayName || "Player",
                // });

                navigate(`/game/${space.id}`);
              }}
            >
              Join
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
        ))}
      </div>
      <h2>Or</h2>
      {space && (
        <div className="flex flex-row gap-4 items-center">
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
            Start your own game!
          </Button>
          {/* <Button
            onClick={async () => {
              gameLogic.startGame({
                hasHost: true,
                creatorId: identity.identityKey.toString(),
              });
              navigate(`/host/${space.id}`);
            }}
          >
            Start as Host
          </Button> */}
          <Button
            variant="outline"
            onClick={async () => {
              const { space } = await shell.joinSpace({});

              const gameLogic = new GameLogic();

              await gameLogic.joinPlayer({
                playerId: identity.identityKey.toString(),
                playerName: identity.profile?.displayName || "Player",
              });

              navigate(`/game/${space.id}`);
            }}
          >
            Join with code / link
          </Button>
        </div>
      )}
    </div>
  );
}
