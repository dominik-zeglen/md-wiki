import React from "react";
import { useAuth } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { groupBy } from "@fxts/core";
import { panelRoutes, siteRoutes } from "src/routes";
import { AppRouterOutputs } from "@api";
import styles from "./TagPages.scss";
import { PageLoading } from "../../common/PageLoading";

export interface TagPagesProps {
  tag: AppRouterOutputs["tags"]["get"] | undefined;
}

export const TagPages: React.FC<TagPagesProps> = ({ tag }) => {
  const { user } = useAuth();
  const groupedPages = React.useMemo(
    () =>
      Object.entries(groupBy((page) => page.title![0], tag?.pages ?? [])).sort(
        ([a], [b]) => a.localeCompare(b)
      ),
    [tag?.pages]
  );

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <h1>Tag: {tag?.name}</h1>
        {!!user && (
          <div>
            <Link to={panelRoutes.tag.to({ id: tag?.id.toString(10) ?? "" })}>
              <Button>edit</Button>
            </Link>
          </div>
        )}
      </div>
      {tag ? (
        groupedPages.map(([letter, pages]) => (
          <div className={styles.section}>
            <h6 className={styles.sectionHeader}>{letter}</h6>
            <div className={styles.sectionContent}>
              {pages.map((page) => (
                <Link to={siteRoutes.page.to({ slug: page.slug })}>
                  {page.title}
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
TagPages.displayName = "TagPages";
