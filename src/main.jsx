import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContextApi from "./context/ContextApi.jsx";
// Supports weights 100-900
import '@fontsource-variable/roboto-condensed';

createRoot(document.getElementById("root")).render(
    <ContextApi>
      <App />
    </ContextApi>
);
