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
import { create, Filter, useQuery, useSpace } from "@dxos/react-client/echo";

import { useIdentity } from "@dxos/react-client/halo";
import Finished from "./game/Finished";
import { Game } from "./game/Game";
import Home from "./game/Home";
import { Host } from "./game/Host";
import Lobby from "./game/Lobby";
import { GameState, GameStateEnum, Racer } from "./schema";

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
      return (
        <Lobby
          isHost={isHost}
          space={space}
          onInviteClick={async () => {
            if (!space) {
              return;
            }
            void shell.shareSpace({ spaceKey: space?.key });
          }}
        />
      );
    case GameStateEnum.FINISHED:
      return <Finished space={space} />;
    case GameStateEnum.RACING:
      return isHost ? <Host space={space} /> : <Game space={space} />;
    default:
      return <p>empty gamestate</p>;
  }
};
// export const TaskListContainer = () => {
//   const { spaceKey } = useParams<{ spaceKey: string }>();

//   const space = useSpace(spaceKey);
//   const tasks = useQuery<Task>(space, Filter.schema(Task));
//   const shell = useShell();

//   return (
//     <TaskList
//       tasks={tasks}
//       onInviteClick={async () => {
//         if (!space) {
//           return;
//         }
//         void shell.shareSpace({ spaceKey: space?.key });
//       }}
//       onTaskCreate={(newTaskTitle) => {
//         const task = create(Task, { title: newTaskTitle, completed: false });
//         space?.db.add(task);
//       }}
//       onTaskRemove={(task) => {
//         space?.db.remove(task);
//       }}
//       onTaskTitleChange={(task, newTitle) => {
//         task.title = newTitle;
//       }}
//       onTaskCheck={(task, checked) => {
//         task.completed = checked;
//       }}
//     />
//   );
// };

export const HomeContainer = () => {
  // const space = useSpace();
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
        if (space) {
          space.db.add(
            create(Racer, {
              playerId: identity.identityKey.toString(),
              playerName: "Anonymous",
              number: 0,
              totalWins: 0,
            })
          );
          navigate(`/space/${space.id}`);
        }
      })();
    }
  }, [invitationCode, deviceInvitationCode]);

  return <Home />;
};

const router = createBrowserRouter([
  {
    path: "/space/:spaceId",
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
        client.addTypes([GameState, Racer]);
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
      <div className="dark">
        <RouterProvider router={router} />
      </div>
    </ClientProvider>
  );
};
