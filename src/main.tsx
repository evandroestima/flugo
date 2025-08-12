import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RegisteringProvider } from "./contexts/registeringContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegisteringProvider>
      <App />
    </RegisteringProvider>
  </StrictMode>
);
