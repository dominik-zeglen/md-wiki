import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogActions, BaseDialogProps } from "src/components/Dialog";
import { useYup } from "src/hooks/useYup";
import * as yup from "yup";
import { Button } from "../Button";
import { LabeledInput } from "../Input";
import { Loader } from "../Loader";
import styles from "./ChangePasswordDialog.scss";

export interface ChangePasswordDialogProps extends BaseDialogProps {
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (password: string) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  loading,
  onClose,
  onSubmit,
  open,
}) => {
  const resolver = useYup(
    yup.object({
      newPassword: yup
        .string()
        .required("this field is required")
        .min(6, "must contain min. 6 characters"),
      confirmPassword: yup
        .string()
        .required("this field is required")
        .oneOf([yup.ref("newPassword"), null], "passwords must match"),
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
      newPassword: "",
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
      <form
        onSubmit={handleSubmit(
          (data) => onSubmit(data.newPassword),
          setErrors as any
        )}
      >
        <div className={styles.inputs}>
          <LabeledInput
            {...changePasswordRegister("newPassword")}
            error={errors.newPassword?.message}
            type="password"
            fullWidth
            placeholder="New password"
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
          <Button color="error" type="submit">
            {loading ? <Loader /> : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
