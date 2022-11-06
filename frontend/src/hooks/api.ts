import type { Pages as PageType } from "../../../services/repository/db.d";
import { useMutation, useQuery } from "@tanstack/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import { config } from "../../awsConfig";
import type {
  CreatePageInput,
  UpdatePageInput,
} from "../../../services/repository/page";

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
