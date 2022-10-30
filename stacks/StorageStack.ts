import { StackContext, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  const table = new Table(stack, "Pages", {
    fields: {
      createdAt: "number",
      updatedAt: "number",
      createdBy: "string",
      updatedBy: "string",

      slug: "string",
      title: "string",
      content: "string",
      canBeDeleted: "number",
    },
    primaryIndex: { partitionKey: "slug" },
  });

  return {
    table,
  };
}
