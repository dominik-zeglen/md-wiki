import React from "react";
import { usePages } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { PageList } from "src/pages/PageList";

export const Pages: React.FC = () => {
  const { data: pages } = usePages();

  return (
    <Panel>
      <PageList pages={pages} />
    </Panel>
  );
};
Pages.displayName = "Pages";
