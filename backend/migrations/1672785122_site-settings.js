export async function up(db) {
    await db.schema
        .createTable("site_settings")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().primaryKey())
        .addColumn("name", "varchar(255)", (col) => col.notNull().defaultTo("md-wiki"))
        .execute();
    await db
        .insertInto("site_settings")
        .values({})
        .execute();
}
export async function down(db) {
    await db.schema.dropTable("site_settings");
}
