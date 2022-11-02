import React from "react";
import type { Page as PageType } from "../../../services/types/page";
import { Link } from "react-router-dom";
import styles from "./PageList.scss";

export interface PageProps {
  pages: PageType[] | undefined;
}

export const PageList: React.FC<PageProps> = ({ pages }) => {
  if (pages === undefined) {
    return <>Loading...</>;
  }

  return (
    <ul className={styles.root}>
      {pages.map((page) => (
        <li key={page.slug}>
          <Link to={`/panel/${page.slug}/edit`}>{page.title}</Link>
        </li>
      ))}
    </ul>
  );
};
PageList.displayName = "PageList";
