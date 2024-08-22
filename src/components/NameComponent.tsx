import useMyPlayer from "@/lib/hooks/useMyPlayer";
import { Player } from "@/schema";
import { Filter, Space } from "@dxos/client/echo";
import { useClient } from "@dxos/react-client";
import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";
import { Input } from "./ui/input";

export default function NameComponent({ space }: { space: Space }) {
  const client = useClient();
  const identity = useIdentity();
  const [name, setName] = React.useState(
    identity.profile?.displayName || "Anonymous"
  );

  const players = useQuery(space, Filter.schema(Player));

  const myPlayer = useMyPlayer();

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      client.halo.updateProfile({ ...identity.profile, displayName: name });
      if (myPlayer) {
        myPlayer.playerName = name;
      }
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [name, client.halo]);
  return (
    <div>
      <Input
        className="max-w-[200px]"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
