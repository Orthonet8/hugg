import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider";
import { I18nProvider } from "./i18n/I18nProvider";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => null);
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
