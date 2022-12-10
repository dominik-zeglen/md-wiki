import React from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { PagePreview } from "src/components/PagePreview";
import { Savebar } from "src/components/Savebar";
import { panelRoutes, siteRoutes } from "src/routes";
import { AppRouterOutputs } from "../../../../services/api";
import styles from "./PageEditor.scss";

export interface PageEditorProps {
  page?: Pick<AppRouterOutputs["pages"]["get"], "slug">;
  loading: boolean;
  onDelete?: () => void;
  onSubmit: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  loading,
  onDelete,
  onSubmit,
}) => {
  const { register, getValues } = useFormContext();
  const [preview, setPreview] = React.useState(getValues().content);

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
        <div className={styles.preview}>
          <PagePreview page={preview} />
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
