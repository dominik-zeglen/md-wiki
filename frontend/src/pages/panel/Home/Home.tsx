import { AppRouterOutputs } from "@api";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "src/components/Card";
import { panelRoutes } from "src/routes";
import { getName } from "src/utils/user";
import styles from "./Home.scss";

export interface HomeProps {
  recentlyCreated: AppRouterOutputs["pages"]["list"]["results"] | undefined;
  recentlyUpdated: AppRouterOutputs["pages"]["list"]["results"] | undefined;
}

export const Home: React.FC<HomeProps> = ({
  recentlyCreated,
  recentlyUpdated,
}) => (
  <div className={styles.root}>
    <div>
      <Card>
        <CardTitle>Recently Created</CardTitle>
        {recentlyCreated?.map((page) => (
          <div className={styles.page} key={page.slug}>
            <Link to={panelRoutes.page.to({ slug: page.slug })}>
              {page.title}
            </Link>
            <br />
            by {getName(page.created.user)}
          </div>
        ))}
      </Card>
    </div>
    <div>
      <Card>
        <CardTitle>Recently Updated</CardTitle>
        {recentlyUpdated?.map((page) => (
          <div className={styles.page} key={page.slug}>
            <Link to={panelRoutes.page.to({ slug: page.slug })}>
              {page.title}
            </Link>
            <br />
            by {getName(page.updated.user)}
          </div>
        ))}
      </Card>
    </div>
  </div>
);
Home.displayName = "Home";
