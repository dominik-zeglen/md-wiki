import clsx from "clsx";
import React from "react";
import styles from "./IconButton.scss";

export interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  state?: "idle" | "active";
  variant?: "outlined" | "flat";
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant,
  state = "idle",
  ...props
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <button
      type="button"
      {...props}
      ref={ref}
      onMouseUp={() => {
        ref.current?.blur();
      }}
      // eslint-disable-next-line react/destructuring-assignment
      className={clsx(styles.root, props?.className, {
        [styles.flat]: variant === "flat",
        [styles.active]: state === "active",
      })}
    />
  );
};
IconButton.displayName = "IconButton";
