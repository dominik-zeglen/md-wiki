import React from "react";
import { TopBar } from "src/components/TopBar";
import { Search } from "src/components/Search";
import { useHotkeys } from "react-hotkeys-hook";
import styles from "./Site.scss";

export const Site: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  useHotkeys("meta+k", () => {
    setOpen(true);
  });

  const openSearch = () => setOpen(true);
  const closeSearch = () => setOpen(false);

  return (
    <div>
      <TopBar limit onSearchOpen={openSearch} />
      <main>
        <div className={styles.site}>{children}</div>
      </main>
      <Search open={open} onClose={closeSearch} />
    </div>
  );
};
