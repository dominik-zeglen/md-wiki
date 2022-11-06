import React from "react";
import { Loader } from "src/components/Loader";
import styles from "./PageLoading.scss";

export const PageLoading: React.FC = () => (
  <div className={styles.root}>
    <Loader size="48px" />
  </div>
);
