import { AppRouterOutputs } from "@api";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "src/components/Card";
import { panelRoutes } from "src/routes";
import styles from "./Home.scss";

export interface HomeProps {
  recentlyCreated: AppRouterOutputs["pages"]["list"] | undefined;
  recentlyUpdated: AppRouterOutputs["pages"]["list"] | undefined;
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
          <Card key={page.slug}>
            <Link to={panelRoutes.page.to({ slug: page.slug })}>
              {page.title}
            </Link>
            <br />
            by {page.createdBy ?? "unknown"}
          </Card>
        ))}
      </Card>
    </div>
    <div>
      <Card>
        <CardTitle>Recently Updated</CardTitle>
        {recentlyUpdated?.map((page) => (
          <Card key={page.slug}>
            <Link to={panelRoutes.page.to({ slug: page.slug })}>
              {page.title}
            </Link>
            <br />
            by {page.updatedBy}
          </Card>
        ))}
      </Card>
    </div>
  </div>
);
Home.displayName = "Home";
