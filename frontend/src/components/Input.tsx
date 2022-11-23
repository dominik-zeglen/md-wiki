import clsx from "clsx";
import React from "react";
import styles from "./Input.scss";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  fullWidth?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      // eslint-disable-next-line react/destructuring-assignment
      className={clsx(styles.root, props?.className, {
        [styles.fullWidth]: props.fullWidth,
      })}
    />
  )
);
Input.displayName = "Input";

export const LabeledInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { label: string }
>(({ id, label, ...props }, ref) => (
  <div>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    <Input {...props} ref={ref} />
  </div>
));
LabeledInput.displayName = "LabeledInput";
