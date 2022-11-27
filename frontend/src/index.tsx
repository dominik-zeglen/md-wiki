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
    if (!user && !loading) navigate("/");
  }, [user, loading]);

  return (
    <Routes>
      <Route path="/" element={<PanelHome />} />

      <Route path="/pages/" element={<Pages />} />
      <Route path="/pages/new" element={<PageCreate />} />
      <Route path="/pages/:slug/edit" element={<PageEdit />} />

      <Route path="/tags/" element={<Tags />} />
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/:slug" element={<Page />} />
            <Route path="/panel/*" element={<PanelRoutes />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthGuard>
  </RecoilRoot>
);

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);
render(<App />, rootNode);
