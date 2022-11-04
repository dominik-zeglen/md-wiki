import React from "react";
import type { Page as PageType } from "../../../services/types/page";
import { useCognito } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { PagePreview } from "src/components/PagePreview";
import styles from "./Page.scss";

export interface PageProps {
  page: PageType | undefined;
}

export const Page: React.FC<PageProps> = ({ page }) => {
  const { user } = useCognito();

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <h1>{page?.title}</h1>
        {!!user && (
          <div>
            <Link to={`/panel/${page?.slug}/edit`}>
              <Button>edit</Button>
            </Link>
          </div>
        )}
      </div>
      {!!page && <PagePreview page={page} />}
    </article>
  );
};
Page.displayName = "Page";
