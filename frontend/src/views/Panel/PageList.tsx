import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { PageList } from "src/pages/panel/PageList";

export const Pages: React.FC = () => {
  const { data: pages } = trpc.pages.list.useQuery({
    page: 1,
    size: 100,
    order: null,
  });

  return (
    <Panel>
      <PageList pages={pages} />
    </Panel>
  );
};
Pages.displayName = "Pages";
