import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { panelRoutes } from "src/routes";
import { PageLoading } from "../../common/PageLoading";
import styles from "./TagList.scss";
import { AppRouterOutputs } from "../../../../../services/api";

export interface TagProps {
  tags: AppRouterOutputs["tags"]["list"] | undefined;
  onCreate: () => void;
}

export const TagList: React.FC<TagProps> = ({ tags, onCreate }) => (
  <div>
    <div className={styles.toolbar}>
      <Button onClick={onCreate}>New tag</Button>
    </div>

    {tags === undefined ? (
      <PageLoading />
    ) : (
      <div>
        <div className={styles.item}>
          <span>Tag name</span>
          <span>Last edited</span>
        </div>
        {tags.map((tag) => (
          <Card className={styles.item} key={tag.name}>
            <Link to={panelRoutes.tag.to({ id: tag.id })}>{tag.name}</Link>
            {Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(dbDateToDateObject(tag.updatedAt as string))}
          </Card>
        ))}
      </div>
    )}
  </div>
);
TagList.displayName = "TagList";
