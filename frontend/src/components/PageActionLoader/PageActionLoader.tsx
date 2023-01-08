import { useLayout } from "src/Layouts";
import { PageLoading } from "src/pages/common/PageLoading";
import React from "react";
import styles from "./PageActionLoader.scss";

export const PageActionLoader: React.FC = () => {
  const [{ loading }] = useLayout();

  return loading ? (
    <div className={styles.root}>
      <PageLoading />
    </div>
  ) : null;
};
