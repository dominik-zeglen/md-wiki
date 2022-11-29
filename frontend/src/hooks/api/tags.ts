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
import type { GetTagResponse } from "../../../../services/functions/tag/get";
import type { GetTagListResponse } from "../../../../services/functions/tag/list";

export function useTag(id: string, cached?: boolean) {
  return useQuery(
    ["tags", id],
    async () => {
      const data: GetTagResponse = await API.get(
        "tags",
        urlJoin("/tags", id),
        {}
      );

      return data;
    },
    {
      refetchOnMount: cached ? false : "always",
    }
  );
}

export function useTags() {
  return useQuery(["tags"], async () => {
    const data: GetTagListResponse = await API.get("tags", "/tags", {});

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
