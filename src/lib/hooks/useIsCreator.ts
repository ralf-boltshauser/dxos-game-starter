import { useIdentity } from "@dxos/react-client/halo";
import useActiveGameState from "./useActiveGameState";
import useGameSpace from "./useGameSpace";

const useIsCreator = (): boolean => {
  const { space } = useGameSpace();
  const activeGameState = useActiveGameState();
  const identity = useIdentity();

  return (
    activeGameState &&
    activeGameState.creatorId === identity.identityKey.toString()
  );
};

export default useIsCreator;
