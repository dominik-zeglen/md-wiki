import { parse, stringify } from "qs";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export function useQs() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(
    () => parse(search.slice(1)) as Record<string, string>,
    [search]
  );
  const setParams = useCallback(
    (newParams: Record<string, string>, replace = false) => {
      navigate(
        `?${stringify(
          replace
            ? newParams
            : {
                ...params,
                ...newParams,
              }
        )}`
      );
    },
    [params]
  );

  return [params, setParams] as const;
}
