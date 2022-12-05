import React from "react";
import styles from "./Loader.scss";

export interface LoaderProps {
  size?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "1em" }) => (
  <span className={styles.root} style={{ "--size": size } as any}>
    <span className={styles.box} />
    <span className={styles.box} />
  </span>
);
Loader.displayName = "Loader";
