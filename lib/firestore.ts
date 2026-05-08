import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { Post, PostCategory, PostFormData } from "@/types/post";

function extractStorageUrls(html: string): string[] {
  const matches = html.match(/https:\/\/firebasestorage\.googleapis\.com\/[^"'\s>)]+/g);
  return [...new Set(matches ?? [])];
}

function storagePathFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/o\/([^?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

const POSTS_COLLECTION = "posts";

function docToPost(docSnap: DocumentSnapshot | QueryDocumentSnapshot): Post {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    title: data.title,
    slug: data.slug,
    category: data.category,
    status: data.status,
    featured: data.featured === true,
    excerpt: data.excerpt,
    featuredImage: data.featuredImage || "",
    content: data.content,
    readTime: data.readTime || 1,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt || null,
  };
}

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export async function getSearchablePosts(): Promise<PostMeta[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    slug: d.data().slug as string,
    title: d.data().title as string,
    excerpt: (d.data().excerpt as string) ?? "",
    category: (d.data().category as string) ?? "",
  }));
}

export async function getPublishedPosts(
  pageSize = 9,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot | null }> {
  let q = query(
    collection(db, POSTS_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, POSTS_COLLECTION),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(docToPost);
  const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return { posts, lastDoc: last };
}

export async function getPublishedPostsByCategory(
  category: PostCategory | PostCategory[],
  pageSize = 9,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot | null }> {
  const categoryFilter = Array.isArray(category)
    ? where("category", "in", category)
    : where("category", "==", category);

  let q = query(
    collection(db, POSTS_COLLECTION),
    where("status", "==", "published"),
    categoryFilter,
    orderBy("publishedAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, POSTS_COLLECTION),
      where("status", "==", "published"),
      categoryFilter,
      orderBy("publishedAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(docToPost);
  const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return { posts, lastDoc: last };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published")
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return docToPost(snapshot.docs[0]);
}

export async function getPostById(id: string): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docToPost(docSnap);
}

export async function getRelatedPosts(
  category: PostCategory | PostCategory[],
  excludeSlug: string,
  count = 3
): Promise<Post[]> {
  const categoryFilter = Array.isArray(category)
    ? where("category", "in", category)
    : where("category", "==", category);

  const q = query(
    collection(db, POSTS_COLLECTION),
    where("status", "==", "published"),
    categoryFilter,
    orderBy("publishedAt", "desc"),
    limit(count + 1)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(docToPost)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, count);
}

export async function getFeaturedPost(): Promise<Post | null> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where("featured", "==", true),
    where("status", "==", "published"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return docToPost(snapshot.docs[0]);
}

export async function setFeaturedPost(id: string): Promise<void> {
  const batch = writeBatch(db);
  // Clear any existing featured posts
  const currentFeatured = await getDocs(
    query(collection(db, POSTS_COLLECTION), where("featured", "==", true))
  );
  currentFeatured.docs.forEach((d) => batch.update(d.ref, { featured: false }));
  // Set the new featured post
  batch.update(doc(db, POSTS_COLLECTION, id), { featured: true });
  await batch.commit();
}

export async function getAllPosts(): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToPost);
}

export async function createPost(data: PostFormData): Promise<string> {
  const wordCount = data.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...data,
    readTime,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });

  return docRef.id;
}

export async function updatePost(id: string, data: Partial<PostFormData>): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const existing = await getDoc(docRef);

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.content) {
    const wordCount = data.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
    updateData.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  if (data.status === "published" && existing.data()?.status === "draft") {
    updateData.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updateData);
}

export async function deletePost(id: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();
    const urls: string[] = [];
    if (data.featuredImage) urls.push(data.featuredImage);
    if (data.content) urls.push(...extractStorageUrls(data.content));

    await Promise.allSettled(
      urls
        .filter((u) => u.includes("firebasestorage.googleapis.com"))
        .map((url) => {
          const path = storagePathFromUrl(url);
          return path ? deleteObject(storageRef(storage, path)) : Promise.resolve();
        })
    );
  }

  await deleteDoc(docRef);
}

export async function togglePostStatus(id: string, currentStatus: string): Promise<void> {
  const newStatus = currentStatus === "published" ? "draft" : "published";
  const update: Record<string, unknown> = { status: newStatus, updatedAt: serverTimestamp() };
  if (newStatus === "published") update.publishedAt = serverTimestamp();
  await updateDoc(doc(db, POSTS_COLLECTION, id), update);
}

export interface AiStackEntry {
  id: string;
  rank: number;
  category: string;
  winner: string;
  runnerUp: string;
  verdict: string;
  pros: string[];
  href: string;
  score: number;
}

export async function getAiStack(): Promise<AiStackEntry[]> {
  const docSnap = await getDoc(doc(db, "config", "aistack"));
  if (!docSnap.exists()) return [];
  return (docSnap.data().entries ?? []) as AiStackEntry[];
}

export async function setAiStack(entries: AiStackEntry[]): Promise<void> {
  await setDoc(doc(db, "config", "aistack"), { entries });
}

export async function getHomepageConfig(): Promise<{ topPicks: string[]; pillars: string[] }> {
  const docSnap = await getDoc(doc(db, "config", "homepage"));
  if (!docSnap.exists()) return { topPicks: [], pillars: [] };
  const data = docSnap.data();
  return { topPicks: data.topPicks ?? [], pillars: data.pillars ?? [] };
}

export async function setHomepageConfig(config: { topPicks: string[]; pillars: string[] }): Promise<void> {
  await setDoc(doc(db, "config", "homepage"), config);
}

export async function getPostsByIds(ids: string[]): Promise<Post[]> {
  if (!ids.length) return [];
  const snaps = await Promise.all(ids.map((id) => getDoc(doc(db, POSTS_COLLECTION, id))));
  return snaps.filter((d) => d.exists()).map((d) => docToPost(d));
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(collection(db, POSTS_COLLECTION), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;
  if (excludeId && snapshot.docs.every((d) => d.id === excludeId)) return false;
  return true;
}
