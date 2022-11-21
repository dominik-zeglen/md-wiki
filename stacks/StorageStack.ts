import { StackContext, RDS } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  const cluster = new RDS(stack, "mdWikiDB", {
    engine: "mysql5.7",
    defaultDatabaseName: "mdWiki",
    migrations: "services/migrations",
    scaling: {
      autoPause: true,
      maxCapacity: "ACU_1",
      minCapacity: "ACU_1",
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
