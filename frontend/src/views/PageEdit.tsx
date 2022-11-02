import pick from "lodash/pick";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { usePage, usePageUpdate } from "src/hooks/api";
import { Panel } from "src/Layouts/Panel";
import { PageEditor } from "src/pages/PageEditor";

export const PageEdit: React.FC = () => {
  const { slug } = useParams();
  const { data: page } = usePage(slug!);
  const form = useForm({
    defaultValues: page ? pick(page, ["title", "content"]) : {},
  });

  React.useEffect(() => {
    form.reset(pick(page, ["title", "content"]));
  }, [page]);

  const update = usePageUpdate();

  const onSubmit = () =>
    update.mutate({
      ...form.getValues(),
      slug: slug!,
    });

  return (
    <FormProvider {...form}>
      <Panel>
        {!page ? (
          "Loading..."
        ) : (
          <PageEditor loading={update.isLoading} onSubmit={onSubmit} />
        )}
      </Panel>
    </FormProvider>
  );
};
PageEdit.displayName = "PageEdit";
