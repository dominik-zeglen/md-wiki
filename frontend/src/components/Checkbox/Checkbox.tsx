import { Controller, Control } from "react-hook-form";
import React from "react";
import clsx from "clsx";
import styles from "./Checkbox.scss";

export interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => (
  <input {...props} className={clsx(className, styles.root)} type="checkbox" />
);
Checkbox.displayName = "Checkbox";

export interface CheckboxFormProps extends CheckboxProps {
  control: Control<any>;
  name: string;
}
export const CheckboxForm: React.FC<CheckboxFormProps> = ({
  control,
  className,
  name,
  ...props
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <input
        {...field}
        className={clsx(className, styles.root)}
        type="checkbox"
        value={props.value}
        checked={field.value === props.value}
        onChange={(event) => {
          field.onChange(event.target.checked ? props.value : undefined);
        }}
      />
    )}
  />
);
CheckboxForm.displayName = "CheckboxForm";
