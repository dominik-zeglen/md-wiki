import React from "react";
import { useParams } from "react-router";
import { trpc } from "src/hooks/api/trpc";
import { Site } from "src/Layouts/Site";
import { TagPages as TagPagesPage } from "src/pages/TagPages";

export const TagPages: React.FC = () => {
  const { id } = useParams();
  const { data: tag } = trpc.tags.get.useQuery(id!, {
    refetchOnMount: false,
  });

  return (
    <Site>
      <TagPagesPage tag={tag} />
    </Site>
  );
};
TagPages.displayName = "TagPages";
