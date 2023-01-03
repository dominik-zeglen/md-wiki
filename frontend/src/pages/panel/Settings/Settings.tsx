import { AppRouterOutputs } from "@api";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardTitle } from "src/components/Card";
import { LabeledInput } from "src/components/Input";
import { Savebar } from "src/components/Savebar";
import styles from "./Settings.scss";

export interface SettingsProps {
  loading: boolean;
  site: AppRouterOutputs["site"]["get"] | undefined;
  onSubmit: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onSubmit,
  loading,
  site,
}) => {
  const { register, handleSubmit } = useFormContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.root}>
        <div>
          <Card>
            <CardTitle>General Settings</CardTitle>
            <LabeledInput label="Site Name" fullWidth {...register("name")} />
          </Card>
        </div>
        <Savebar loading={loading} />
      </div>
    </form>
  );
};
Settings.displayName = "Settings";
