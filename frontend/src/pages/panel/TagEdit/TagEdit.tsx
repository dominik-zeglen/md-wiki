import React from "react";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card, CardTitle } from "src/components/Card";
import { dbDateToDateObject } from "src/utils/date";
import { LabeledInput } from "src/components/Input";
import { useFormContext } from "react-hook-form";
import { panelRoutes } from "src/routes";
import { AppRouterOutputs } from "@api";
import { PanelHeader } from "src/components/PanelHeader";
import { PageLoading } from "../../common/PageLoading";
import styles from "./TagEdit.scss";

export interface TagProps {
  tag: AppRouterOutputs["tags"]["get"] | undefined;
  onAttach: () => void;
  onDelete: () => void;
}

export const TagEdit: React.FC<TagProps> = ({ tag, onAttach, onDelete }) => {
  const { register } = useFormContext();

  return (
    <div>
      <PanelHeader title="Edit tag">
        <Button onClick={onAttach}>Attach Pages</Button>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
      </PanelHeader>

      {tag === undefined ? (
        <PageLoading />
      ) : (
        <div className={styles.grid}>
          <div>
            <Card>
              <CardTitle>Info</CardTitle>
              <LabeledInput
                {...register("name")}
                label="Tag name"
                fullWidth
                placeholder="Tag name"
              />
            </Card>
            <div className={styles.pages}>
              {tag.pages.length > 0 ? (
                <>
                  <div className={styles.item}>
                    <span>Page name</span>
                    <span>Last edited</span>
                  </div>
                  {tag.pages.map((page) => (
                    <Card className={styles.item} key={page.slug}>
                      <Link to={panelRoutes.page.to({ slug: page.slug })}>
                        {page.title}
                      </Link>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(dbDateToDateObject(page.updatedAt as string))}
                    </Card>
                  ))}
                </>
              ) : (
                <>No pages with this tag were found</>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
TagEdit.displayName = "TagEdit";
