import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

// This includes css styles from @dxos/react-ui-theme.
// This must precede all other style imports in the app.
import "./index.css";
import Loading from "./Loading";

const App = React.lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>
);
