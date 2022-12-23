import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { panelRoutes } from "src/routes";
import { AppRouterOutputs } from "@api";
import { PanelHeader } from "src/components/PanelHeader";
import { PageLoading } from "../../common/PageLoading";
import styles from "./TagList.scss";

export interface TagProps {
  tags: AppRouterOutputs["tags"]["list"] | undefined;
  onCreate: () => void;
}

export const TagList: React.FC<TagProps> = ({ tags, onCreate }) => (
  <div>
    <PanelHeader title="Tags">
      <Button onClick={onCreate}>New tag</Button>
    </PanelHeader>

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
            <Link to={panelRoutes.tag.to({ id: tag.id.toString(10) })}>
              {tag.name}
            </Link>
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
