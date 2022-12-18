import React from "react";
import { AddUserDialog } from "src/components/AddUserDialog";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { UserList } from "src/pages/panel/UserList";

export const Users: React.FC = () => {
  const [dialog, setDialog] = React.useState<"add" | null>(null);
  const { data: users, refetch } = trpc.users.list.useQuery(null);
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      refetch();
      setDialog(null);
    },
  });

  return (
    <Panel>
      <UserList users={users} onCreate={() => setDialog("add")} />
      <AddUserDialog
        open={dialog === "add"}
        onClose={() => setDialog(null)}
        loading={createUser.isLoading}
        onSubmit={createUser.mutate}
      />
    </Panel>
  );
};
Users.displayName = "Users";
