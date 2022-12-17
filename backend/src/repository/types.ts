import { ColumnType, RawBuilder } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<
  Date | RawBuilder,
  Date | string | RawBuilder,
  Date | string | RawBuilder
>;

export interface MdWikiM2mTagsPages {
  page: string;
  tag: string;
}

export interface MdWikiPages {
  content: string;
  createdAt: Timestamp;
  createdBy: string | null;
  slug: string;
  title: string;
  updatedAt: Timestamp;
  updatedBy: string | null;
}

export interface MdWikiPageReferences {
  referenced_by: string;
  references: string;
}

export interface MdWikiTags {
  createdAt: Timestamp;
  createdBy: string | null;
  id: Generated<string>;
  name: string | null;
  updatedAt: Timestamp;
  updatedBy: string | null;
}

export interface MdWikiUsers {
  displayName: string | null;
  username: string;
  hash: string;
}

export interface Database {
  "mdWiki.m2m_tags_pages": MdWikiM2mTagsPages;
  "mdWiki.pages": MdWikiPages;
  "mdWiki.page_references": MdWikiPageReferences;
  "mdWiki.tags": MdWikiTags;
  "mdWiki.users": MdWikiUsers;
}
