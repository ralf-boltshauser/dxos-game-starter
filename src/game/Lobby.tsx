import useActiveGameState from "@/lib/hooks/useActiveGameState";
import useGameSpace from "@/lib/hooks/useGameSpace";
import useIsCreator from "@/lib/hooks/useIsCreator";
import useMyPlayer from "@/lib/hooks/useMyPlayer";
import { Filter, useQuery } from "@dxos/react-client/echo";
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
  const activeGameState = useActiveGameState();
  const players = useQuery(space, Filter.schema(Player));
  const identity = useIdentity();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<null | number>(null);
  const [isCounting, setIsCounting] = useState(false);

  const isCreator = useIsCreator();

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
      startCountdown();
    }
  }, [isCreator, players, activeGameState, isCounting]);

  const startCountdown = () => {
    setCountdown(3); // Reset the count to start from 3
    setIsCounting(true);
  };

  if (!myPlayer && !isHost) {
    return (
      <div>
        <p>It seems you are no longer part of this game!</p>
        <Button onClick={() => navigate("/")}>Home</Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Lobby</h2>
      {countdown != null ? (
        <div>{countdown > 0 ? countdown : "Go!"}</div>
      ) : (
        <>
          {!isHost && <NameComponent space={space} />}
          {isHost && (
            <>
              <h2>Members</h2>
              <ul>
                {players.map((player) => (
                  <li
                    key={player.playerId}
                    className={`flex flex-row gap-2 justify-start items-center ${
                      player.ready ? "text-green-500" : "text-red-600"
                    }`}
                  >
                    <span>{player.playerName}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => gameLogic.removePlayer(player)}
                    >
                      <TrashIcon />
                    </Button>
                  </li>
                ))}
              </ul>{" "}
              <Button onClick={onInviteClick}>Invite</Button>{" "}
            </>
          )}
          {!isCreator &&
            (myPlayer?.ready ? (
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
            ))}
        </>
      )}
    </div>
  );
}
