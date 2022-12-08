import slugify from "slugify";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/panel/PageEditor";
import { panelRoutes } from "src/routes";
import { trpc } from "src/hooks/api/trpc";

export const PageCreate: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "New Page",
      content: "",
    },
  });

  const create = trpc.pages.create.useMutation();

  const onSubmit = async () => {
    const slug = slugify(form.getValues().title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      trim: true,
    });

    await create.mutateAsync({
      data: {
        ...form.getValues(),
        slug,
      },
    });

    navigate(panelRoutes.page.to({ slug }));
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
