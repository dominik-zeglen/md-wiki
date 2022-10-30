import React from "react";
import { Button } from "./Button";
import styles from "./TopBar.scss";

export interface TopBarProps {}

export const TopBar: React.FC<TopBarProps> = ({}) => {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.item}>md-wiki</div>
        <div className={styles.spacer} />
        <div className={styles.item}>
          <Button>login</Button>
        </div>
      </div>
    </div>
  );
};
