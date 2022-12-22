import React from "react";
import ChevronLeftIcon from "@assets/chevron_left.svg";
import ChevronRightIcon from "@assets/chevron_right.svg";
import { usePaginationContext } from "./PaginationContext";
import { IconButton } from "../IconButton";
import styles from "./Pagination.scss";

export interface BasePaginationProps {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  page: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const BasePagination: React.FC<BasePaginationProps> = ({
  hasPreviousPage,
  hasNextPage,
  page,
  onNextPage,
  onPreviousPage,
}) => (
  <div className={styles.root}>
    <IconButton disabled={!hasPreviousPage} onClick={onPreviousPage}>
      <ChevronLeftIcon />
    </IconButton>
    <span className={styles.page}>{page}</span>
    <IconButton disabled={!hasNextPage} onClick={onNextPage}>
      <ChevronRightIcon />
    </IconButton>
  </div>
);
BasePagination.displayName = "BasePagination";

export const Pagination: React.FC = () => {
  const props = usePaginationContext();

  return <BasePagination {...props} />;
};
Pagination.displayName = "Pagination";
