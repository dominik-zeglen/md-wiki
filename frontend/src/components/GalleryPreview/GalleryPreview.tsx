import React from "react";
import ChevronLeftIcon from "@assets/chevron_left.svg";
import ChevronRightIcon from "@assets/chevron_right.svg";
import { useHotkeys } from "react-hotkeys-hook";
import { BaseDialogProps, Dialog } from "../Dialog";
import { IconButton } from "../IconButton";
import { useGallery } from "./useGallery";
import styles from "./GalleryPreview.scss";

export interface GalleryPreviewProps
  extends BaseDialogProps,
    Pick<
      ReturnType<typeof useGallery>,
      "next" | "previous" | "current" | "images"
    > {}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({
  next,
  previous,
  current,
  images,
  ...dialogProps
}) => {
  useHotkeys("left", previous, [previous]);
  useHotkeys("right", next, [next]);

  return (
    <Dialog title="Gallery" width="700px" {...dialogProps}>
      <div className={styles.root}>
        <IconButton
          disabled={images.length < 2}
          variant="flat"
          onClick={previous}
        >
          <ChevronLeftIcon />
        </IconButton>
        {!!current && (
          <div>
            <img className={styles.image} src={current.src} alt={current.alt} />
            <p className={styles.text}>{current.alt}</p>
          </div>
        )}
        <IconButton disabled={images.length < 2} variant="flat" onClick={next}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </Dialog>
  );
};
