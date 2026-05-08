import { Timestamp } from "firebase/firestore";

export type PostCategory =
  | "Tool Review"
  | "Comparison"
  | "Best Of"
  | "Tutorial"
  | "Pricing & Value"
  | "Alternatives"
  | "By Industry"
  | "By Role"
  | "By Task"
  | "Prompting Guide"
  | "Automation"
  | "AI News"
  | "Statistics"
  | "Case Study"
  | "Beginner Guide"
  | "AI vs Human"
  | "Free Resources"
  | "Content Creation";

export type CategoryGroup =
  | "Reviews"
  | "Roundups"
  | "How-To"
  | "Pricing & News"
  | "Case Studies";

export interface CategoryGroupDef {
  label: CategoryGroup;
  colorClass: string;
  dotClass: string;
  hint: string;
  categories: { value: PostCategory; hint: string }[];
}

export const CATEGORY_GROUPS: CategoryGroupDef[] = [
  {
    label: "Reviews",
    colorClass: "text-blue-400",
    dotClass: "bg-blue-400",
    hint: "High buyer intent — credit card already out",
    categories: [
      { value: "Tool Review",  hint: "Deep dive on one tool" },
      { value: "Comparison",   hint: "Tool A vs Tool B vs Tool C" },
      { value: "Alternatives", hint: "Switchers searching for something better" },
      { value: "AI vs Human",  hint: "Viral, high-engagement debates" },
    ],
  },
  {
    label: "Roundups",
    colorClass: "text-green-400",
    dotClass: "bg-green-400",
    hint: "High traffic + shareability, easy to rank",
    categories: [
      { value: "Best Of",        hint: "Best AI tools for [use case]" },
      { value: "By Industry",    hint: "AI for real estate, law, healthcare…" },
      { value: "By Role",        hint: "AI tools for CEOs, VAs, designers…" },
      { value: "By Task",        hint: "AI writing, SEO, email, video…" },
      { value: "Free Resources", hint: "Free tool lists — earns backlinks naturally" },
    ],
  },
  {
    label: "How-To",
    colorClass: "text-orange-400",
    dotClass: "bg-orange-400",
    hint: "Highest search volume — 'how to' is #1",
    categories: [
      { value: "Tutorial",          hint: "How to use [tool] for [task]" },
      { value: "Prompting Guide",   hint: "Best prompts for [tool / use case]" },
      { value: "Automation",        hint: "Workflows — Make, Zapier, n8n" },
      { value: "Beginner Guide",    hint: "What is X? AI explained simply" },
      { value: "Content Creation",  hint: "AI for blogs, YouTube, newsletters" },
    ],
  },
  {
    label: "Pricing & News",
    colorClass: "text-yellow-400",
    dotClass: "bg-yellow-400",
    hint: "Research intent — people always check pricing",
    categories: [
      { value: "Pricing & Value", hint: "Every plan explained, is it worth it?" },
      { value: "AI News",         hint: "New features, price changes, shutdowns" },
      { value: "Statistics",      hint: "Data posts — best backlink magnets" },
    ],
  },
  {
    label: "Case Studies",
    colorClass: "text-pink-400",
    dotClass: "bg-pink-400",
    hint: "Highest trust — Google loves first-person data",
    categories: [
      { value: "Case Study", hint: "Real results, before/after, income reports" },
    ],
  },
];

export const GROUP_CATEGORY_MAP: Record<CategoryGroup, PostCategory[]> =
  Object.fromEntries(
    CATEGORY_GROUPS.map((g) => [g.label, g.categories.map((c) => c.value)])
  ) as Record<CategoryGroup, PostCategory[]>;

export const CATEGORY_GROUP_MAP: Record<PostCategory, CategoryGroup> =
  Object.fromEntries(
    CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c.value, g.label]))
  ) as Record<PostCategory, CategoryGroup>;

export const ALL_CATEGORY_VALUES = CATEGORY_GROUPS.flatMap((g) =>
  g.categories.map((c) => c.value)
) as [PostCategory, ...PostCategory[]];

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
