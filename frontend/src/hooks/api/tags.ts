import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
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
import type { AttachTagToPageRequest } from "../../../../services/functions/tag/attach";
import type { UnattachTagFromPageRequest } from "../../../../services/functions/tag/unattach";

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

export function useTagAttach({
  onSuccess,
  ...opts
}: UseMutationOptions<
  unknown,
  unknown,
  AttachTagToPageRequest & { tag: string }
> = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      page,
      tag,
    }: AttachTagToPageRequest & { tag: string }) => {
      const unattachResponse = await API.post(
        "tags",
        urlJoin("/tags", tag, "attach"),
        {
          body: {
            page,
          },
        }
      );

      if (unattachResponse) {
        const data: GetTagResponse = await API.get(
          "tags",
          urlJoin("/tags", tag),
          {}
        );

        return data;
      }

      throw unattachResponse;
    },
    mutationKey: ["tags"],
    onSuccess: (data, variables, ctx) => {
      queryClient.setQueriesData(["tags", variables.tag], data);

      if (onSuccess) {
        onSuccess(data, variables, ctx);
      }
    },
    ...opts,
  });
}

export function useTagUnattach({
  onSuccess,
  ...opts
}: UseMutationOptions<
  unknown,
  unknown,
  UnattachTagFromPageRequest & { tag: string }
> = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      page,
      tag,
    }: UnattachTagFromPageRequest & { tag: string }) => {
      const unattachResponse = await API.post(
        "tags",
        urlJoin("/tags", tag, "unattach"),
        {
          body: {
            page,
          },
        }
      );

      if (unattachResponse) {
        const data: GetTagResponse = await API.get(
          "tags",
          urlJoin("/tags", tag),
          {}
        );

        return data;
      }

      throw unattachResponse;
    },
    mutationKey: ["tags"],
    onSuccess: (data, variables, ctx) => {
      queryClient.setQueriesData(["tags", variables.tag], data);

      if (onSuccess) {
        onSuccess(data, variables, ctx);
      }
    },
    ...opts,
  });
}

export function useTagDelete(
  opts: UseMutationOptions<void, unknown, { id: string }> = {}
) {
  return useMutation({
    ...opts,
    mutationFn: (data: { id: string }) =>
      API.del("tags", urlJoin("/tags", data.id.toString()), {}),
  });
}
