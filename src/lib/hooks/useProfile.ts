import { Space } from "@dxos/client/echo";
import { Identity, useIdentity } from "@dxos/react-client/halo";
import { keyToFallback } from "@dxos/util";

const useHaloProfile = () => {
  const identity = useIdentity();
  return identityToProfile(identity);
};

export const identityToProfile = (identity: Identity) => {
  if (!identity || !identity.identityKey) {
    return {
      displayName: "Anonymous",
      emoji: "😀", // Default emoji
      hue: "blue", // Default hue (or another default value)
    };
  }

  const fallback = keyToFallback(identity.identityKey);
  return {
    displayName: identity.profile?.displayName || "Anonymous",
    emoji: identity.profile?.data?.emoji || fallback.emoji,
    hue: identity.profile?.data?.hue || fallback.hue,
  };
};

export const memberFromKeySpace = (key: string, space: Space) => {
  return space.members
    .get()
    .find((m) => m.identity.identityKey.toString() === key);
};

export default useHaloProfile;
