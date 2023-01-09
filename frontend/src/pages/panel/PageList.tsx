import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { panelRoutes } from "src/routes";
import { AppRouterInputs, AppRouterOutputs } from "@api";
import { Pagination } from "src/components/Pagination/Pagination";
import clsx from "clsx";
import StarIcon from "@assets/star.svg";
import StarOutlinedIcon from "@assets/starOutlined.svg";
import { IconButton } from "src/components/IconButton";
import { PanelHeader } from "src/components/PanelHeader";
import { Input } from "src/components/Input";
import { useQs } from "src/hooks/useQs";
import debounce from "lodash/debounce";
import { PageLoading } from "../common/PageLoading";
import styles from "./PageList.scss";

export interface PageProps {
  pages: AppRouterOutputs["pages"]["list"] | undefined;
  // eslint-disable-next-line no-unused-vars
  onHighlight: (input: AppRouterInputs["pages"]["highlight"]) => void;
}

export const PageList: React.FC<PageProps> = ({ pages, onHighlight }) => {
  const [{ title }, setParams] = useQs();

  return (
    <div>
      <PanelHeader title="Pages">
        <Link to={panelRoutes.pageCreate.to()}>
          <Button>New page</Button>
        </Link>
      </PanelHeader>

      {pages === undefined ? (
        <PageLoading />
      ) : (
        <div className={styles.grid}>
          <div>
            <Input
              autoFocus
              fullWidth
              placeholder="Search pages..."
              defaultValue={title}
              onChange={debounce(
                (event) => setParams({ title: event.target.value, page: "1" }),
                300
              )}
            />
            <div className={styles.item}>
              <span>Page name</span>
              <span>Last edited</span>
            </div>
            {pages.results.map((page) => (
              <Card
                className={clsx(styles.item, {
                  [styles.itemHighlighted]: page.highlighted,
                })}
                key={page.slug}
              >
                <Link to={panelRoutes.page.to({ slug: page.slug })}>
                  {page.title}
                </Link>
                {Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(dbDateToDateObject(page.updatedAt as string))}
                <IconButton
                  onClick={() =>
                    onHighlight({
                      slug: page.slug,
                      highlighted: !page.highlighted,
                    })
                  }
                  variant="flat"
                >
                  {page.highlighted ? (
                    <StarIcon className={styles.itemHighlightedIcon} />
                  ) : (
                    <StarOutlinedIcon className={styles.itemHighlightedIcon} />
                  )}
                </IconButton>
              </Card>
            ))}
            <Pagination />
          </div>
        </div>
      )}
    </div>
  );
};
PageList.displayName = "PageList";
