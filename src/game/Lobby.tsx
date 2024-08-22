import useActiveGameState from "@/lib/hooks/useActiveGameState";
import useGameSpace from "@/lib/hooks/useGameSpace";
import useIsCreator from "@/lib/hooks/useIsCreator";
import useMyPlayer from "@/lib/hooks/useMyPlayer";
import useHaloProfile, { identityToProfile } from "@/lib/hooks/useProfile";
import { useClient, useShell } from "@dxos/react-client";
import { Filter, useMembers, useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { TrashIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NameComponent from "../components/NameComponent";
import { Button } from "../components/ui/button";
import { GameStateEnum, Player } from "../schema";
import { GameLogic } from "./GameLogic";

export default function Lobby({
  isHost,
  onInviteClick,
}: {
  isHost: boolean;
  onInviteClick: () => any;
}) {
  const { space } = useGameSpace();
  const client = useClient();
  const members = useMembers(space.key);
  const shell = useShell();
  const identity = useIdentity();
  const activeGameState = useActiveGameState();
  const profile = useHaloProfile();
  const players = useQuery(space, Filter.schema(Player));
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<null | number>(null);
  const [isCounting, setIsCounting] = useState(false);

  const isCreator = useIsCreator();
  let hasHost = false;
  if (activeGameState) {
    hasHost = activeGameState.hasHost;
  }

  const myPlayer = useMyPlayer();

  const gameLogic = new GameLogic(space);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      timer = setTimeout(() => {
        players.forEach((player) => {
          player.ready = false;
        });
        activeGameState.state = GameStateEnum.INPROGRESS;
      }, 1000);
    }

    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (
      isCreator &&
      players &&
      players.every((p) => p.ready) &&
      activeGameState &&
      !isCounting &&
      players?.length >= gameLogic.minPlayers
    ) {
      // Uncomment to add countdown
      // startCountdown();
      if (activeGameState) {
        activeGameState.state = GameStateEnum.INPROGRESS;
        console.log(activeGameState.state);
        players.forEach((player) => {
          player.ready = false;
        });
      }
    }
  }, [isCreator, players, activeGameState, isCounting]);

  const startCountdown = () => {
    if (activeGameState) {
      activeGameState.state = GameStateEnum.COUNTDOWN;
    }
    setCountdown(3); // Reset the count to start from 3
    setIsCounting(true);
  };

  if (!space || !members || !identity) {
    return <p>loading ...</p>;
  }

  if (!myPlayer && !isHost) {
    return (
      <div>
        <p>It seems you are no longer part of this game!</p>
        <Button
          onClick={() =>
            gameLogic.joinPlayer({
              playerName: profile.displayName,
              playerId: identity.identityKey.toString(),
            })
          }
        >
          Rejoin
        </Button>
      </div>
    );
  }

  if (!activeGameState) {
    return <p>loading ...</p>;
  }

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center">
        <h2 className="">Lobby: {space.id.substring(0, 10)}...</h2>
        <div className="bg-customColor text-white">Hello, Tailwind!</div>
        <Button
          onClick={() => client.shell.open()}
          size="icon"
          variant="outline"
          className={`bg-${profile.hue}-200`}
        >
          {profile.emoji}
        </Button>
      </div>
      {countdown != null ? (
        <div>{countdown > 0 ? countdown : "Go!"}</div>
      ) : (
        <>
          {activeGameState.state === GameStateEnum.COUNTDOWN ? (
            <div>Get Ready!</div>
          ) : (
            <>
              {!isHost && <NameComponent space={space} />}
              {(!hasHost || isHost) && (
                <>
                  <h2>Members</h2>
                  <div className="my-3">
                    {players.map((player) => {
                      const playerProfile = identityToProfile(
                        members.find(
                          (m) =>
                            m.identity.identityKey.toString() ===
                            player.playerId
                        ).identity
                      );
                      return (
                        <li
                          key={player.playerId}
                          className={`flex flex-row gap-2 justify-start items-center ${
                            player.ready
                              ? `text-${playerProfile.hue}-800`
                              : "animate-pulse"
                          }`}
                        >
                          <span
                            className={`bg-${playerProfile.hue}-200 w-8 h-8 flex  justify-center items-center rounded`}
                          >
                            {playerProfile.emoji}
                          </span>
                          <span>{player.playerName}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => gameLogic.removePlayer(player)}
                          >
                            <TrashIcon />
                          </Button>
                        </li>
                      );
                    })}
                  </div>{" "}
                  <Button onClick={onInviteClick}>Invite</Button>{" "}
                </>
              )}
              {!isHost && (
                <>
                  {myPlayer?.ready ? (
                    <Button
                      onClick={() => {
                        myPlayer.ready = false;
                      }}
                    >
                      Not Ready!
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        myPlayer.ready = true;
                      }}
                    >
                      Ready!
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <br />
      <Button
        className="mt-5"
        variant="outline"
        onClick={() => {
          navigate("/");
        }}
      >
        Back home
      </Button>
    </div>
  );
}
