import type { Page as PageType } from "../../../services/types/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
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

export function usePage(slug: string) {
  return useQuery(["pages"], async () => {
    const data: PageType = await API.get("pages", urlJoin("/pages", slug), {});

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
