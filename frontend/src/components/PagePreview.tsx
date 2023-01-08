import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import directivePlugin from "remark-directive";
import { siteRoutes } from "src/routes";
import { visit } from "unist-util-visit";
import { AppRouterOutputs } from "@api";
import { remark } from "remark";
import styles from "./PagePreview.scss";
import { GalleryImage, GalleryPreview, useGallery } from "./GalleryPreview";

export interface PagePreviewProps {
  page: AppRouterOutputs["pages"]["get"] | undefined;
}

type Plugin = typeof directivePlugin;

const embedPagePlugin: Plugin = () => (tree) => {
  visit(tree, (node) => {
    if (node.type === "textDirective") {
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

// eslint-disable-next-line no-unused-vars
const embedImagePlugin: (cb?: (img: GalleryImage) => void) => Plugin =
  (cb) => () => (tree) => {
    visit(tree, (node) => {
      if (node.type === "textDirective") {
        if (node.name !== "img") return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        // @ts-ignore
        const alt = node.children?.[0]?.value;
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
        if (cb) {
          cb({ src, alt });
        }
      }
    });
  };

const timelinePlugin: Plugin = () => (tree) => {
  visit(tree, (node) => {
    if (node.type === "containerDirective") {
      if (node.name !== "timeline") return;

      const data = node.data || (node.data = {});

      data.hName = "dl";
      data.hProperties = {
        className: styles.timeline,
      };
    }

    if (node.type === "leafDirective") {
      if (node.name !== "tdate") return;

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      const { date } = attributes;

      if (!date) return;
      data.hName = "tdate";
      data.hProperties = {
        date,
      };
    }
  });
};

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  const pageRef = React.useRef(page);
  React.useEffect(() => {
    pageRef.current = page;
  }, [page]);
  const { openGallery, ...galleryProps } = useGallery();
  const components = React.useMemo<Record<string, any>>(
    () => ({
      /* eslint-disable react/no-unstable-nested-components */
      a: ({ href, children }) => <Link to={href!}>{children}</Link>,
      tdate: ({ children, node }) => (
        <>
          <dt>{node.properties.date}</dt>
          <dd>{children}</dd>
        </>
      ),
      img: ({ className, alt, src, style }) => (
        <button
          className={className}
          type="button"
          style={style}
          onClick={() => {
            const images: GalleryImage[] = [];
            remark()
              .use([
                directivePlugin,
                embedImagePlugin((img) => images.push(img)),
              ])
              .processSync(pageRef.current!.content!);

            openGallery({ alt, src }, images);
          }}
        >
          <img alt={alt} src={src} />
        </button>
      ),
      /* eslint-enable react/no-unstable-nested-components */
    }),
    []
  );

  if (!page) {
    return null;
  }

  return (
    <>
      <div className={styles.root}>
        <ReactMarkdown
          remarkPlugins={[
            directivePlugin,
            embedPagePlugin,
            embedImagePlugin(),
            timelinePlugin,
          ]}
          components={components}
        >
          {page?.content!}
        </ReactMarkdown>
      </div>
      <div className={styles.clearFix} />
      <GalleryPreview {...galleryProps} />
    </>
  );
};
PagePreview.displayName = "PagePreview";
