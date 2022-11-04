import React from "react";
import type { Page as PageType } from "../../../services/types/page";
import { Link } from "react-router-dom";
import styles from "./PageList.scss";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";

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

      <div>
        {pages === undefined ? (
          "Loading..."
        ) : (
          <>
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
                }).format(new Date(page.updatedAt))}
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
PageList.displayName = "PageList";
