import { Racer } from "@/schema";
import { Filter, Space } from "@dxos/client/echo";
import { useClient } from "@dxos/react-client";
import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React from "react";

export default function NameComponent({ space }: { space: Space }) {
  const client = useClient();
  const identity = useIdentity();
  const [name, setName] = React.useState(
    identity.profile?.displayName || "Anonymous"
  );

  const racers = useQuery(space, Filter.schema(Racer));

  const myRacer = racers.find(
    (racer) => racer.playerId === identity.identityKey.toString()
  );

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      client.halo.updateProfile({ displayName: name });
      if (myRacer) {
        myRacer.playerName = name;
      }
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [name, client.halo]);
  return (
    <div>
      <h2>Your name: {identity.profile?.displayName}</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}
