import SVG from "react-inlinesvg";
import React from "react";
import { AlertTemplateProps } from "react-alert";
import clsx from "clsx";
import closeIcon from "@assets/close.svg";
import checkIcon from "@assets/check.svg";
import alertIcon from "@assets/alert.svg";
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
      {options.type === "success" && (
        <SVG className={styles.status} src={checkIcon} />
      )}
      {options.type === "error" && (
        <SVG className={styles.status} src={alertIcon} />
      )}
      {message}
    </div>
    <IconButton className={styles.close} onClick={close}>
      <SVG src={closeIcon} />
    </IconButton>
  </div>
);
