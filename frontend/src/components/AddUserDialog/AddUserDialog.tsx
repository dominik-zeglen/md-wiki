import { AppRouterInputs } from "@api";
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogActions, BaseDialogProps } from "src/components/Dialog";
import { useYup } from "src/hooks/useYup";
import * as yup from "yup";
import { Button } from "../Button";
import { LabeledInput } from "../Input";
import { Loader } from "../Loader";
import styles from "./AddUserDialog.scss";

export interface AddUserDialogProps extends BaseDialogProps {
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: AppRouterInputs["users"]["create"]) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  loading,
  onClose,
  onSubmit,
  open,
}) => {
  const resolver = useYup(
    yup.object({
      username: yup
        .string()
        .min(3, "must contain min. 3 characters")
        .required("this field is required"),
      password: yup
        .string()
        .required("this field is required")
        .min(6, "must contain min. 6 characters"),
      confirmPassword: yup
        .string()
        .required("this field is required")
        .oneOf([yup.ref("password"), null], "passwords must match"),
    })
  );
  const [errors, setErrors] = React.useState(
    {} as Record<string, { message: string }>
  );
  const {
    register: changePasswordRegister,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    resolver,
  });

  React.useEffect(() => {
    reset();
    setErrors({});
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} title="Change password">
      <form onSubmit={handleSubmit(onSubmit, setErrors as any)}>
        <div className={styles.inputs}>
          <LabeledInput
            {...changePasswordRegister("username")}
            error={errors.username?.message}
            fullWidth
            placeholder="User name"
          />
          <LabeledInput
            {...changePasswordRegister("password")}
            error={errors.password?.message}
            type="password"
            fullWidth
            placeholder="Password"
          />
          <LabeledInput
            {...changePasswordRegister("confirmPassword")}
            error={errors.confirmPassword?.message}
            type="password"
            fullWidth
            placeholder="Confirm password"
          />
        </div>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
          <Button color="success" type="submit">
            {loading ? <Loader /> : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
