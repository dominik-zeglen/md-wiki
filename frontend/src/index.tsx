import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./views/Home";
import { render } from "react-dom";

import "./global.scss";

export const App: React.FC = () => (
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
