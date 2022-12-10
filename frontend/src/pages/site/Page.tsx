import React from "react";
import { useCognito } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { PagePreview } from "src/components/PagePreview";
import { panelRoutes, siteRoutes } from "src/routes";
import { dbDateToDateObject } from "src/utils/date";
import styles from "./Page.scss";
import { PageLoading } from "../common/PageLoading";
import { AppRouterOutputs } from "../../../../services/api";

export interface PageProps {
  page: AppRouterOutputs["pages"]["get"] | undefined;
}

export const Page: React.FC<PageProps> = ({ page }) => {
  const { user } = useCognito();

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerBar}>
          <h1>{page?.title}</h1>

          {!!user && (
            <div>
              <Link to={panelRoutes.page.to({ slug: page?.slug ?? "" })}>
                <Button>edit</Button>
              </Link>
            </div>
          )}
        </div>
        {!!page && (
          <>
            <small
              className={styles.headerCaption}
            >{`Created ${dbDateToDateObject(
              page.createdAt as string
            ).toLocaleDateString("en", {
              dateStyle: "long",
            })}, by ${
              page.created.user.displayName ??
              page.created.user.email ??
              "unknown"
            }`}</small>
            <small
              className={styles.headerCaption}
            >{`Last modified ${dbDateToDateObject(
              page.updatedAt as string
            ).toLocaleDateString("en", {
              dateStyle: "long",
            })} by ${
              page.updated.user.displayName ??
              page.updated.user.email ??
              "unknown"
            }`}</small>
          </>
        )}
      </header>
      {page ? (
        <>
          <PagePreview page={page} />
          {page?.tags.length > 0 && (
            <footer className={styles.footer}>
              <h6 className={styles.footerHeader}>Tags</h6>
              {page.tags.map(({ id, name }) => (
                <Link to={siteRoutes.tag.to({ id })}>{name}</Link>
              ))}
            </footer>
          )}
        </>
      ) : (
        <PageLoading />
      )}
    </article>
  );
};
Page.displayName = "Page";
