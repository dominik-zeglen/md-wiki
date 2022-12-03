import React from "react";
import { useCognito } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { groupBy } from "@fxts/core";
import { panelRoutes, siteRoutes } from "src/routes";
import styles from "./TagPages.scss";
import { PageLoading } from "../PageLoading";
import { GetTagResponse } from "../../../../services/functions/tag/get";

export interface TagPagesProps {
  tag: GetTagResponse | undefined;
}

export const TagPages: React.FC<TagPagesProps> = ({ tag }) => {
  const { user } = useCognito();
  const groupedPages = React.useMemo(
    () => Object.entries(groupBy((page) => page.title![0], tag?.pages ?? [])),
    [tag?.pages]
  );

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <h1>Tag: {tag?.name}</h1>
        {!!user && (
          <div>
            <Link to={panelRoutes.tag.to({ id: tag?.id ?? "" })}>
              <Button>edit</Button>
            </Link>
          </div>
        )}
      </div>
      {tag ? (
        groupedPages.map(([letter, pages]) => (
          <div>
            <h6 className={styles.sectionHeader}>{letter}</h6>
            {pages.map((page) => (
              <Link to={siteRoutes.page.to({ slug: page.slug })}>
                {page.title}
              </Link>
            ))}
          </div>
        ))
      ) : (
        <PageLoading />
      )}
    </article>
  );
};
TagPages.displayName = "TagPages";
