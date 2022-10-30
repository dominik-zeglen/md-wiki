import { StackContext, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  const table = new Table(stack, "Pages", {
    fields: {
      createdAt: "string",
      updatedAt: "string",
      createdBy: "string",
      updatedBy: "string",

      slug: "string",
      title: "string",
      content: "string",
    },
    primaryIndex: { partitionKey: "slug" },
  });

  return {
    table,
  };
}
