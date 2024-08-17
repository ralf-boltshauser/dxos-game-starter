onconnect = async (event) => {
  // Worker code must be async imported due to WASM + top-level await breaking the connect.
  // See: https://github.com/Menci/vite-plugin-wasm/issues/37
  const { onconnect } = await import("@dxos/react-client/worker");
  await onconnect(event);
};
