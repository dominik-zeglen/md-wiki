import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { PagePreview } from "src/components/PagePreview";
import { Savebar } from "src/components/Savebar";
import styles from "./PageEditor.scss";

export interface PageEditorProps {
  loading: boolean;
  onDelete?: () => void;
  onSubmit: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
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
      <Savebar back="/panel/" onSubmit={onSubmit} loading={loading}>
        {onDelete && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
      </Savebar>
    </div>
  );
};
