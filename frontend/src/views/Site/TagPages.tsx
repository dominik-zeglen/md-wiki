import React from "react";
import { useParams } from "react-router";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { Site } from "src/Layouts/Site";
import { TagPages as TagPagesPage } from "src/pages/site/TagPages";

export const TagPages: React.FC = () => {
  const { id } = useParams();
  const { data: tag } = trpc.tags.get.useQuery(id!.split("-")[0], {
    refetchOnMount: false,
  });
  useDocumentTitle(tag?.name ?? "Tag");

  return (
    <Site>
      <TagPagesPage tag={tag} />
    </Site>
  );
};
TagPages.displayName = "TagPages";
