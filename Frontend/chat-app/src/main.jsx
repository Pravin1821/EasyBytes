import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./tailwind.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
