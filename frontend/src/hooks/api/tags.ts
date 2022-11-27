import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import type { MdWikiTags as TagType } from "../../../../services/repository/db.d";
import type {
  CreateTagInput,
  UpdateTagInput,
} from "../../../../services/repository/tag";

export function useTag(slug: string, cached?: boolean) {
  return useQuery(
    ["tags", slug],
    async () => {
      const data: TagType = await API.get("tags", urlJoin("/tags", slug), {});

      return data;
    },
    {
      refetchOnMount: cached ? false : "always",
    }
  );
}

export function useTags() {
  return useQuery(["tags"], async () => {
    const data: TagType[] = await API.get("tags", "/tags", {});

    return data;
  });
}

export function useTagUpdate() {
  return useMutation(["tags"], async (data: Omit<UpdateTagInput, "user">) => {
    const response: TagType = await API.patch(
      "tags",
      urlJoin("/tags", data.id),
      {
        body: data,
      }
    );

    return response;
  });
}

export function useTagCreate(
  opts:
    | Omit<
        UseMutationOptions<TagType, unknown, Omit<CreateTagInput, "user">>,
        "mutationKey" | "mutationFn"
      >
    | undefined = {}
) {
  return useMutation(
    ["tags"],
    async (data: Omit<CreateTagInput, "user">) => {
      const response: TagType = await API.post("tags", "/tags", {
        body: data,
      });

      return response;
    },
    opts
  );
}
