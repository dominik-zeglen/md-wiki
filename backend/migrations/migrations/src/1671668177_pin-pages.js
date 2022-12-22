export async function up(db) {
    await db.schema
        .alterTable("pages")
        .addColumn("highlighted", "boolean", (col) => col.notNull().defaultTo(false))
        .execute();
}
export async function down(db) {
    await db.schema.alterTable("pages").dropColumn("highlighted").execute();
}
