import pick from "lodash/pick";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useTag, useTagUpdate } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { TagEdit as TagEditPage } from "src/pages/TagEdit";

export const TagEdit: React.FC = () => {
  const { id } = useParams();
  const { data: tag } = useTag(id!);
  const form = useForm({
    defaultValues: tag ? pick(tag, ["name"]) : {},
  });

  React.useEffect(() => {
    form.reset(pick(tag, ["name"]));
  }, [tag]);

  //   const update = useTagUpdate();

  //   const onSubmit = () =>
  //     update.mutate({
  //       slug: slug!,
  //       data: form.getValues(),
  //     });

  return (
    <FormProvider {...form}>
      <Panel>
        <TagEditPage tag={tag} onDelete={() => undefined} />
      </Panel>
    </FormProvider>
  );
};
TagEdit.displayName = "TagEdit";
