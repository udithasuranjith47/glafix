# Glafix — High-Ticket AI SaaS Blog

A premium editorial blog platform built with Next.js 16, Firebase, and TipTap.
Dark luxury aesthetic with gold accents, full admin CMS, and rich text editing.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Editor | TipTap v3 |
| Fonts | Playfair Display + DM Sans |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project
2. Enable **Firestore Database** (start in production mode)
3. Enable **Firebase Storage**
4. Enable **Authentication** → Email/Password provider
5. Register a **Web App** and copy your config values

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your Firebase config values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Create your admin user

In the Firebase Console → Authentication → Users, click **Add User** and create your admin email/password.

### 5. Deploy Firestore rules and indexes

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public blog.
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Firestore Composite Indexes

The `firestore.indexes.json` file pre-defines the composite indexes needed:
- `status + publishedAt` — for the main post feed
- `status + category + publishedAt` — for category filtering

Deploy them with `firebase deploy --only firestore:indexes`.

---

## Deploying to Firebase Hosting

### Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Initialize hosting (first time only)

```bash
firebase init hosting
# Select: "Use existing project" → your project
# Select: "Use a web framework" → Next.js
```

### Deploy

```bash
npm run build
firebase deploy
```

Your live URL will be `https://your-project-id.web.app`.

---

## Project Structure

```
app/
├── page.tsx                    # Homepage
├── not-found.tsx               # 404 page
├── blog/[slug]/page.tsx        # Single post
├── category/[category]/page.tsx # Category archive
└── admin/
    ├── layout.tsx              # Admin shell (auth guard)
    ├── login/page.tsx          # Login
    ├── dashboard/page.tsx      # Post list
    └── posts/
        ├── new/page.tsx        # Create post
        └── [id]/edit/page.tsx  # Edit post

components/
├── public/                     # Blog-facing components
│   ├── Navbar, Footer, HeroSection
│   ├── PostCard, PostGrid
│   ├── CategoryFilter, LoadingSkeleton
│   ├── ReadingProgress, TableOfContents
│   ├── RelatedPosts, ShareButtons
└── admin/                      # CMS components
    ├── AdminNav, StatsCard
    ├── PostsTable, PostForm
    ├── RichTextEditor, ImageUploader

lib/
├── firebase.js                 # Firebase initialization
├── firestore.ts                # Firestore CRUD helpers
└── utils.ts                    # Utilities (slugify, readTime, etc.)

hooks/
├── useAuth.ts                  # Firebase Auth hook + session cookie
└── useAutoSave.ts              # 30s auto-save hook
```

---

## URL Structure

| URL | Page |
|-----|------|
| `/` | Homepage with featured post + grid |
| `/blog/[slug]` | Full article with TOC, share, related |
| `/category/[category]` | Filtered post archive |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Post management table |
| `/admin/posts/new` | Rich text post creator |
| `/admin/posts/[id]/edit` | Post editor with auto-save |

---

## Admin Features

- **Rich text editor** — TipTap with full toolbar (bold, italic, headings, lists, quotes, code, images, links, alignment)
- **Drag-and-drop image upload** — to Firebase Storage with progress indicator
- **Auto-save** — saves draft to Firestore every 30 seconds
- **Inline image insertion** — upload images directly inside the editor
- **SEO controls** — per-post title and meta description overrides
- **Slug auto-generation** — real-time from title, editable
- **Character counter** — on excerpt and SEO description fields
- **Publish / Unpublish toggle** — one click from the dashboard table

---

## Public Blog Features

- Premium dark luxury aesthetic (Playfair Display + DM Sans + gold accents)
- Reading progress bar
- Auto-generated table of contents from H2/H3 headings
- Social share buttons (Twitter/X, LinkedIn, Copy Link)
- Related posts section (same category)
- Load More pagination
- Loading skeleton states
- Mobile responsive on all pages
- Fade-in animations

<!-- pipeline test 2026-05-07T04:59:18Z -->
