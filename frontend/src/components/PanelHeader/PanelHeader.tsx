import React from "react";
import styles from "./PanelHeader.scss";

export const PanelHeader: React.FC<{ title: string }> = ({
  title,
  children,
}) => (
  <div className={styles.root}>
    <h1>{title}</h1>
    <div className={styles.toolbar}>{children}</div>
  </div>
);
PanelHeader.displayName = "PanelHeader";
