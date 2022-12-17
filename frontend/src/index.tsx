import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { render } from "react-dom";
import { Home } from "./views/Site/Home";
import { Page } from "./views/Site/Page";
import { PageEdit } from "./views/Panel/PageEdit";
import { Pages } from "./views/Panel/PageList";
import { PageCreate } from "./views/Panel/PageCreate";
import { useAuth, useAuthAtom } from "./hooks/auth";
import { PanelHome } from "./views/Panel/PanelHome";
import { Tags } from "./views/Panel/TagList";
import { TagEdit } from "./views/Panel/TagEdit";
import { TagPages } from "./views/Site/TagPages";
import { panelRoutes, siteRoutes } from "./routes";
import { queryClient, TRPCProvider } from "./hooks/api/trpc";

import "./global.scss";
import { TagList } from "./views/Site/TagList";
import { Theming } from "./Theme";

const PanelRoutes: React.FC = () => {
  const { loading } = useAuth();
  const [token] = useAuthAtom();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token && !loading) navigate(siteRoutes.home.to());
  }, [token, loading]);

  return (
    <Routes>
      <Route path={panelRoutes.home.path} element={<PanelHome />} />

      <Route path={panelRoutes.pages.path} element={<Pages />} />
      <Route path={panelRoutes.pageCreate.path} element={<PageCreate />} />
      <Route path={panelRoutes.page.path} element={<PageEdit />} />

      <Route path={panelRoutes.tags.path} element={<Tags />} />
      <Route path={panelRoutes.tag.path} element={<TagEdit />} />
    </Routes>
  );
};

export const App: React.FC = () => (
  <RecoilRoot>
    <TRPCProvider>
      <QueryClientProvider client={queryClient}>
        <Theming>
          <BrowserRouter>
            <Routes>
              <Route path={siteRoutes.home.path} element={<Home />} />
              <Route path={siteRoutes.tag.path} element={<TagPages />} />
              <Route path={siteRoutes.tags.path} element={<TagList />} />
              <Route path={siteRoutes.page.path} element={<Page />} />
              <Route path="/panel/*" element={<PanelRoutes />} />
            </Routes>
          </BrowserRouter>
        </Theming>
      </QueryClientProvider>
    </TRPCProvider>
  </RecoilRoot>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
