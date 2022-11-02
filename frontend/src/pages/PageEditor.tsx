import React from "react";
import { useFormContext } from "react-hook-form";
import { PagePreview } from "src/components/PagePreview";
import { Savebar } from "src/components/Savebar";
import styles from "./PageEditor.scss";

export interface PageEditorProps {
  loading: boolean;
  onSubmit: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  loading,
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
      <input className={styles.title} {...register("title")} />
      <div className={styles.editorWrapper}>
        <textarea className={styles.editor} {...register("content")} />
        <div className={styles.preview}>
          <PagePreview page={preview} />
        </div>
      </div>
      <Savebar onSubmit={onSubmit} loading={loading} />
    </div>
  );
};
