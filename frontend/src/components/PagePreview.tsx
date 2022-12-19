import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import directivePlugin from "remark-directive";
import { siteRoutes } from "src/routes";
import { visit } from "unist-util-visit";
import { AppRouterOutputs } from "@api";
import styles from "./PagePreview.scss";

export interface PagePreviewProps {
  page: AppRouterOutputs["pages"]["get"] | undefined;
}

function embedPagePlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "page") return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const slug = attributes.id;

        if (!slug) return;

        data.hName = "a";
        data.hProperties = {
          href: siteRoutes.page.to({ slug }),
        };
      }
    });
  };
}

function embedImagePlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "textDirective") {
        if (node.name !== "img") return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const alt = attributes.alt;
        const src = attributes.src;
        const side = attributes.side;
        const className = clsx(styles.image, {
          [styles.imageRight]: side === "right",
        });

        const inlineStyles = [
          attributes.width ? `width: ${attributes.width}px;` : null,
          attributes.height ? `height: ${attributes.height}px;` : null,
        ]
          .filter(Boolean)
          .join();

        if (!src) return;

        node.children = [];
        data.innerHTML = "";
        data.hName = "img";
        data.hProperties = {
          alt,
          src,
          className,
          style: inlineStyles,
        };
      }
    });
  };
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  if (!page) {
    return null;
  }

  return (
    <>
      <div className={styles.root}>
        <ReactMarkdown
          remarkPlugins={[directivePlugin, embedPagePlugin, embedImagePlugin]}
          components={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: ({ href, children }) => <Link to={href!}>{children}</Link>,
          }}
        >
          {page?.content!}
        </ReactMarkdown>
      </div>
      <div className={styles.clearFix} />
    </>
  );
};
PagePreview.displayName = "PagePreview";
