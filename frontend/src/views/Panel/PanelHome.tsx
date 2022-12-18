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
  });
  const recentlyCreated = trpc.pages.list.useQuery({
    order: {
      ascending: false,
      by: "createdAt",
    },
    page: 1,
    size: 5,
  });

  return (
    <Panel>
      <PanelHomePage
        recentlyCreated={recentlyCreated.data}
        recentlyUpdated={recentlyUpdated.data}
      />
    </Panel>
  );
};
PanelHome.displayName = "PanelHome";
