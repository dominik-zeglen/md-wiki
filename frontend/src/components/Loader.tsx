import clsx from "clsx";
import React from "react";
import styles from "./Loader.scss";

export interface LoaderProps {
  className?: string;
  size?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className, size = "1em" }) => (
  <span
    className={clsx(styles.root, className)}
    style={{ "--size": size } as any}
  >
    <span className={styles.box} />
    <span className={styles.box} />
  </span>
);
Loader.displayName = "Loader";
