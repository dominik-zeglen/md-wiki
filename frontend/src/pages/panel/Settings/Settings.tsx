import { AppRouterOutputs } from "@api";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "src/components/Button";
import { Card, CardTitle } from "src/components/Card";
import { LabeledInput } from "src/components/Input";
import { Savebar } from "src/components/Savebar";
import styles from "./Settings.scss";

export interface SettingsProps {
  loading: boolean;
  site: AppRouterOutputs["site"]["get"] | undefined;
  s3: AppRouterOutputs["site"]["s3"] | undefined;
  onSubmit: () => void;
  onS3Configure: () => void;
  onS3Delete: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onSubmit,
  loading,
  site,
  s3,
  onS3Configure,
  onS3Delete,
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

          <Card>
            <CardTitle
              // eslint-disable-next-line react/no-unstable-nested-components
              actions={
                s3?.bucket ? (
                  <>
                    <Button onClick={onS3Configure}>Edit</Button>
                    <Button color="error" onClick={onS3Delete}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button onClick={onS3Configure}>Add</Button>
                )
              }
            >
              S3 Bucket
            </CardTitle>
            {s3?.bucket
              ? `Currently using ${s3.bucket} bucket.`
              : "Not configured yet."}
          </Card>
        </div>
        <Savebar loading={loading} />
      </div>
    </form>
  );
};
Settings.displayName = "Settings";
