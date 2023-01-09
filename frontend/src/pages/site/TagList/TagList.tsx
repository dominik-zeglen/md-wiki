import React from "react";
import { Link } from "react-router-dom";
import { groupBy } from "@fxts/core";
import { siteRoutes } from "src/routes";
import slugify from "slugify";
import { AppRouterOutputs } from "@api";
import styles from "./TagList.scss";
import { PageLoading } from "../../common/PageLoading";

export interface TagListProps {
  tags: AppRouterOutputs["tags"]["list"] | undefined;
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  const groupedTags = React.useMemo(
    () =>
      Object.entries(groupBy((tag) => tag.name![0], tags ?? [])).sort(
        ([a], [b]) => a.localeCompare(b)
      ),
    [tags]
  );

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <h1>Tags</h1>
      </div>
      {groupedTags ? (
        groupedTags.map(([letter, tagsChunk]) => (
          <div className={styles.section}>
            <h6 className={styles.sectionHeader}>{letter}</h6>
            <div className={styles.sectionContent}>
              {tagsChunk.map((tag) => (
                <Link
                  to={siteRoutes.tag.to({
                    id: [tag.id, slugify(tag.name!, { lower: true })].join("-"),
                  })}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <PageLoading />
      )}
    </article>
  );
};
TagList.displayName = "TagList";
