import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "./components/ui/provider";
import "./index.css"; // Adjust the path as necessary
// import store from "./redux/store";

import App from "./App";
import ThemeProvider from "./lib/theme-provider";

// Ensure the root element exists in your index.html
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter >
      <ThemeProvider defaultTheme="system" storageKey="eduminds-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
