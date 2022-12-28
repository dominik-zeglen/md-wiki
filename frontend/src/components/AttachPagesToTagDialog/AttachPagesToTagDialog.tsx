import { AppRouterOutputs } from "@api";
import React from "react";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { BaseDialogProps, Dialog, DialogActions } from "../Dialog";
import { Loader } from "../Loader";
import styles from "./AttachPagesToTagDialog.scss";

export interface AttachPagesToTagDialogProps extends BaseDialogProps {
  loading: boolean;
  tag: AppRouterOutputs["tags"]["get"];
  pages: AppRouterOutputs["pages"]["list"];
  // eslint-disable-next-line no-unused-vars
  onToggle: (slug: string, checked: boolean) => void;
}

export const AttachPagesToTagDialog: React.FC<AttachPagesToTagDialogProps> = ({
  loading,
  tag,
  pages,
  open,
  onClose,
  onToggle,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={`Attach tag ${tag?.name} to pages`}
    width="400px"
  >
    {pages.results.map((page) => (
      <div className={styles.root} key={page.slug}>
        <Checkbox
          id={`checkbox-${page.slug}`}
          defaultChecked={tag.pages.map(({ slug }) => slug).includes(page.slug)}
          onChange={(event) => onToggle(page.slug, event.target.checked)}
        />
        <label htmlFor={`checkbox-${page.slug}`}>{page.title}</label>
      </div>
    ))}
    <DialogActions>
      <Button onClick={onClose}>{loading ? <Loader /> : "Close"}</Button>
    </DialogActions>
  </Dialog>
);
AttachPagesToTagDialog.displayName = "AttachPagesToTagDialog";
