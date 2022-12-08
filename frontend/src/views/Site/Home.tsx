import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Site } from "src/Layouts/Site";
import { Page } from "src/pages/site/Page";

export const Home: React.FC = () => {
  const { data: page } = trpc.pages.get.useQuery("index", {
    refetchOnMount: false,
  });

  return (
    <Site>
      <Page page={page} />
    </Site>
  );
};
Home.displayName = "Home";
