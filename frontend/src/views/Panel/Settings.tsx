import React from "react";
import { useAlert } from "react-alert";
import { FormProvider, useForm } from "react-hook-form";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { Panel } from "src/Layouts/Panel";
import { Settings as SettingsPage } from "src/pages/panel/Settings";

export const Settings: React.FC = () => {
  const { show } = useAlert();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });
  const siteSettings = trpc.site.get.useQuery(undefined, {
    refetchOnMount: true,
  });
  const updateSiteSettings = trpc.site.update.useMutation({
    onSuccess: () => {
      siteSettings.refetch();
      show("Saved", { type: "success" });
    },
  });

  React.useEffect(() => {
    form.reset({
      name: siteSettings.data?.name ?? "",
    });
  }, [siteSettings.data]);

  useDocumentTitle("Settings");

  return (
    <FormProvider {...form}>
      <Panel>
        <SettingsPage
          site={siteSettings.data}
          loading={updateSiteSettings.isLoading}
          onSubmit={() => updateSiteSettings.mutate(form.getValues())}
        />
      </Panel>
    </FormProvider>
  );
};
Settings.displayName = "Settings";
