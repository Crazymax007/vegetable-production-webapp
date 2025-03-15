import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App.jsx";
import { WindowSizeProvider } from "./contexts/WindowSizeContext";

createRoot(document.getElementById("root")).render(
  // <App />
  <WindowSizeProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </WindowSizeProvider>
);
