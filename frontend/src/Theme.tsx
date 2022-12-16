import { atom, useRecoilState } from "recoil";
import React from "react";
import clsx from "clsx";
import styles from "./themes.scss";

export type ThemeType = "light" | "dark";
const themeAtom = atom<ThemeType>({
  default: (localStorage.getItem("theme") as any) ?? "light",
  key: "theme",
});

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const onSet = React.useCallback((t: ThemeType) => {
    setTheme(t);
    localStorage.setItem("theme", t);
  }, []);

  return [theme, onSet] as const;
};

export const Theming: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [theme] = useTheme();

  React.useEffect(() => {
    document.body.className = clsx({
      [styles.light]: theme === "light",
      [styles.dark]: theme === "dark",
    });
  }, [theme]);

  return children;
};
