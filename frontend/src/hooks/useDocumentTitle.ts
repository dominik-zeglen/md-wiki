import { useRef, useEffect } from "react";

export function useDocumentTitle(title: string | undefined) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    if (title !== undefined) {
      document.title = `${title} | md-wiki`;
    }
  }, [title]);

  useEffect(
    () => () => {
      document.title = defaultTitle.current;
    },
    []
  );
}
