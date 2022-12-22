import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { panelRoutes } from "src/routes";
import { AppRouterInputs, AppRouterOutputs } from "@api";
import { Pagination } from "src/components/Pagination/Pagination";
import clsx from "clsx";
import StarIcon from "@assets/star.svg";
import StarOutlinedIcon from "@assets/starOutlined.svg";
import { IconButton } from "src/components/IconButton";
import styles from "./PageList.scss";
import { PageLoading } from "../common/PageLoading";

export interface PageProps {
  pages: AppRouterOutputs["pages"]["list"] | undefined;
  // eslint-disable-next-line no-unused-vars
  onHighlight: (input: AppRouterInputs["pages"]["highlight"]) => void;
}

export const PageList: React.FC<PageProps> = ({ pages, onHighlight }) => (
  <div>
    <div className={styles.toolbar}>
      <Link to={panelRoutes.pageCreate.to()}>
        <Button>New page</Button>
      </Link>
    </div>

    {pages === undefined ? (
      <PageLoading />
    ) : (
      <div className={styles.grid}>
        <div>
          <div className={styles.item}>
            <span>Page name</span>
            <span>Last edited</span>
          </div>
          {pages.results.map((page) => (
            <Card
              className={clsx(styles.item, {
                [styles.itemHighlighted]: page.highlighted,
              })}
              key={page.slug}
            >
              <Link to={panelRoutes.page.to({ slug: page.slug })}>
                {page.title}
              </Link>
              {Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(dbDateToDateObject(page.updatedAt as string))}
              <IconButton
                onClick={() =>
                  onHighlight({
                    slug: page.slug,
                    highlighted: !page.highlighted,
                  })
                }
                variant="flat"
              >
                {page.highlighted ? (
                  <StarIcon className={styles.itemHighlightedIcon} />
                ) : (
                  <StarOutlinedIcon className={styles.itemHighlightedIcon} />
                )}
              </IconButton>
            </Card>
          ))}
          <Pagination />
        </div>
      </div>
    )}
  </div>
);
PageList.displayName = "PageList";
