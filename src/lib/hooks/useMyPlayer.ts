import { Player } from "@/schema";
import { Filter } from "@dxos/client/echo";
import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import useGameSpace from "./useGameSpace";

const useMyPlayer = (): Player | undefined => {
  const { space } = useGameSpace();
  const players = useQuery(space, Filter.schema(Player));
  const identity = useIdentity();

  const myPlayer = players.find(
    (player) => player.playerId === identity.identityKey.toString()
  );

  return myPlayer;
};

export default useMyPlayer;
