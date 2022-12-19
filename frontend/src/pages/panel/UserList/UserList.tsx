import React from "react";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { AppRouterOutputs } from "@api";
import { getName } from "src/utils/user";
import { PageLoading } from "../../common/PageLoading";
import styles from "./UserList.scss";

export interface UserProps {
  users: AppRouterOutputs["users"]["list"] | undefined;
  onCreate: () => void;
}

export const UserList: React.FC<UserProps> = ({ users, onCreate }) => (
  <div>
    <div className={styles.toolbar}>
      <Button onClick={onCreate}>New user</Button>
    </div>

    {users === undefined ? (
      <PageLoading />
    ) : (
      <div>
        <div className={styles.item}>
          <span>User name</span>
        </div>
        {users.map((user) => (
          <Card className={styles.item} key={user.username}>
            {getName(user)}
          </Card>
        ))}
      </div>
    )}
  </div>
);
UserList.displayName = "UserList";
