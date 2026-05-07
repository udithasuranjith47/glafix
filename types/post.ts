import { Timestamp } from "firebase/firestore";

export type PostCategory =
  | "Reviews"
  | "Tutorials"
  | "Case Studies"
  | "Tools"
  | "News";

export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: PostCategory;
  status: PostStatus;
  featured: boolean;
  excerpt: string;
  featuredImage: string;
  content: string;
  readTime: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}

export type PostFormData = Omit<Post, "id" | "createdAt" | "updatedAt" | "publishedAt" | "readTime" | "featured">;
