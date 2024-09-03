import useActiveGameState from "@/lib/hooks/useActiveGameState";
import useGameSpace from "@/lib/hooks/useGameSpace";
import useMyPlayer from "@/lib/hooks/useMyPlayer";
import { identityToProfile } from "@/lib/hooks/useProfile";
import { Filter } from "@dxos/client/echo";
import { useMembers, useQuery } from "@dxos/react-client/echo";
import { RefreshCwOff } from "lucide-react";
import React from "react";
import { Button } from "../components/ui/button";
import { Player } from "../schema";
import { GameLogic } from "./GameLogic";

export const Game = () => {
  const { space } = useGameSpace();
  const players = useQuery(space, Filter.schema(Player));
  const myPlayer = useMyPlayer();
  const members = useMembers(space.key);

  const activeGameState = useActiveGameState();

  const gameLogic = new GameLogic();

  if (activeGameState) {
    gameLogic.checkWin({ player: myPlayer });
  }

  return (
    <>
      <div className="absolute top-5 right-5 gap-2 flex flex-col justify-end items-end">
        {players.map((player) => {
          const member = members.find(
            (m) => m.identity.identityKey.toString() === player.playerId
          );
          const playerProfile = identityToProfile(member.identity);
          return (
            <li
              key={player.playerId}
              className={`flex flex-row gap-2 justify-start items-center`}
            >
              <span>{player.playerName}</span>
              <span
                className={
                  (member.presence
                    ? `bg-${playerProfile.hue}-200`
                    : `border-${playerProfile.hue}-200 border-2`) +
                  ` w-8 h-8 flex justify-center items-center rounded `
                }
              >
                {member.presence ? playerProfile.emoji : <RefreshCwOff />}
              </span>
            </li>
          );
        })}
      </div>
      <div>
        <h2>Race! </h2>

        {!activeGameState?.hasHost &&
          players.map((p) => {
            return (
              <div key={p.playerId}>
                {p.playerName}: {p.number}
              </div>
            );
          })}
        <Button
          onClick={() => {
            myPlayer.number += 1;
          }}
        >
          +1
        </Button>
      </div>
    </>
  );
};
