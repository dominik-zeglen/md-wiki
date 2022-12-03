import React from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import {
  usePages,
  useTag,
  useTagAttach,
  useTagUnattach,
  useTagUpdate,
} from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { TagEdit as TagEditPage } from "src/pages/TagEdit";
import {
  pipe,
  map,
  difference,
  toAsync,
  toArray,
  filter,
  each,
} from "@fxts/core";
import { Loader } from "src/components/Loader";
import { Checkbox } from "src/components/Checkbox";

export const TagEdit: React.FC = () => {
  const { id } = useParams();
  const { data: tag } = useTag(id!);
  const form = useForm({ defaultValues: { name: "" } });

  const { data: pages } = usePages();

  React.useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name!,
      });
    }
  }, [tag]);

  const attach = useTagAttach();
  const unattach = useTagUnattach();

  const [pagesDialogOpen, setPagesDialogOpen] = React.useState(false);
  const closeDialog = () => setPagesDialogOpen(false);

  return (
    <FormProvider {...form}>
      <Panel>
        <TagEditPage
          tag={tag}
          onDelete={() => undefined}
          onAttach={() => setPagesDialogOpen(true)}
        />
      </Panel>
      {!!(tag && pages) && (
        <Dialog
          open={pagesDialogOpen}
          onClose={closeDialog}
          title={`Attach tag ${tag?.name} to pages`}
          width="400px"
        >
          {pages.map((page) => (
            <div key={page.slug}>
              <input
                type="checkbox"
                checked={tag.pages.map(({ slug }) => slug).includes(page.slug)}
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
    </FormProvider>
  );
};
TagEdit.displayName = "TagEdit";
