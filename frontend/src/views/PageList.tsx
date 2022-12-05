import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { PageList } from "src/pages/PageList";

export const Pages: React.FC = () => {
  const { data: pages } = trpc.pages.list.useQuery();

  return (
    <Panel>
      <PageList pages={pages} />
    </Panel>
  );
};
Pages.displayName = "Pages";
