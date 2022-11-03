import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import styles from "./Savebar.scss";

export interface SavebarProps {
  loading: boolean;
  /** Path to previous view */
  back?: string;
  onSubmit: () => void;
}

export const Savebar: React.FC<SavebarProps> = ({
  back,
  loading,
  onSubmit,
}) => (
  <div className={styles.root}>
    {!!back && (
      <Link to={back}>
        <Button>Back</Button>
      </Link>
    )}
    <Button color="primary" onClick={onSubmit}>
      {loading ? "Loading..." : "Submit"}
    </Button>
  </div>
);
