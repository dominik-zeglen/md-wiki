import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import type { Pages as PageType } from "../../../services/repository/db.d";
import styles from "./PagePreview.scss";

export interface PagePreviewProps {
  page: PageType | undefined;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  if (!page) {
    return null;
  }

  return (
    <div className={styles.root}>
      <ReactMarkdown
        children={page?.content!}
        components={{
          a: ({ href, children }) => <Link to={href!}>{children}</Link>,
        }}
      />
    </div>
  );
};
PagePreview.displayName = "PagePreview";
