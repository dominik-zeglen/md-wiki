import React from "react";
import { Button } from "./Button";
import styles from "./Savebar.scss";

export interface SavebarProps {
  onSubmit: () => void;
}

export const Savebar: React.FC<SavebarProps> = ({ onSubmit }) => (
  <div className={styles.root}>
    <Button onClick={onSubmit}>Submit</Button>
  </div>
);
