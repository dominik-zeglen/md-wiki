import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "src/components/Button";
import { Dialog, DialogActions } from "src/components/Dialog";
import { Input } from "src/components/Input";
import { Loader } from "src/components/Loader";
import { useTagCreate, useTags } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { TagList } from "../pages/TagList";

export const Tags: React.FC = () => {
  const navigate = useNavigate();
  const { data: tags } = useTags();
  const { mutate: createTag, isLoading } = useTagCreate({
    onSuccess: (tag) => navigate(`/panel/tags/${tag.id}`),
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