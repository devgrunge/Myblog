import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TRPCProvider } from "./providers/TRPCProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TRPCProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TRPCProvider>
  </React.StrictMode>
);
