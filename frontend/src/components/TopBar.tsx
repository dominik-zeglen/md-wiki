import clsx from "clsx";
import React from "react";
import { useCognito } from "src/hooks/auth";
import { Button } from "./Button";
import styles from "./TopBar.scss";

export interface TopBarProps {
  limit?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ limit }) => {
  const { user, login, logout, loading } = useCognito();

  if (user) {
    console.log(user.email);
  }

  return (
    <div className={styles.root}>
      <div
        className={clsx(styles.wrapper, {
          [styles.wrapperLimited]: limit,
        })}
      >
        <div className={styles.item}>md-wiki</div>
        <div className={styles.spacer} />
        <div className={styles.item}>
          {loading ? (
            "Loading..."
          ) : user ? (
            <div>
              {user.email} <Button onClick={logout}>logout</Button>
            </div>
          ) : (
            <Button
              onClick={() =>
                login({
                  email: "admin@example.com",
                  password: "Ha-(.)4b{2ZJC~-",
                })
              }
            >
              login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
