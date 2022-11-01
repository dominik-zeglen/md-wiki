import React from "react";
import { TopBar } from "src/components/TopBar";
import styles from "./Panel.scss";

export const Panel: React.FC = ({ children }) => {
  return (
    <div>
      <TopBar />
      <main>
        <div className={styles.panel}>{children}</div>
      </main>
    </div>
  );
};
