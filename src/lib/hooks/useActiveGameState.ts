import { GameState } from "@/schema";
import { useQuery } from "@dxos/react-client/echo";
import useGameSpace from "./useGameSpace";

const useActiveGameState = (): GameState | null => {
  const { space } = useGameSpace();
  const gameStates = useQuery(space, {
    type: GameState.Type,
    spaceId: space.id,
  });

  if (gameStates.length === 1) {
    return gameStates[0];
  } else if (gameStates.length > 1) {
    // Implement logic to determine the active game state if more than one exists.
    // For example, you might choose the latest one based on a timestamp or some other criteria.
    const activeGameState = gameStates.reduce((latest, current) => {
      return new Date(latest.createdAt) > new Date(current.createdAt)
        ? latest
        : current;
    });
    return activeGameState;
  } else {
    // If no game states exist
    return null;
  }
};

export default useActiveGameState;
