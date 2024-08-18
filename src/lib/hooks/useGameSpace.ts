import { useSpace } from "@dxos/react-client/echo";
import { useParams } from "react-router-dom";

const useGameSpace = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const space = useSpace(spaceId);

  return { spaceId, space };
};

export default useGameSpace;
