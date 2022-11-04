import clsx from "clsx";
import styles from "./Card.scss";
import React from "react";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ children, className, ...rest }, ref) => (
  <div {...rest} className={clsx(className, styles.root)} ref={ref}>
    {children}
  </div>
));
