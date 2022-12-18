import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { render } from "react-dom";
import { Provider as AlertProvider } from "react-alert";
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
import { TRPCProvider } from "./hooks/api/trpc";

import "./global.scss";
import { TagList } from "./views/Site/TagList";
import { Theming } from "./Theme";
import { Account } from "./views/Panel/Account";
import { Users } from "./views/Panel/UserList";
import { Notification } from "./components/Notification";

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
      <Route path={panelRoutes.account.path} element={<Account />} />

      <Route path={panelRoutes.pages.path} element={<Pages />} />
      <Route path={panelRoutes.pageCreate.path} element={<PageCreate />} />
      <Route path={panelRoutes.page.path} element={<PageEdit />} />

      <Route path={panelRoutes.tags.path} element={<Tags />} />
      <Route path={panelRoutes.tag.path} element={<TagEdit />} />

      <Route path={panelRoutes.users.path} element={<Users />} />
    </Routes>
  );
};

export const App: React.FC = () => (
  <AlertProvider
    template={Notification}
    containerStyle={{
      pointerEvents: "unset",
      zIndex: 2,
      padding: "calc(var(--spacing) * 2) calc(var(--spacing) * 3)",
    }}
    position="top right"
    timeout={5000}
  >
    <RecoilRoot>
      <TRPCProvider>
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
      </TRPCProvider>
    </RecoilRoot>
  </AlertProvider>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
