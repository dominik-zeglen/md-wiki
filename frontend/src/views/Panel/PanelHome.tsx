import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { Home as PanelHomePage } from "../../pages/panel/Home/Home";

export const PanelHome: React.FC = () => {
  const recentlyUpdated = trpc.pages.list.useQuery({
    order: {
      ascending: false,
      by: "updatedAt",
    },
    page: 1,
    size: 5,
    filter: { title: null },
  });
  const recentlyCreated = trpc.pages.list.useQuery({
    order: {
      ascending: false,
      by: "createdAt",
    },
    page: 1,
    size: 5,
    filter: { title: null },
  });

  return (
    <Panel>
      <PanelHomePage
        recentlyCreated={recentlyCreated.data?.results}
        recentlyUpdated={recentlyUpdated.data?.results}
      />
    </Panel>
  );
};
PanelHome.displayName = "PanelHome";
