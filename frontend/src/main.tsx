import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TRPCProvider } from "./providers/TRPCProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </React.StrictMode>
);
