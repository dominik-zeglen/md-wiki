import slugify from "slugify";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { usePageCreate } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/PageEditor";

export const PageCreate: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "New Page",
      content: "",
    },
  });

  const create = usePageCreate();

  const onSubmit = async () => {
    const slug = slugify(form.getValues().title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      trim: true,
    });
    console.log(slug);
    await create.mutateAsync({
      ...form.getValues(),
      slug,
    });

    navigate(`/panel/${slug}/edit`);
  };

  return (
    <FormProvider {...form}>
      <Panel>
        <PageEditor loading={create.isLoading} onSubmit={onSubmit} />
      </Panel>
    </FormProvider>
  );
};
PageCreate.displayName = "PageCreate";
