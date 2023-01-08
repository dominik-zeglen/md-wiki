import slugify from "slugify";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/panel/PageEditor";
import { panelRoutes } from "src/routes";
import { trpc } from "src/hooks/api/trpc";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { useUpload } from "src/hooks/useUpload";
import { UploadedImageDialog } from "src/components/UploadedImageDialog";

export const PageCreate: React.FC = () => {
  const [dialog, setDialog] = React.useState<"upload" | null>(null);
  const closeDialog = () => setDialog(null);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "New Page",
      content: "",
    },
  });
  useDocumentTitle("New page");

  const create = trpc.pages.create.useMutation();

  const onSubmit = async () => {
    const slug = slugify(form.getValues().title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      trim: true,
    });

    await create.mutateAsync({
      data: {
        ...form.getValues(),
        slug,
      },
    });

    navigate(panelRoutes.page.to({ slug }));
  };
  const { canUpload, onUpload, uploadedUrl } = useUpload(() =>
    setDialog("upload")
  );

  return (
    <>
      <FormProvider {...form}>
        <Panel>
          <PageEditor
            canUpload={canUpload}
            loading={create.isLoading}
            onSubmit={onSubmit}
            onUpload={onUpload}
          />
        </Panel>
      </FormProvider>
      <UploadedImageDialog
        open={dialog === "upload"}
        onClose={closeDialog}
        src={uploadedUrl}
      />
    </>
  );
};
PageCreate.displayName = "PageCreate";
