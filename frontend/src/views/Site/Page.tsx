import React from "react";
import { useParams } from "react-router";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { Site } from "src/Layouts/Site";
import { Page as PagePage } from "src/pages/site/Page";

export const Page: React.FC = () => {
  const { slug } = useParams();
  const { data: page } = trpc.pages.get.useQuery(slug!, {
    refetchOnMount: false,
  });
  useDocumentTitle(page?.title);

  return (
    <Site>
      <PagePage page={page} />
    </Site>
  );
};
Page.displayName = "Page";
