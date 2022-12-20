import React, { useContext } from "react";
import { useQs } from "src/hooks/useQs";

export interface PaginationProviderProps {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const PaginationContext = React.createContext<
  | {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      page: number;
      onPreviousPage: () => void;
      onNextPage: () => void;
    }
  | undefined
>(undefined);

export const usePaginationContext = () => {
  const value = useContext(PaginationContext);

  if (!value) {
    throw new Error("No PaginationContext");
  }

  return value;
};

export const PaginationProvider: React.FC<PaginationProviderProps> = ({
  children,
  hasPreviousPage,
  hasNextPage,
}) => {
  const [{ page: pageParam }, setParams] = useQs();
  const page = parseInt(pageParam ?? "1");
  const onPreviousPage = () =>
    setParams({ page: Math.max(page - 1, 1).toString() });
  const onNextPage = () => setParams({ page: (page + 1).toString() });

  const value = React.useMemo(
    () => ({
      hasPreviousPage,
      hasNextPage,
      page: page ?? 1,
      onPreviousPage,
      onNextPage,
    }),
    [page, hasPreviousPage, hasNextPage]
  );

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};
