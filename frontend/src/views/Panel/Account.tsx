import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ChangePasswordDialog } from "src/components/ChangePasswordDialog/ChangePasswordDialog";
import { trpc } from "src/hooks/api/trpc";
import { useAuth } from "src/hooks/auth";
import { Panel } from "src/Layouts/Panel";
import { Account as AccountPage } from "src/pages/panel/Account";

export const Account: React.FC = () => {
  const { user, loading: userLoading, refetch } = useAuth();
  const form = useForm({
    defaultValues: {
      displayName: "",
    },
  });
  const [dialog, setDialog] = React.useState<"changePassword" | null>(null);

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => refetch(),
  });
  const updatePassword = trpc.users.update.useMutation({
    onSuccess: () => setDialog(null),
  });

  React.useEffect(() => {
    form.reset({
      displayName: user?.displayName ?? "",
    });
  }, [user]);

  return (
    <FormProvider {...form}>
      <Panel>
        <AccountPage
          user={user!}
          onPasswordChange={() => setDialog("changePassword")}
          loading={userLoading || updateUser.isLoading}
          onSubmit={() =>
            updateUser.mutate({
              user: user!.username,
              data: { ...form.getValues(), password: undefined },
            })
          }
        />
        <ChangePasswordDialog
          open={dialog === "changePassword"}
          onClose={() => setDialog(null)}
          loading={updatePassword.isLoading}
          onSubmit={(password) =>
            updatePassword.mutate({
              user: user!.username,
              data: { password, displayName: undefined },
            })
          }
        />
      </Panel>
    </FormProvider>
  );
};
Account.displayName = "Account";
