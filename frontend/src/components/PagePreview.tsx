import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { AppRouterOutputs } from "../../../services/api";
import styles from "./PagePreview.scss";

export interface PagePreviewProps {
  page: AppRouterOutputs["pages"]["get"] | undefined;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  if (!page) {
    return null;
  }

  return (
    <div className={styles.root}>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          a: ({ href, children }) => <Link to={href!}>{children}</Link>,
        }}
      >
        {page?.content!}
      </ReactMarkdown>
    </div>
  );
};
PagePreview.displayName = "PagePreview";
