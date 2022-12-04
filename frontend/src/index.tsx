import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { render } from "react-dom";
import { Home } from "./views/Home";
import { Page } from "./views/Page";
import { PageEdit } from "./views/PageEdit";

import "./global.scss";
import { Pages } from "./views/PageList";
import { PageCreate } from "./views/PageCreate";
import { useCognito } from "./hooks/auth";
import { PageLoading } from "./pages/PageLoading";
import { PanelHome } from "./views/PanelHome";
import { Tags } from "./views/TagList";
import { TagEdit } from "./views/TagEdit";
import { TagPages } from "./views/TagPages";
import { panelRoutes, siteRoutes } from "./routes";
import { client, TRPCProvider } from "./hooks/api/trpc";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

const PanelRoutes: React.FC = () => {
  const { user, loading } = useCognito();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user && !loading) navigate(siteRoutes.home.to());
  }, [user, loading]);

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

const AuthGuard: React.FC = ({ children }) => {
  const { user, loading } = useCognito();

  if (!user && loading) {
    return <PageLoading />;
  }

  return children as any;
};

export const App: React.FC = () => (
  <RecoilRoot>
    <AuthGuard>
      <TRPCProvider queryClient={queryClient} client={client}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path={siteRoutes.home.path} element={<Home />} />
              <Route path={siteRoutes.tag.path} element={<TagPages />} />
              <Route path={siteRoutes.page.path} element={<Page />} />
              <Route path="/panel/*" element={<PanelRoutes />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </TRPCProvider>
    </AuthGuard>
  </RecoilRoot>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
