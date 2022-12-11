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

export interface CardTitleProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  actions?: React.ReactNode;
}
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ actions, children, className, ...rest }, ref) => (
    <h6 {...rest} className={clsx(className, styles.title)} ref={ref}>
      {children}
      <div>{actions}</div>
    </h6>
  )
);
