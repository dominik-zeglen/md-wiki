import { Popover } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCognito } from "src/hooks/auth";
import { Button } from "./Button";
import { Card } from "./Card";
import styles from "./TopBar.scss";

export interface TopBarProps {
  limit?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ limit }) => {
  const { user, login, logout, loading } = useCognito();
  const { pathname } = useLocation();

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
            <div className={styles.userbar}>
              <Popover>
                <Popover.Button as="div" className={styles.userbarMenuBtn}>
                  {user.email}
                </Popover.Button>
                <Popover.Panel as={Card} className={styles.userbarMenu}>
                  {pathname.includes("/panel") ? (
                    <Link to="/">
                      <Button>Site</Button>
                    </Link>
                  ) : (
                    <Link to="/panel">
                      <Button>panel</Button>
                    </Link>
                  )}
                  <Button onClick={logout}>logout</Button>
                </Popover.Panel>
              </Popover>
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
