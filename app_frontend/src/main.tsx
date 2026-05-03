import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider";
import { I18nProvider } from "./i18n/I18nProvider";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => null);
    });
  } else {
    window.addEventListener("load", () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => null);
        });
      }).catch(() => null);
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter basename={routerBase}>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
