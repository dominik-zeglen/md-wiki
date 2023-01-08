import { Menu } from "@headlessui/react";
import React from "react";
import MoreIcon from "@assets/more.svg";
import { IconButton } from "../IconButton";
import { Card } from "../Card";
import styles from "./DropdownMenu.scss";

export interface DropdownProps {
  className?: string;
  variant: "horizontal" | "vertical";
}

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  variant = "horizontal",
  children,
}) => (
  <Menu as="div" className={styles.root}>
    {({ open }) => (
      <>
        <Menu.Button
          className={className}
          as={IconButton}
          state={open ? "active" : "idle"}
        >
          <MoreIcon
            style={{
              transform: variant === "horizontal" ? "none" : "rotate(90deg)",
            }}
          />
        </Menu.Button>
        <Menu.Items as={Card} className={styles.popover}>
          {children}
        </Menu.Items>
      </>
    )}
  </Menu>
);
Dropdown.displayName = "Dropdown";

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type DropdownItemProps<C extends React.ElementType> = PolymorphicComponentProp<
  C,
  {}
>;

type DropdownItemComponent = <C extends React.ElementType = "button">(
  // eslint-disable-next-line no-unused-vars
  props: DropdownItemProps<C>
) => React.ReactElement | null;

export const DropdownItem: DropdownItemComponent = (props) => (
  // Too lazy to properly type it
  <Menu.Item as="button" className={styles.item} {...(props as any)} />
);
