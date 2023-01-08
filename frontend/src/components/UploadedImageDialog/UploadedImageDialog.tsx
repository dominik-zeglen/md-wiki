import React from "react";
import { useAlert } from "react-alert";
import { Dialog, DialogActions, BaseDialogProps } from "src/components/Dialog";
import { Button } from "../Button";
import styles from "./UploadedImageDialog.scss";

export interface UploadedImageDialogProps extends BaseDialogProps {
  src: string;
}

export const UploadedImageDialog: React.FC<UploadedImageDialogProps> = ({
  src,
  ...props
}) => {
  const { show } = useAlert();
  const onCopy = () => {
    navigator.clipboard.writeText(src);
    show("Copied link", { type: "success" });
  };

  return (
    <Dialog {...props} title="Upload" width="400px">
      <img
        className={styles.image}
        src={src}
        style={{ width: "200px" }}
        alt=""
      />
      <button className={styles.copyBox} type="button" onClick={onCopy}>
        {src}
      </button>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
