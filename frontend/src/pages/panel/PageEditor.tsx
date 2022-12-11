import React from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card, CardTitle } from "src/components/Card";
import { Input } from "src/components/Input";
import { PagePreview } from "src/components/PagePreview";
import { Savebar } from "src/components/Savebar";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "src/components/Tabs/Tabs";
import { useFormSave } from "src/hooks/forms";
import { panelRoutes, siteRoutes } from "src/routes";
import { dbDateToDateObject } from "src/utils/date";
import { AppRouterOutputs } from "../../../../services/api";
import styles from "./PageEditor.scss";

export interface PageEditorProps {
  page?: AppRouterOutputs["pages"]["get"];
  loading: boolean;
  onDelete?: () => void;
  onSubmit: () => void;
  onTagManage?: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  loading,
  onDelete,
  onSubmit,
  onTagManage,
}) => {
  const { register, getValues } = useFormContext();
  const [preview, setPreview] = React.useState(getValues().content);

  useFormSave(onSubmit);

  React.useEffect(() => {
    const handle = setInterval(() => {
      setPreview(getValues());
    }, 300);

    return () => clearInterval(handle);
  }, []);

  return (
    <div className={styles.root}>
      <Input variant="header" fullWidth {...register("title")} />
      <div className={styles.editorWrapper}>
        <textarea className={styles.editor} {...register("content")} />
        <div className={styles.editorRightPane}>
          {!!page ? (
            <TabGroup
              defaultIndex={parseInt(
                localStorage.getItem("pageEditorTab") ?? "0"
              )}
              onChange={(index) =>
                localStorage.setItem("pageEditorTab", index.toString())
              }
            >
              <div className={styles.editorRightPaneTabsContainer}>
                <TabList className={styles.editorRightPaneTabs}>
                  <Tab>Preview</Tab>
                  <Tab>Details</Tab>
                </TabList>
              </div>
              <TabPanels>
                <TabPanel>
                  <PagePreview page={preview} />
                </TabPanel>
                <TabPanel>
                  <Card>
                    <CardTitle>History</CardTitle>
                    <p>{`Created ${dbDateToDateObject(
                      page.createdAt as string
                    ).toLocaleDateString("en", {
                      dateStyle: "long",
                    })}, by ${
                      page.created.user.displayName ??
                      page.created.user.email ??
                      "unknown"
                    }`}</p>
                    <p>{`Last modified ${dbDateToDateObject(
                      page.updatedAt as string
                    ).toLocaleDateString("en", {
                      dateStyle: "long",
                    })} by ${
                      page.updated.user.displayName ??
                      page.updated.user.email ??
                      "unknown"
                    }`}</p>
                  </Card>
                  <Card>
                    <CardTitle
                      actions={<Button onClick={onTagManage}>Manage</Button>}
                    >
                      Tags
                    </CardTitle>
                    <div className={styles.editorRightPaneTags}>
                      {page.tags.length > 0
                        ? page.tags.map((tag) => (
                            <Link
                              key={tag.id}
                              to={panelRoutes.tag.to({ id: tag.id })}
                            >
                              {tag.name}
                            </Link>
                          ))
                        : "No tags attached"}
                    </div>
                  </Card>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          ) : (
            <PagePreview page={preview} />
          )}
        </div>
      </div>
      <Savebar
        back={panelRoutes.pages.to()}
        onSubmit={onSubmit}
        loading={loading}
      >
        {!!page && (
          <Link to={siteRoutes.page.to({ slug: page.slug })}>
            <Button>Live</Button>
          </Link>
        )}
        {onDelete && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
      </Savebar>
    </div>
  );
};
