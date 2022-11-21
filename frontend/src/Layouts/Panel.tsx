import React from "react";
import { Link } from "react-router-dom";
import { TopBar } from "src/components/TopBar";
import styles from "./Panel.scss";

interface ItemMenuProps {
  label: string;
  href: string;
}
const ItemMenu: React.FC<ItemMenuProps> = ({ label, href }) => (
  <div className={styles.sidebarItem}>
    <Link to={href} className={styles.sidebarItemLink}>
      {label}
    </Link>
  </div>
);

export const Panel: React.FC = ({ children }) => (
  <div className={styles.root}>
    <TopBar />
    <nav className={styles.sidebar}>
      {[
        { href: "/panel/", label: "Home" },
        { href: "/panel/pages", label: "Pages" },
        { href: "/panel/tags", label: "Tags" },
      ].map((props) => (
        <ItemMenu {...props} />
      ))}
    </nav>
    <main className={styles.content}>{children}</main>
  </div>
);
