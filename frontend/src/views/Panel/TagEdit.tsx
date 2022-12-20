import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Panel } from "src/Layouts/Panel";
import { TagEdit as TagEditPage } from "src/pages/panel/TagEdit";
import { Loader } from "src/components/Loader";
import { panelRoutes } from "src/routes";
import { trpc } from "src/hooks/api/trpc";

export const TagEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tag } = trpc.tags.get.useQuery(id!);
  const form = useForm({ defaultValues: { name: "" } });

  const { data: pages } = trpc.pages.list.useQuery({
    order: null,
    page: 1,
    size: 100,
    filter: { title: null },
  });

  React.useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name!,
      });
    }
  }, [tag]);

  const attach = trpc.tags.attach.useMutation();
  const unattach = trpc.tags.unattach.useMutation();
  const deleteTag = trpc.tags.delete.useMutation({
    onSuccess: () => navigate(panelRoutes.tags.to()),
  });

  const [openedDialog, setOpenedDialog] = React.useState<
    null | "assign" | "delete"
  >(null);
  const closeDialog = () => setOpenedDialog(null);

  return (
    <FormProvider {...form}>
      <Panel>
        <TagEditPage
          tag={tag}
          onDelete={() => setOpenedDialog("delete")}
          onAttach={() => setOpenedDialog("assign")}
        />
      </Panel>
      {!!(tag && pages) && (
        <Dialog
          open={openedDialog === "assign"}
          onClose={closeDialog}
          title={`Attach tag ${tag?.name} to pages`}
          width="400px"
        >
          {pages.results.map((page) => (
            <div key={page.slug}>
              <input
                type="checkbox"
                defaultChecked={tag.pages
                  .map(({ slug }) => slug)
                  .includes(page.slug)}
                onChange={(event) =>
                  (event.target.checked
                    ? attach.mutateAsync
                    : unattach.mutateAsync)({
                    tag: tag.id.toString(),
                    page: page.slug,
                  })
                }
              />
              {page.title}
            </div>
          ))}
          <DialogActions>
            <Button onClick={closeDialog}>
              {attach.isLoading || unattach.isLoading ? <Loader /> : "Close"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {!!tag && (
        <Dialog
          title="Delete page"
          open={openedDialog === "delete"}
          onClose={closeDialog}
        >
          Are you sure you want to delete <strong>{tag.name}</strong>?
          <DialogActions>
            <Button onClick={closeDialog}>Back</Button>
            <Button color="error" onClick={() => deleteTag.mutateAsync(id!)}>
              {deleteTag.isLoading ? <Loader /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </FormProvider>
  );
};
TagEdit.displayName = "TagEdit";
