import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { render } from "react-dom";
import { Home } from "./views/Home";
import { Page } from "./views/Page";
import { PageEdit } from "./views/PageEdit";

import "./global.scss";

const queryClient = new QueryClient();

export const App: React.FC = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages/:slug" element={<Page />} />
          <Route path="/panel/:slug/edit" element={<PageEdit />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </RecoilRoot>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
