import pick from "lodash/pick";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Loader } from "src/components/Loader";
import { usePage, usePageDelete, usePageUpdate } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/PageEditor";
import { PageLoading } from "src/pages/PageLoading";
import { panelRoutes } from "src/routes";

export const PageEdit: React.FC = () => {
  const { slug } = useParams();
  const { data: page } = usePage(slug!);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: page ? pick(page, ["title", "content"]) : {},
  });

  React.useEffect(() => {
    form.reset(pick(page, ["title", "content"]));
  }, [page]);

  const update = usePageUpdate();
  const pageDelete = usePageDelete({
    onSuccess: () => navigate(panelRoutes.pages.to()),
  });

  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

  const onSubmit = () =>
    update.mutate({
      slug: slug!,
      data: form.getValues(),
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
          <Button
            color="error"
            onClick={() => pageDelete.mutateAsync({ slug: slug! })}
          >
            {pageDelete.isLoading ? <Loader /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
PageEdit.displayName = "PageEdit";
