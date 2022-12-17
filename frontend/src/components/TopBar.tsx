import { Popover } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "src/hooks/auth";
import { panelRoutes, siteRoutes } from "src/routes";
import SVG from "react-inlinesvg";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import { Loader } from "./Loader";
import styles from "./TopBar.scss";
import searchIcon from "../../assets/search.svg";
import moonIcon from "../../assets/moon.svg";
import sunIcon from "../../assets/sun.svg";
import { IconButton } from "./IconButton";
import { useTheme } from "../Theme";

export interface TopBarProps {
  limit?: boolean;
  onSearchOpen?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ limit, onSearchOpen }) => {
  const { user, login, logout, loading } = useAuth();
  const { pathname } = useLocation();
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
      trusted: false,
    },
  });
  const [theme, setTheme] = useTheme();

  React.useEffect(reset, [user]);

  const isPanel = pathname.includes("/panel");

  return (
    <div className={styles.root}>
      <div
        className={clsx(styles.wrapper, {
          [styles.wrapperLimited]: limit,
        })}
      >
        <div className={styles.item}>
          <Link
            className={styles.home}
            to={isPanel ? panelRoutes.home.to() : siteRoutes.home.to()}
          >
            md-wiki
          </Link>
        </div>
        <div className={styles.spacer} />
        <div className={styles.item}>
          <IconButton
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SVG src={theme === "light" ? sunIcon : moonIcon} />
          </IconButton>
        </div>
        {onSearchOpen && (
          <div className={styles.item}>
            <IconButton onClick={onSearchOpen}>
              <SVG src={searchIcon} />
            </IconButton>
          </div>
        )}
        <div className={styles.item}>
          {loading ? (
            <Loader />
          ) : user ? (
            <div className={styles.userbar}>
              <Popover>
                <Popover.Button className={styles.userbarMenuBtn}>
                  {user?.username}
                </Popover.Button>
                <Popover.Panel as={Card} className={styles.userbarMenu}>
                  {pathname.includes("/panel") ? (
                    <Link to={siteRoutes.home.to()}>
                      <Button>Site</Button>
                    </Link>
                  ) : (
                    <Link to={panelRoutes.home.to()}>
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
                <Popover.Button className={styles.userbarMenuBtn}>
                  Login
                </Popover.Button>
                <Popover.Panel as={Card} className={styles.userbarMenu}>
                  <form
                    onSubmit={handleSubmit(login)}
                    className={styles.userbarMenuForm}
                  >
                    <Input {...register("username")} placeholder="User name" />
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                    />
                    <div className={styles.userbarMenuRememberMe}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        {...register("trusted")}
                      />
                      <label htmlFor="rememberMe">Remember me</label>
                    </div>
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
