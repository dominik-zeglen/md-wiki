import React from "react";
import { Button } from "./Button";
import styles from "./Savebar.scss";

export interface SavebarProps {
  loading: boolean;
  onSubmit: () => void;
}

export const Savebar: React.FC<SavebarProps> = ({ loading, onSubmit }) => (
  <div className={styles.root}>
    <Button onClick={onSubmit}>{loading ? "Loading..." : "Submit"}</Button>
  </div>
);
