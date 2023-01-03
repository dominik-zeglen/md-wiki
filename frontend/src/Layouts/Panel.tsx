import React from "react";
import { Link } from "react-router-dom";
import { TopBar } from "src/components/TopBar";
import { panelRoutes } from "src/routes";
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
        { href: panelRoutes.home.to(), label: "Home" },
        { href: panelRoutes.pages.to(), label: "Pages" },
        { href: panelRoutes.tags.to(), label: "Tags" },
        { href: panelRoutes.users.to(), label: "Users" },
        { href: panelRoutes.settings.to(), label: "Settings" },
      ].map((props) => (
        <ItemMenu key={props.href} {...props} />
      ))}
    </nav>
    <main className={styles.content}>{children}</main>
  </div>
);
