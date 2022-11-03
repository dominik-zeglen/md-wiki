import type { Page as PageType } from "../../../services/types/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import { config } from "../../awsConfig";

API.configure({
  endpoints: [
    {
      name: "pages",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },
  ],
});

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL environment variable not set");
}

export function usePage(slug: string, cached?: boolean) {
  return useQuery(
    ["pages", slug],
    async () => {
      const data: PageType = await API.get(
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
    const data: PageType[] = await API.get("pages", "/pages", {});

    return data;
  });
}

export function usePageUpdate() {
  return useMutation(
    ["pages"],
    async ({ slug, ...rest }: Pick<PageType, "content" | "slug" | "title">) => {
      const data: PageType = await API.patch("pages", urlJoin("/pages", slug), {
        body: rest,
      });

      return data;
    }
  );
}

export function usePageCreate() {
  return useMutation(
    ["pages"],
    async (body: Pick<PageType, "content" | "slug" | "title">) => {
      const data: PageType = await API.post("pages", "/pages", {
        body,
      });

      return data;
    }
  );
}
