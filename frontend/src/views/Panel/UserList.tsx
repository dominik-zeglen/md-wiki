import React from "react";
import { trpc } from "src/hooks/api/trpc";
import { Panel } from "src/Layouts/Panel";
import { UserList } from "src/pages/panel/UserList";

export const Users: React.FC = () => {
  const { data: users } = trpc.users.list.useQuery(null);

  return (
    <Panel>
      <UserList users={users} />
    </Panel>
  );
};
Users.displayName = "Users";
