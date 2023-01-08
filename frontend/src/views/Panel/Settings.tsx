import { AppRouterInputs } from "@api";
import React from "react";
import { useAlert } from "react-alert";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { LabeledInput } from "src/components/Input";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { Panel } from "src/Layouts/Panel";
import { Settings as SettingsPage } from "src/pages/panel/Settings";

export const Settings: React.FC = () => {
  const [dialog, setDialog] = React.useState<"updateS3" | "deleteS3" | null>(
    null
  );
  const closeDialog = React.useCallback(() => setDialog(null), []);
  const { show } = useAlert();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });
  const s3Form = useForm<AppRouterInputs["site"]["updateS3"]>();
  const siteSettings = trpc.site.get.useQuery(undefined);
  const updateSiteSettings = trpc.site.update.useMutation({
    onSuccess: () => {
      siteSettings.refetch();
      show("Saved", { type: "success" });
    },
  });
  const s3Settings = trpc.site.s3.useQuery(undefined);
  const deleteS3Settings = trpc.site.deleteS3.useMutation({
    onSuccess: () => {
      s3Settings.refetch();
      closeDialog();
    },
  });
  const updateS3Settings = trpc.site.updateS3.useMutation({
    onSuccess: () => {
      s3Settings.refetch();
      closeDialog();
    },
  });

  React.useEffect(() => {
    form.reset({
      name: siteSettings.data?.name ?? "",
    });
  }, [siteSettings.data]);

  React.useEffect(() => {
    s3Form.reset();
  }, [dialog]);

  useDocumentTitle("Settings");

  return (
    <>
      <FormProvider {...form}>
        <Panel>
          <SettingsPage
            site={siteSettings.data}
            s3={s3Settings.data}
            loading={updateSiteSettings.isLoading}
            onSubmit={() => updateSiteSettings.mutate(form.getValues())}
            onS3Configure={() => setDialog("updateS3")}
            onS3Delete={() => setDialog("deleteS3")}
          />
        </Panel>
      </FormProvider>
      <Dialog
        open={dialog === "updateS3"}
        title="S3 Configuration"
        onClose={closeDialog}
        width="500px"
      >
        <form
          onSubmit={s3Form.handleSubmit(() =>
            updateS3Settings.mutate(s3Form.getValues())
          )}
        >
          <LabeledInput
            fullWidth
            label="Bucket name"
            {...s3Form.register("s3BucketName")}
          />
          <LabeledInput
            fullWidth
            label="AWS region"
            {...s3Form.register("s3Region")}
          />
          <LabeledInput
            fullWidth
            label="AWS access key"
            {...s3Form.register("s3AccessKeyId")}
          />
          <LabeledInput
            fullWidth
            label="AWS Secret access key"
            {...s3Form.register("s3SecretAccessKey")}
          />
          <DialogActions>
            <Button type="button" onClick={closeDialog}>
              Back
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dialog === "deleteS3"}
        onClose={closeDialog}
        title="Delete S3 Configuration"
      >
        Are you sure you want to delete AWS S3 configuration?{" "}
        <strong>You will not be able to upload new images anymore.</strong>
        <DialogActions>
          <Button type="button" onClick={closeDialog}>
            Close
          </Button>
          <Button
            type="submit"
            onClick={() => deleteS3Settings.mutate()}
            color="error"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
Settings.displayName = "Settings";
