import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { Loader } from "./Loader";
import styles from "./Savebar.scss";

export interface SavebarProps {
  loading: boolean;
  /** Path to previous view */
  back?: string;
  onSubmit: () => void;
}

export const Savebar: React.FC<SavebarProps> = ({
  back,
  children,
  loading,
  onSubmit,
}) => (
  <div className={styles.root}>
    {children}
    {!!back && (
      <Link to={back}>
        <Button>Back</Button>
      </Link>
    )}
    <Button color="primary" onClick={onSubmit}>
      {loading ? <Loader /> : "Submit"}
    </Button>
  </div>
);
