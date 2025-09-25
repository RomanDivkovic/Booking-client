import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GroupProvider } from "./contexts/GroupContext.tsx";

createRoot(document.getElementById("root")!).render(
  <GroupProvider>
    <App />
  </GroupProvider>
);
