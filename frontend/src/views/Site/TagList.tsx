import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { Site } from "src/Layouts/Site";
import { TagList as TagListTagPage } from "src/pages/site/TagList";

export const TagList: React.FC = () => {
  const { data: tags } = trpc.tags.list.useQuery(null, {
    refetchOnMount: false,
  });
  useDocumentTitle("Tags");

  return (
    <Site>
      <TagListTagPage tags={tags} />
    </Site>
  );
};
TagList.displayName = "TagList";
