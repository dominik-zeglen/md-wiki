import { ColumnType,  RawBuilder } from 'kysely';

export type Timestamp = ColumnType<Date | RawBuilder, Date | string | RawBuilder, Date | string | RawBuilder>;

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

export interface MdWikiTags {
  createdAt: Timestamp;
  createdBy: string | null;
  name: string;
  slug: string;
  updatedAt: Timestamp;
  updatedBy: string | null;
}

export interface Database {
  "mdWiki.m2m_tags_pages": MdWikiM2mTagsPages;
  "mdWiki.pages": MdWikiPages;
  "mdWiki.tags": MdWikiTags;
}
