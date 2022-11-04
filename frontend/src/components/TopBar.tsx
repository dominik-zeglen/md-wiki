import { Popover } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useCognito } from "src/hooks/auth";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import styles from "./TopBar.scss";

export interface TopBarProps {
  limit?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ limit }) => {
  const { user, login, logout, loading } = useCognito();
  const { pathname } = useLocation();
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(reset, [user]);

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
            <div className={styles.userbar}>
              <Popover>
                <Popover.Button as="div" className={styles.userbarMenuBtn}>
                  Login
                </Popover.Button>
                <Popover.Panel as={Card} className={styles.userbarMenu}>
                  <form
                    onSubmit={handleSubmit(login)}
                    className={styles.userbarMenuForm}
                  >
                    <Input {...register("email")} placeholder="E-mail" />
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                    />
                    <Button type="submit">login</Button>
                  </form>
                </Popover.Panel>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
