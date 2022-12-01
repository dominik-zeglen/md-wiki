import React from "react";
import Modal from "react-modal";
import SVG from "react-inlinesvg";
import closeIcon from "../../../assets/close.svg";
import { IconButton } from "../IconButton";
import styles from "./Dialog.scss";

Modal.setAppElement("body");

export interface DialogProps {
  open: boolean;
  title?: string;
  width?: string;
  onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  title,
  open,
  width,
  onClose,
}) => (
  <Modal
    isOpen={open}
    onRequestClose={onClose}
    style={{
      content: {
        backgroundColor: "var(--palette-background)",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        maxWidth: `calc(100vw - ${"calc(var(--spacing) * 4)"})`,
        width: width ?? "300px",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    }}
  >
    <div className={styles.title}>
      <h4 className={styles.titleText}>{title}</h4>
      <IconButton className={styles.close} onClick={onClose}>
        <SVG src={closeIcon} />
      </IconButton>
    </div>
    {children}
  </Modal>
);
Dialog.displayName = "Dialog";
