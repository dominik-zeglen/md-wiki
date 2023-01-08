export async function up(db) {
    await Promise.all(["s3BucketName", "s3AccessKeyId", "s3SecretAccessKey", "s3Region"].map((column) => db.schema
        .alterTable("site_settings")
        .addColumn(column, "varchar(256)")
        .execute()));
}
export async function down(db) {
    await Promise.all(["s3BucketName", "s3AccessKeyId", "s3SecretAccessKey", "s3Region"].map((column) => db.schema.alterTable("site_settings").dropColumn(column).execute()));
}
