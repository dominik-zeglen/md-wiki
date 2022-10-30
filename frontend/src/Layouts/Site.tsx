import React from "react";
import { TopBar } from "src/components/TopBar";
import styles from "./Site.scss";

export const Site: React.FC = ({ children }) => {
  return (
    <div>
      <TopBar />
      <main>
        <div className={styles.site}>{children}</div>
      </main>
    </div>
  );
};
