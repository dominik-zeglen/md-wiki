import React from "react";
import { AlertTemplateProps } from "react-alert";
import clsx from "clsx";
import CloseIcon from "@assets/close.svg";
import CheckIcon from "@assets/check.svg";
import AlertIcon from "@assets/alert.svg";
import { IconButton } from "../IconButton";
import styles from "./Notification.scss";

export const Notification: React.FC<AlertTemplateProps> = ({
  close,
  message,
  options,
}) => (
  <div
    className={clsx(styles.root, options.type ? styles[options.type] : null)}
  >
    <div className={styles.content}>
      {options.type === "success" && <CheckIcon />}
      {options.type === "error" && <AlertIcon />}
      {message}
    </div>
    <IconButton className={styles.close} onClick={close}>
      <CloseIcon />
    </IconButton>
  </div>
);
