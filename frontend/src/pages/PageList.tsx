import React from "react";
import type { Page as PageType } from "../../../services/types/page";
import { Link } from "react-router-dom";
import styles from "./PageList.scss";
import { Button } from "src/components/Button";

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
      <ul className={styles.root}>
        {pages === undefined
          ? "Loading..."
          : pages.map((page) => (
              <li key={page.slug}>
                <Link to={`/panel/${page.slug}/edit`}>{page.title}</Link>
              </li>
            ))}
      </ul>
    </div>
  );
};
PageList.displayName = "PageList";
