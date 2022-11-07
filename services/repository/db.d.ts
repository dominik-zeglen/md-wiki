import { ColumnType,  RawBuilder } from 'kysely';

export type Timestamp = ColumnType<Date | RawBuilder, Date | string | RawBuilder, Date | string | RawBuilder>;

export interface Pages {
  content: string;
  createdAt: Timestamp;
  createdBy: string | null;
  slug: string;
  title: string;
  updatedAt: Timestamp;
  updatedBy: string | null;
}

export interface Database {
  pages: Pages;
}
