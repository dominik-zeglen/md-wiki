import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { panelRoutes } from "src/routes";
import { AppRouterOutputs } from "@api";
import { Pagination } from "src/components/Pagination/Pagination";
import { PageLoading } from "../common/PageLoading";
import styles from "./PageList.scss";

export interface PageProps {
  pages: AppRouterOutputs["pages"]["list"] | undefined;
}

export const PageList: React.FC<PageProps> = ({ pages }) => (
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
            <Card className={styles.item} key={page.slug}>
              <Link to={panelRoutes.page.to({ slug: page.slug })}>
                {page.title}
              </Link>
              {Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(dbDateToDateObject(page.updatedAt as string))}
            </Card>
          ))}
          <Pagination />
        </div>
      </div>
    )}
  </div>
);
PageList.displayName = "PageList";
