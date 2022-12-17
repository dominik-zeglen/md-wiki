import React from "react";
import { useAuth } from "src/hooks/auth";
import { Button } from "src/components/Button";
import { Link } from "react-router-dom";
import { PagePreview } from "src/components/PagePreview";
import { panelRoutes, siteRoutes } from "src/routes";
import { dbDateToDateObject } from "src/utils/date";
import { AppRouterOutputs } from "@api";
import styles from "./Page.scss";
import { PageLoading } from "../common/PageLoading";

export interface PageProps {
  page: AppRouterOutputs["pages"]["get"] | undefined;
}

export const Page: React.FC<PageProps> = ({ page }) => {
  const { user } = useAuth();

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
              page.created.user.username ??
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
              page.updated.user.username ??
              "unknown"
            }`}</small>
          </>
        )}
      </header>
      {page ? (
        <>
          <PagePreview page={page} />
          <footer className={styles.footer}>
            {page?.tags.length > 0 && (
              <>
                <h6>Tags</h6>
                <div className={styles.footerTags}>
                  {page.tags.map(({ id, name }) => (
                    <Link to={siteRoutes.tag.to({ id })}>{name}</Link>
                  ))}
                </div>
                <hr />
              </>
            )}
            <h6>Useful links</h6>
            <ul>
              <li>
                <Link to={siteRoutes.tags.to()}>All tags</Link>
              </li>
            </ul>
          </footer>
        </>
      ) : (
        <PageLoading />
      )}
    </article>
  );
};
Page.displayName = "Page";
