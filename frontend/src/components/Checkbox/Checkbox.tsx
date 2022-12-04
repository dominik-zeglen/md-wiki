import { Controller, Control } from "react-hook-form";
import React from "react";

export interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  control: Control<any>;
  name: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  control,
  name,
  ...props
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <input
        {...field}
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
Checkbox.displayName = "Checkbox";
