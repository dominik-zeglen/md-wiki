import React from "react";
import { useCognito } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { PagePreview } from "src/components/PagePreview";
import styles from "./Page.scss";
import { PageLoading } from "./PageLoading";
import { GetPageResponse } from "../../../services/functions/get";

export interface PageProps {
  page: GetPageResponse | undefined;
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
      {page ? (
        <>
          <PagePreview page={page} />
          <footer className={styles.footer}>
            <h6 className={styles.footerHeader}>Tags</h6>
            {page.tags.map(({ id, name }) => (
              <Link to={`/tag/${id}`}>{name}</Link>
            ))}
          </footer>
        </>
      ) : (
        <PageLoading />
      )}
    </article>
  );
};
Page.displayName = "Page";
