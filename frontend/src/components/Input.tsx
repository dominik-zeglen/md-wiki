import clsx from "clsx";
import React from "react";
import styles from "./Input.scss";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: boolean;
  fullWidth?: boolean;
  variant?: "default" | "header";
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth, error, variant, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      // eslint-disable-next-line react/destructuring-assignment
      className={clsx(props?.className, {
        [styles.root]: variant === "default" || variant === undefined,
        [styles.header]: variant === "header",
        [styles.fullWidth]: fullWidth,
        [styles.error]: error,
      })}
    />
  )
);
Input.displayName = "Input";

export const LabeledInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "error"> & { label?: string; error?: string }
>(({ id, label, error, ...props }, ref) => (
  <div>
    {!!label && (
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    )}
    <Input error={!!error} {...props} ref={ref} />
    <small className={styles.errorText}>{error}</small>
  </div>
));
LabeledInput.displayName = "LabeledInput";
