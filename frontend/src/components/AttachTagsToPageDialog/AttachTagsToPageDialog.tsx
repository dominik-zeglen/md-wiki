import { AppRouterOutputs } from "@api";
import React from "react";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { BaseDialogProps, Dialog, DialogActions } from "../Dialog";
import { Loader } from "../Loader";
import styles from "./AttachTagsToPageDialog.scss";

export interface AttachTagsToPageDialogProps extends BaseDialogProps {
  loading: boolean;
  page: AppRouterOutputs["pages"]["get"];
  tags: AppRouterOutputs["tags"]["list"];
  // eslint-disable-next-line no-unused-vars
  onToggle: (slug: number, checked: boolean) => void;
}

export const AttachTagsToPageDialog: React.FC<AttachTagsToPageDialogProps> = ({
  loading,
  page,
  tags,
  open,
  onClose,
  onToggle,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={`Attach tags to page ${page?.title}`}
    width="400px"
  >
    {tags.map((tag) => (
      <div className={styles.root} key={tag.id}>
        <Checkbox
          id={`checkbox-${tag.id}`}
          defaultChecked={page.tags.map(({ id }) => id).includes(tag.id)}
          onChange={(event) => onToggle(tag.id, event.target.checked)}
        />
        <label htmlFor={`checkbox-${tag.id}`}>{tag.name}</label>
      </div>
    ))}
    <DialogActions>
      <Button onClick={onClose}>{loading ? <Loader /> : "Close"}</Button>
    </DialogActions>
  </Dialog>
);
AttachTagsToPageDialog.displayName = "AttachTagsToPageDialog";
