import pick from "lodash/pick";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Loader } from "src/components/Loader";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/PageEditor";
import { PageLoading } from "src/pages/PageLoading";
import { panelRoutes } from "src/routes";

export const PageEdit: React.FC = () => {
  const { slug } = useParams();
  const { data: page } = trpc.pages.get.useQuery(slug!, {
    refetchOnMount: "always",
  });
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { content: "", title: "" },
  });

  React.useEffect(() => {
    form.reset(pick(page, ["title", "content"]));
  }, [page]);

  const update = trpc.pages.update.useMutation();
  const pageDelete = trpc.pages.delete.useMutation({
    onSuccess: () => navigate(panelRoutes.pages.to()),
  });

  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

  const onSubmit = () =>
    update.mutate({
      slug: slug!,
      input: form.getValues(),
    });
  const closeModal = () => setDialogDeleteOpen(false);

  return (
    <>
      <FormProvider {...form}>
        <Panel>
          {!page ? (
            <PageLoading />
          ) : (
            <PageEditor
              loading={update.isLoading}
              onDelete={() => setDialogDeleteOpen(true)}
              onSubmit={onSubmit}
            />
          )}
        </Panel>
      </FormProvider>
      <Dialog title="Delete page" open={dialogDeleteOpen} onClose={closeModal}>
        Are you sure you want to delete <strong>{page?.title}</strong>?
        <DialogActions>
          <Button onClick={closeModal}>Back</Button>
          <Button color="error" onClick={() => pageDelete.mutateAsync(slug!)}>
            {pageDelete.isLoading ? <Loader /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
PageEdit.displayName = "PageEdit";
