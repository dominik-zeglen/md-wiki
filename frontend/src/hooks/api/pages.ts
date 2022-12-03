import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import type { MdWikiPages as PageType } from "../../../../services/repository/db.d";
import type {
  CreatePageInput,
  UpdatePageInput,
} from "../../../../services/repository/page";
import type { GetPageListResponse } from "../../../../services/functions/list";
import type { GetPageResponse } from "../../../../services/functions/get";

export function usePage(slug: string, cached?: boolean) {
  return useQuery(
    ["pages", slug],
    async () => {
      const data: GetPageResponse = await API.get(
        "pages",
        urlJoin("/pages", slug),
        {}
      );

      return data;
    },
    {
      refetchOnMount: cached ? false : "always",
    }
  );
}

export function usePages() {
  return useQuery(["pages"], async () => {
    const data: GetPageListResponse = await API.get("pages", "/pages", {});

    return data;
  });
}

export function usePageUpdate() {
  return useMutation(["pages"], async (data: Omit<UpdatePageInput, "user">) => {
    const response: PageType = await API.patch(
      "pages",
      urlJoin("/pages", data.slug),
      {
        body: data,
      }
    );

    return response;
  });
}

export function usePageCreate() {
  return useMutation(["pages"], async (data: Omit<CreatePageInput, "user">) => {
    const response: PageType = await API.post("pages", "/pages", {
      body: data,
    });

    return response;
  });
}

export function usePageDelete(
  opts: UseMutationOptions<void, unknown, { slug: string }> = {}
) {
  return useMutation({
    ...opts,
    mutationFn: (data: { slug: string }) =>
      API.del("pages", urlJoin("/pages", data.slug), {}),
  });
}
