import { StackContext, RDS } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  const cluster = new RDS(stack, "mdWikiDB", {
    engine: "postgresql11.13",
    defaultDatabaseName: "mdWiki",
    migrations: "services/migrations",
    scaling: {
      autoPause: true,
      maxCapacity: "ACU_2",
      minCapacity: "ACU_2",
    },
    types: "services/repository/db.d.ts",
  });

  stack.addOutputs({
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });

  return {
    cluster,
  };
}
