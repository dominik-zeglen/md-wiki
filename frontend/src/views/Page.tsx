import React from "react";
import { useParams } from "react-router";
import { usePage } from "src/hooks/api";
import { Site } from "src/Layouts/Site";
import { Page as PagePage } from "src/pages/Page";

export const Page: React.FC = () => {
  const { slug } = useParams();
  const { data: page } = usePage(slug!, true);

  return (
    <Site>
      <PagePage page={page} />
    </Site>
  );
};
Page.displayName = "Page";
