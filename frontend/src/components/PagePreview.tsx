import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import directivePlugin from "remark-directive";
import { siteRoutes } from "src/routes";
import { visit } from "unist-util-visit";
import { AppRouterOutputs } from "@api";
import { remark } from "remark";
import ChevronLeftIcon from "@assets/chevron_left.svg";
import ChevronRightIcon from "@assets/chevron_right.svg";
import styles from "./PagePreview.scss";
import { Dialog } from "./Dialog";
import { IconButton } from "./IconButton";

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

interface Img {
  alt: string;
  src: string;
}

// eslint-disable-next-line no-unused-vars
const embedImagePlugin: (cb?: (img: Img) => void) => Plugin =
  (cb) => () => (tree) => {
    visit(tree, (node) => {
      if (node.type === "textDirective") {
        if (node.name !== "img") return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        // @ts-ignore
        const alt = node.children?.[0].value;
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
  const [viewer, setViewer] = React.useState<{
    open: boolean;
    index: number;
    imgs: Img[];
  }>({
    open: false,
    index: 0,
    imgs: [],
  });
  const closeViewer = React.useCallback(
    () =>
      setViewer({
        open: false,
        index: 0,
        imgs: [],
      }),
    []
  );
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
            const imgs: Img[] = [];
            remark()
              .use([directivePlugin, embedImagePlugin((img) => imgs.push(img))])
              .processSync(pageRef.current!.content!);

            setViewer({
              open: true,
              index: imgs.findIndex(
                (img) => img.src === src && img.alt === alt
              )!,
              imgs,
            });
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
      <Dialog
        title="Gallery"
        open={viewer.open}
        onClose={closeViewer}
        width="700px"
      >
        {viewer.open && (
          <div className={styles.viewer}>
            <IconButton
              disabled={viewer.imgs.length < 2}
              variant="flat"
              onClick={() =>
                setViewer((prev) => ({
                  ...prev,
                  index: (prev.index - 1) % prev.imgs.length,
                }))
              }
            >
              <ChevronLeftIcon />
            </IconButton>
            <div>
              <img
                className={styles.viewerImg}
                src={viewer.imgs[viewer.index].src}
                alt={viewer.imgs[viewer.index].alt}
              />
              <p className={styles.viewerText}>
                {viewer.imgs[viewer.index].alt}
              </p>
            </div>
            <IconButton
              disabled={viewer.imgs.length < 2}
              variant="flat"
              onClick={() =>
                setViewer((prev) => ({
                  ...prev,
                  index: (prev.index + 1) % prev.imgs.length,
                }))
              }
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
        )}
      </Dialog>
    </>
  );
};
PagePreview.displayName = "PagePreview";
