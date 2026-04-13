export interface Bookmark {
  id: number;
  title: string;
  link: string;
  excerpt: string;
  cover: string;
  created: string;
  domain: string;
  raindropTags: string[];
  aiTags: string[];
}

export interface RaindropItem {
  _id: number;
  title: string;
  link: string;
  excerpt: string;
  cover: string;
  created: string;
  domain: string;
  tags: string[];
  note: string;
  type: string;
  media: { link: string }[];
}

export interface RaindropResponse {
  result: boolean;
  items: RaindropItem[];
  count: number;
  collectionId: number;
}
