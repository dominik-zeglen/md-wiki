import { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface M2mTagsPages {
  page: string;
  tag: number;
}

export interface PageReferences {
  referenced_by: string;
  references: string;
}

export interface Pages {
  content: string;
  createdAt: Date;
  createdBy: string | null;
  highlighted: Generated<number>;
  slug: string;
  title: string;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface Tags {
  createdAt: Date;
  createdBy: string | null;
  id: Generated<number>;
  name: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface Users {
  displayName: string | null;
  hash: string;
  username: string;
}

export interface DB {
  m2m_tags_pages: M2mTagsPages;
  page_references: PageReferences;
  pages: Pages;
  tags: Tags;
  users: Users;
}
