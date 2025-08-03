import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import "./index.css";

import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner";
import store from "./store/app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="445772508805-tfd7f74v7lf2mu2vv02d6l4bvnnk7qll.apps.googleusercontent.com">
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
