export interface Bookmark {
  id: number;
  title: string;
  link: string;
  excerpt: string;
  cover: string;
  created: string;
  domain: string;
  /** Display tags (from the database) */
  tags: string[];
  featured: boolean;
  /** Lower sorts first in spotlight (optional, database-backed) */
  spotlightOrder?: number | null;
}
