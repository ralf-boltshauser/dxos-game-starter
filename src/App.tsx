import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  ClientProvider,
  Config,
  Defaults,
  Local,
  useShell,
} from "@dxos/react-client";
import { Filter, useQuery, useSpace } from "@dxos/react-client/echo";

import { useIdentity } from "@dxos/react-client/halo";
import { Game } from "./game/Game";
import { GameLogic } from "./game/GameLogic";
import Home from "./game/Home";
import { Host } from "./game/Host";
import Lobby from "./game/Lobby";
import Ranking from "./game/Ranking";
import { GameState, GameStateEnum, Player } from "./schema";

const config = async () => new Config(Local(), Defaults());

export const GameContainer = ({ isHost }: { isHost: boolean }) => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const space = useSpace(spaceId);
  const gameState = useQuery<GameState>(space, Filter.schema(GameState));
  const shell = useShell();

  if (gameState.length == 0) {
    return <Home />;
  }

  switch (gameState[0].state) {
    case GameStateEnum.LOBBY:
    case GameStateEnum.COUNTDOWN:
      return (
        <Lobby
          isHost={isHost}
          onInviteClick={async () => {
            if (!space) {
              return;
            }
            void shell.shareSpace({ spaceKey: space?.key });
          }}
        />
      );
    case GameStateEnum.INPROGRESS:
      return isHost ? <Host space={space} /> : <Game />;
    case GameStateEnum.FINISHED:
      return <Ranking space={space} />;
    default:
      return <p>Something went wrong</p>;
  }
};

export const HomeContainer = () => {
  const shell = useShell();
  const [search, setSearchParams] = useSearchParams();
  const invitationCode = search.get("spaceInvitationCode");
  const deviceInvitationCode = search.get("deviceInvitationCode");
  const navigate = useNavigate();
  const identity = useIdentity();

  useEffect(() => {
    if (deviceInvitationCode) {
      setSearchParams((p) => {
        p.delete("deviceInvitationCode");
        return p;
      });
    } else if (invitationCode) {
      setSearchParams((p) => {
        p.delete("spaceInvitationCode");
        return p;
      });
      void (async () => {
        const { space } = await shell.joinSpace({ invitationCode });
        const gameLogic = new GameLogic(space);
        if (space) {
          gameLogic.joinPlayer({
            playerId: identity.identityKey.toString(),
            playerName: identity.profile?.displayName || "Anonymous",
          });
          navigate(`/game/${space.id}`);
        }
      })();
    }
  }, [invitationCode, deviceInvitationCode]);

  return <Home />;
};

const router = createBrowserRouter([
  {
    path: "/game/:spaceId",
    element: <GameContainer isHost={false} />,
  },
  {
    path: "/host/:spaceId",
    element: <GameContainer isHost={true} />,
  },
  {
    path: "/",
    element: <HomeContainer />,
  },
]);

export const App = () => {
  return (
    <ClientProvider
      config={config}
      shell="./shell.html"
      onInitialized={async (client) => {
        client.addTypes([GameState, Player]);
        const searchParams = new URLSearchParams(location.search);
        if (
          !client.halo.identity.get() &&
          !searchParams.has("deviceInvitationCode")
        ) {
          await client.halo.createIdentity({
            displayName: "Anonymous",
          });
        }
      }}
    >
      <div className="m-5">
        <RouterProvider router={router} />
      </div>
    </ClientProvider>
  );
};
