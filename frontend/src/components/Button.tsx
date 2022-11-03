import clsx from "clsx";
import React from "react";
import styles from "./Button.scss";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active?: boolean;
  color?: "default" | "primary" | "error" | "success";
}

export const Button: React.FC<ButtonProps> = ({
  active,
  className,
  color,
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
      className={clsx(styles.root, className, {
        [styles.active]: active,
        [styles.primary]: color === "primary",
        [styles.error]: color === "error",
        [styles.success]: color === "success",
      })}
    />
  );
};
Button.displayName = "Button";
