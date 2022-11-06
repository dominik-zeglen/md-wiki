import { ColumnType,  RawBuilder } from 'kysely';

export type Timestamp = ColumnType<Date | RawBuilder, Date | string | RawBuilder, Date | string | RawBuilder>;

export interface Pages {
  content: string | null;
  createdAt: Timestamp | null;
  createdBy: string | null;
  slug: string;
  title: string | null;
  updatedAt: Timestamp | null;
  updatedBy: string | null;
}

export interface Database {
  pages: Pages;
}
