import React from "react";
import { useParams } from "react-router";
import { useTag } from "src/hooks/api";
import { Site } from "src/Layouts/Site";
import { TagPages as TagPagesPage } from "src/pages/TagPages";

export const TagPages: React.FC = () => {
  const { id } = useParams();
  const { data: tag } = useTag(id!, true);

  return (
    <Site>
      <TagPagesPage tag={tag} />
    </Site>
  );
};
TagPages.displayName = "TagPages";
