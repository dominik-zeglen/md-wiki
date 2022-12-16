import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Input } from "src/components/Input";
import { Loader } from "src/components/Loader";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { panelRoutes } from "src/routes";
import { TagList } from "../../pages/panel/TagList";

export const Tags: React.FC = () => {
  const navigate = useNavigate();
  const { data: tags } = trpc.tags.list.useQuery(null);
  const { mutate: createTag, isLoading } = trpc.tags.create.useMutation({
    onSuccess: (tag) => navigate(panelRoutes.tag.to({ id: tag.id })),
  });
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit } = useForm({ defaultValues: { name: "" } });

  return (
    <>
      <Panel>
        <TagList tags={tags} onCreate={() => setOpen(true)} />
      </Panel>
      <Dialog
        title="Create new tag"
        width="450px"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Input {...register("name")} placeholder="Tag name" fullWidth />
        <DialogActions>
          <Button
            color="primary"
            type="submit"
            onClick={handleSubmit((data) => createTag({ data }))}
          >
            {isLoading ? <Loader /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
Tags.displayName = "Tags";
