import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { PageList } from "src/pages/panel/PageList";
import { useQs } from "src/hooks/useQs";
import { PaginationProvider } from "src/components/Pagination";

export const Pages: React.FC = () => {
  const [{ title, page }] = useQs();
  const { data: pages } = trpc.pages.list.useQuery(
    {
      page: parseInt(page ?? "1"),
      size: 20,
      order: null,
      filter: {
        title: title ?? null,
      },
    },
    { keepPreviousData: true }
  );

  return (
    <PaginationProvider
      hasPreviousPage={!!pages?.hasPrevious}
      hasNextPage={!!pages?.hasNext}
    >
      <Panel>
        <PageList pages={pages} />
      </Panel>
    </PaginationProvider>
  );
};
Pages.displayName = "Pages";
