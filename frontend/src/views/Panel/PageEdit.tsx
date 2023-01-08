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
import { useAlert } from "react-alert";
import { AttachTagsToPageDialog } from "src/components/AttachTagsToPageDialog";
import { useDocumentTitle } from "src/hooks/useDocumentTitle";
import { UploadedImageDialog } from "src/components/UploadedImageDialog";

export const PageEdit: React.FC = () => {
  const { slug } = useParams();
  const { show } = useAlert();
  const { data: page, refetch } = trpc.pages.get.useQuery(slug!, {
    refetchOnMount: "always",
  });
  const { data: references } = trpc.pages.references.useQuery(slug!, {
    refetchOnMount: "always",
  });

  const [uploadedUrl, setUploadedUrl] = React.useState("");
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { content: "", title: "" },
  });
  const [openedDialog, setOpenedDialog] = React.useState<
    null | "tags" | "delete" | "upload"
  >(null);
  const closeDialog = React.useCallback(() => {
    refetch();
    setOpenedDialog(null);
  }, []);

  React.useEffect(() => {
    form.reset(pick(page, ["title", "content"]));
  }, [page]);

  const update = trpc.pages.update.useMutation({
    onSuccess: () => show("Saved", { type: "success" }),
  });
  const pageDelete = trpc.pages.delete.useMutation({
    onSuccess: () => navigate(panelRoutes.pages.to()),
  });
  const attach = trpc.tags.attach.useMutation();
  const unattach = trpc.tags.unattach.useMutation();
  const { data: tags } = trpc.tags.list.useQuery(null, {
    enabled: openedDialog === "tags",
    refetchOnMount: "always",
  });
  const s3Settings = trpc.site.s3.useQuery(undefined);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const getUploadLink = trpc.upload.useMutation({
    onSuccess: async ({ url, file }) => {
      await fetch(url, {
        method: "PUT",
        body: uploadRef.current!.files![0]!,
      });
      setUploadedUrl(file);
      setOpenedDialog("upload");
    },
  });

  useDocumentTitle(page?.title);

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
              canUpload={!!s3Settings.data?.bucket}
              page={page}
              references={references}
              loading={update.isLoading}
              onDelete={() => setOpenedDialog("delete")}
              onSubmit={onSubmit}
              onTagManage={() => setOpenedDialog("tags")}
              onUpload={() => uploadRef.current?.click()}
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
        <AttachTagsToPageDialog
          open={openedDialog === "tags"}
          onClose={closeDialog}
          page={page}
          tags={tags}
          loading={attach.isLoading || unattach.isLoading}
          onToggle={(id, checked) => {
            (checked ? attach.mutateAsync : unattach.mutateAsync)({
              tag: id.toString(10),
              page: page.slug,
            });
          }}
        />
      )}
      <input
        type="file"
        style={{ display: "none" }}
        ref={uploadRef}
        onChange={(event) => {
          if (event.target.files?.length) {
            getUploadLink.mutate(uploadRef.current!.files![0]!.type);
          }
        }}
      />
      <UploadedImageDialog
        src={uploadedUrl}
        open={openedDialog === "upload"}
        onClose={closeDialog}
      />
    </>
  );
};
PageEdit.displayName = "PageEdit";
