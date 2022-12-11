import pick from "lodash/pick";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Loader } from "src/components/Loader";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/panel/PageEditor";
import { PageLoading } from "src/pages/common/PageLoading";
import { panelRoutes } from "src/routes";

export const PageEdit: React.FC = () => {
  const { slug } = useParams();
  const { data: page, refetch } = trpc.pages.get.useQuery(slug!, {
    refetchOnMount: "always",
  });

  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { content: "", title: "" },
  });
  const [openedDialog, setOpenedDialog] = React.useState<
    null | "tags" | "delete"
  >(null);
  const closeDialog = () => setOpenedDialog(null);

  React.useEffect(() => {
    form.reset(pick(page, ["title", "content"]));
  }, [page]);

  const update = trpc.pages.update.useMutation();
  const pageDelete = trpc.pages.delete.useMutation({
    onSuccess: () => navigate(panelRoutes.pages.to()),
  });
  const attach = trpc.tags.attach.useMutation();
  const unattach = trpc.tags.unattach.useMutation();
  const { data: tags } = trpc.tags.list.useQuery(undefined, {
    enabled: openedDialog === "tags",
    refetchOnMount: "always",
  });

  React.useEffect(() => {
    refetch();
  }, [openedDialog === null]);

  const onSubmit = () =>
    update.mutate({
      slug: slug!,
      input: form.getValues(),
    });

  return (
    <>
      <FormProvider {...form}>
        <Panel>
          {!page ? (
            <PageLoading />
          ) : (
            <PageEditor
              page={page}
              loading={update.isLoading}
              onDelete={() => setOpenedDialog("delete")}
              onSubmit={onSubmit}
              onTagManage={() => setOpenedDialog("tags")}
            />
          )}
        </Panel>
      </FormProvider>
      <Dialog
        title="Delete page"
        open={openedDialog === "delete"}
        onClose={closeDialog}
      >
        Are you sure you want to delete <strong>{page?.title}</strong>?
        <DialogActions>
          <Button onClick={closeDialog}>Back</Button>
          <Button color="error" onClick={() => pageDelete.mutateAsync(slug!)}>
            {pageDelete.isLoading ? <Loader /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      {!!(tags && page) && (
        <Dialog
          open={openedDialog === "tags"}
          onClose={closeDialog}
          title={`Attach tags to ${page.title}`}
          width="400px"
        >
          {tags.map((tag) => (
            <div key={tag.id}>
              <input
                type="checkbox"
                defaultChecked={page.tags.map(({ id }) => id).includes(tag.id)}
                onChange={(event) =>
                  (event.target.checked
                    ? attach.mutateAsync
                    : unattach.mutateAsync)({
                    tag: tag.id.toString(),
                    page: page.slug,
                  })
                }
              />
              {tag.name}
            </div>
          ))}
          <DialogActions>
            <Button onClick={closeDialog}>
              {attach.isLoading || unattach.isLoading ? <Loader /> : "Close"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
PageEdit.displayName = "PageEdit";
