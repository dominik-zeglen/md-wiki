import { AppRouterOutputs } from "@api";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "src/components/Button";
import { Card, CardTitle } from "src/components/Card";
import { LabeledInput } from "src/components/Input";
import { Savebar } from "src/components/Savebar";

import styles from "./Account.scss";

export interface AccountProps {
  user: AppRouterOutputs["auth"]["me"];
  loading: boolean;
  onSubmit: () => void;
  onPasswordChange: () => void;
}

export const Account: React.FC<AccountProps> = ({
  user,
  onPasswordChange,
  loading,
  onSubmit,
}) => {
  const { register, handleSubmit } = useFormContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Account</h1>
      <div className={styles.root}>
        <div>
          <Card>
            <CardTitle>Info</CardTitle>
            <div className={styles.inputs}>
              <LabeledInput
                label="Login"
                fullWidth
                disabled
                value={user?.username ?? ""}
                placeholder="Login"
              />
              <LabeledInput
                label="Display name"
                fullWidth
                {...register("displayName")}
                placeholder="Display name"
              />
            </div>
          </Card>
          <Card>
            <CardTitle>Authentication</CardTitle>
            <p className={styles.passwordChange}>
              To change your password use button below
            </p>
            <Button color="error" onClick={onPasswordChange}>
              Change password
            </Button>
          </Card>
          <Savebar loading={loading} />
        </div>
      </div>
    </form>
  );
};
