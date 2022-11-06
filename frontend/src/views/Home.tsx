import React from "react";
import { usePage } from "src/hooks/api";
import { Site } from "src/Layouts/Site";
import { Page } from "src/pages/Page";

export const Home: React.FC = () => {
  const { data: page } = usePage("index", true);

  return (
    <Site>
      <Page page={page} />
    </Site>
  );
};
Home.displayName = "Home";
