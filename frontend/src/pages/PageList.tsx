import React from "react";
import type { Pages as PageType } from "../../../services/repository/db.d";
import { Link } from "react-router-dom";
import styles from "./PageList.scss";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { PageLoading } from "./PageLoading";

export interface PageProps {
  pages: PageType[] | undefined;
}

export const PageList: React.FC<PageProps> = ({ pages }) => {
  return (
    <div>
      <div className={styles.toolbar}>
        <Link to="/panel/new">
          <Button>New page</Button>
        </Link>
      </div>

      {pages === undefined ? (
        <PageLoading />
      ) : (
        <div>
          <div className={styles.item}>
            <span>Page name</span>
            <span>Last edited</span>
          </div>
          {pages.map((page) => (
            <Card className={styles.item} key={page.slug}>
              <Link to={`/panel/${page.slug}/edit`}>{page.title}</Link>
              {Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(page.updatedAt as any as Date)}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
PageList.displayName = "PageList";
