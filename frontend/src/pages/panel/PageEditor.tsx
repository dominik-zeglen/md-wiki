import React from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Card, CardTitle } from "src/components/Card";
import { Input } from "src/components/Input";
import { Loader } from "src/components/Loader";
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
import { AppRouterOutputs } from "@api";
import { getName } from "src/utils/user";
import { useHotkeys } from "react-hotkeys-hook";
import { Dropdown, DropdownItem } from "src/components/DropdownMenu";
import styles from "./PageEditor.scss";

export interface PageEditorProps {
  canUpload: boolean;
  page?: AppRouterOutputs["pages"]["get"];
  references?: AppRouterOutputs["pages"]["references"];
  loading: boolean;
  onDelete?: () => void;
  onUpload: () => void;
  onSubmit: () => void;
  onTagManage?: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  canUpload,
  page,
  references,
  loading,
  onDelete,
  onSubmit,
  onTagManage,
  onUpload,
}) => {
  const { register, getValues } = useFormContext();
  const [preview, setPreview] = React.useState(getValues().content);
  const [tab, setTabState] = React.useState(
    parseInt(localStorage.getItem("pageEditorTab") ?? "0")
  );
  const setTab = React.useCallback((index: number) => {
    setTabState(index);
    localStorage.setItem("pageEditorTab", index.toString());
  }, []);

  useFormSave(onSubmit);

  React.useEffect(() => {
    const handle = setInterval(() => {
      setPreview(getValues());
    }, 300);

    return () => clearInterval(handle);
  }, []);

  useHotkeys(
    "meta+m",
    () => {
      setTab((tab + 1) % 2);
    },
    {
      enableOnFormTags: true,
    },
    [tab]
  );

  return (
    <TabGroup onChange={setTab} selectedIndex={tab}>
      <div className={styles.root}>
        <Input variant="header" fullWidth {...register("title")} />
        <div className={styles.editorTabs}>
          <TabList>
            <Tab>Preview</Tab>
            <Tab>Details</Tab>
          </TabList>
          <Dropdown variant="vertical">
            <DropdownItem onClick={onUpload}>Upload image</DropdownItem>
            {!!page && (
              <DropdownItem
                as={Link}
                to={siteRoutes.page.to({ slug: page.slug })}
              >
                View on site
              </DropdownItem>
            )}
            {onDelete && <DropdownItem onClick={onDelete}>Delete</DropdownItem>}
          </Dropdown>
        </div>
        <div className={styles.editorWrapper}>
          <textarea className={styles.editor} {...register("content")} />
          <div className={styles.editorRightPane}>
            {page ? (
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
                    })}, by ${getName(page.created.user)}`}</p>
                    <p>{`Last modified ${dbDateToDateObject(
                      page.updatedAt as string
                    ).toLocaleDateString("en", {
                      dateStyle: "long",
                    })} by ${getName(page.updated.user)}`}</p>
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
                              to={panelRoutes.tag.to({
                                id: tag.id.toString(10),
                              })}
                            >
                              {tag.name}
                            </Link>
                          ))
                        : "No tags attached"}
                    </div>
                  </Card>
                  <Card>
                    <CardTitle>Referenced by</CardTitle>
                    <div className={styles.editorRightPaneReferences}>
                      {references === undefined ? (
                        <Loader />
                      ) : references.length > 0 ? (
                        references.map((referencingPage) => (
                          <Link
                            key={referencingPage.slug}
                            to={panelRoutes.page.to({
                              slug: referencingPage.slug,
                            })}
                          >
                            {referencingPage.title}
                          </Link>
                        ))
                      ) : (
                        "No references to this page"
                      )}
                    </div>
                  </Card>
                </TabPanel>
              </TabPanels>
            ) : (
              <PagePreview page={preview} />
            )}
          </div>
        </div>
        <Savebar
          back={panelRoutes.pages.to()}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </TabGroup>
  );
};
