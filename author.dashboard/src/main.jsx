import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <GoogleOAuthProvider clientId="445772508805-tfd7f74v7lf2mu2vv02d6l4bvnnk7qll.apps.googleusercontent.com">
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
