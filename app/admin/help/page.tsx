"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Home,
  Award,
  PenSquare,
  Search,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Image,
  FileText,
  Globe,
} from "lucide-react";

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  steps: { heading: string; body: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    title: "Dashboard — Your Blog Posts",
    steps: [
      {
        heading: "What you see",
        body: "Every post you have ever created shows here — both drafts and published posts. Published posts are live on your site. Drafts are hidden from visitors.",
      },
      {
        heading: "Edit a post",
        body: "Click the Edit button (pencil icon) on any post to open it in the editor. You can change the title, content, images, SEO settings — everything.",
      },
      {
        heading: "Publish or unpublish",
        body: "Click the toggle button next to any post to switch it between Draft and Published instantly. No save needed.",
      },
      {
        heading: "Set the Featured Review",
        body: "Click the star icon on a post to make it the Featured Review. This post appears as the large card at the top of your homepage hero section. Only one post can be featured at a time — setting a new one removes the previous one.",
      },
      {
        heading: "Delete a post",
        body: "Click the trash icon to permanently delete a post. This also deletes any images or videos you uploaded inside that post from Firebase Storage. This cannot be undone.",
      },
    ],
  },
  {
    id: "new-post",
    icon: <PenSquare className="w-4 h-4" />,
    title: "New Post — Writing & Publishing",
    steps: [
      {
        heading: "Title",
        body: "Type your post title here. The URL slug (the part after /blog/) is automatically generated from your title as you type. You can edit the slug manually if you want a shorter URL.",
      },
      {
        heading: "Category",
        body: "Pick one: Reviews, Tutorials, Case Studies, Tools, or News. This determines which category filter the post appears under on the homepage.",
      },
      {
        heading: "Status",
        body: "Leave it as Draft while you are writing. Flip to Published when it is ready to go live. You can also use the Publish button at the bottom to publish in one click.",
      },
      {
        heading: "Excerpt",
        body: "A short summary (max 160 characters) shown on the post cards throughout your site and in Google search results. Write something that makes people want to click.",
      },
      {
        heading: "Featured Image",
        body: "Upload a cover image for the post. This shows at the top of the post and on post cards. Best size: 1200 × 630 pixels (landscape). Stored in Firebase Storage — deleted automatically if you delete the post.",
      },
      {
        heading: "Content Editor",
        body: "This is your main writing area. Use the toolbar at the top to format text: Bold, Italic, Headings (H1-H3), bullet lists, numbered lists, blockquotes, links, and code blocks.",
      },
      {
        heading: "Adding images inside content",
        body: "Click the image icon in the toolbar, then upload an image from your computer. It uploads to Firebase Storage and embeds in the post automatically.",
      },
      {
        heading: "Adding YouTube videos",
        body: "Click the YouTube icon in the toolbar, paste the full YouTube URL (e.g. https://youtube.com/watch?v=...) and press Enter. The video embeds directly in your post.",
      },
      {
        heading: "Adding video files",
        body: "Click the video icon in the toolbar and upload an MP4 file from your computer. It uploads to Firebase Storage and plays inline in your post.",
      },
      {
        heading: "Auto-save",
        body: "If the post already exists (you created it before), the editor saves your work automatically every 30 seconds. You will see 'Saved' appear near the top. New posts are only saved when you click Save as Draft or Publish.",
      },
      {
        heading: "AI Assist panel",
        body: "Click 'AI Assist' to expand the panel. Add a title first, then click any button: Suggest Excerpt fills in your excerpt, Suggest SEO Title fills in the SEO title, Suggest Meta Description fills in the meta description, and Title Variants gives you 3 alternative headlines to choose from. Powered by OpenAI gpt-4o-mini.",
      },
      {
        heading: "SEO Settings panel",
        body: "Click 'SEO Settings' to expand. SEO Title Override: what appears as the clickable blue link in Google (defaults to your post title if empty). Meta Description Override: the grey text shown under the link in Google (defaults to your excerpt if empty). Keep both under 160 characters.",
      },
    ],
  },
  {
    id: "homepage",
    icon: <Home className="w-4 h-4" />,
    title: "Homepage — Managing Your Sections",
    steps: [
      {
        heading: "What this page does",
        body: "Your homepage has two sections you control here: Editor's Top Picks (3 cards shown after the trust strip) and The Money Pages / Pillar Grid (6 cards further down the page). Both pull live from Firestore — saving here updates the site instantly.",
      },
      {
        heading: "Editor's Top Picks (max 3 posts)",
        body: "These are the 3 most important posts you want visitors to see first — your best reviews or comparison articles. Click any published post to add it. The number badge shows the display order. Click again to remove it.",
      },
      {
        heading: "The Money Pages (max 6 posts)",
        body: "These are your 6 cornerstone comparison posts — the articles that drive affiliate clicks. Same system: click to add (up to 6), click again to remove.",
      },
      {
        heading: "Draft posts are greyed out",
        body: "Only published posts can be added to homepage sections. If a post appears greyed out with a 'Draft' label, go to Dashboard and publish it first, then come back here.",
      },
      {
        heading: "Save Changes",
        body: "Nothing saves automatically here. Click the gold Save Changes button at the top right when you are done selecting posts. The homepage updates immediately after saving.",
      },
    ],
  },
  {
    id: "aistack",
    icon: <Award className="w-4 h-4" />,
    title: "AI Stack 2026 — The /best-ai-tools-2026 Page",
    badge: "Money page",
    steps: [
      {
        heading: "What this page manages",
        body: "The /best-ai-tools-2026 page is your main money page — the ranked list of AI tools that drives affiliate traffic. Everything shown there is managed here. Nothing is hardcoded.",
      },
      {
        heading: "Adding a new entry",
        body: "Click Add Entry. Fill in: Category Label (e.g. 'All-in-One Marketing'), Winner (e.g. 'GoHighLevel'), Runner-up, Verdict (your 2–3 sentence review), up to 3 Pros, a Score out of 10, and the 'Full comparison' link (the URL the button points to — usually a /blog/ post or /category/ page). Click Apply to add it to the list.",
      },
      {
        heading: "Editing an entry",
        body: "Click the Edit button on any entry row. Change what you need, then click Apply. The entry is updated in the list but not saved to the live site yet.",
      },
      {
        heading: "Reordering entries",
        body: "Use the ↑ and ↓ arrows on each row to move entries up or down. The rank number updates automatically. #1 appears at the top of the page.",
      },
      {
        heading: "Deleting an entry",
        body: "Click the trash icon on any row. It is removed from the list immediately but not deleted from the live site until you save.",
      },
      {
        heading: "Save Changes",
        body: "Like the Homepage page, nothing is live until you click Save Changes. After saving, the /best-ai-tools-2026 page updates immediately for all visitors.",
      },
      {
        heading: "Score tips",
        body: "Use a score between 7.0 and 10.0. Scores below 7 suggest you would not recommend the tool. A score of 9.0–9.5 signals a strong recommendation without looking like everything is perfect.",
      },
    ],
  },
  {
    id: "analytics",
    icon: <BarChart2 className="w-4 h-4" />,
    title: "Analytics — Real-Time Traffic",
    steps: [
      {
        heading: "What is tracked",
        body: "Every page view on your public site is recorded in Firestore — homepage, blog posts, category pages. Admin pages are excluded. Duplicate views from the same visitor in the same session are not counted (so refreshing a page does not inflate numbers).",
      },
      {
        heading: "Today's stats",
        body: "The four stat cards at the top show: total views today, total views this week, total views all time, and number of published posts.",
      },
      {
        heading: "7-day chart",
        body: "The bar chart shows daily view counts for the past 7 days. Hover over a bar to see the exact number.",
      },
      {
        heading: "Top Posts",
        body: "The list below the chart ranks your blog posts by views in the last 7 days. Use this to see which reviews are getting the most traffic — those are your money pages.",
      },
      {
        heading: "Live Feed",
        body: "The right column shows the last 20 page views in real time as they happen — including which page was visited and how long ago. This updates automatically without refreshing.",
      },
    ],
  },
  {
    id: "search",
    icon: <Search className="w-4 h-4" />,
    title: "Search Bar — How It Works",
    steps: [
      {
        heading: "Where it is",
        body: "The search bar is centered in the top navigation bar on every public page. On mobile it appears as a full-width bar directly below the logo.",
      },
      {
        heading: "How results are found",
        body: "When a visitor types and pauses for 0.5 seconds, the search sends the query to OpenAI (gpt-4o-mini) along with your published post titles, excerpts, and categories. OpenAI ranks the most relevant posts and returns up to 5 results.",
      },
      {
        heading: "Fallback behaviour",
        body: "If OpenAI is unavailable, the search automatically falls back to simple keyword matching against titles and excerpts. Results still appear — they are just not AI-ranked.",
      },
      {
        heading: "Cost",
        body: "Each search uses roughly $0.0001 of OpenAI credit (about 1,000 searches per $0.10). The OpenAI key is stored securely in Firebase Secret Manager.",
      },
      {
        heading: "Making posts more searchable",
        body: "Write clear, specific excerpts for every post. The AI uses titles and excerpts to rank results — a vague excerpt means the post is harder to find via search.",
      },
    ],
  },
  {
    id: "newsletter",
    icon: <Mail className="w-4 h-4" />,
    title: "Newsletter Subscribers",
    steps: [
      {
        heading: "Where sign-ups go",
        body: "When a visitor enters their email in the 'Get the AI Stack 2026 Checklist' form on your homepage and clicks Subscribe, their email is saved to Firebase → Firestore → newsletter collection.",
      },
      {
        heading: "How to see subscribers",
        body: "Go to console.firebase.google.com → your project → Firestore Database → newsletter collection. Each document contains the email address and the date they subscribed.",
      },
      {
        heading: "Sending emails",
        body: "No email is sent automatically right now. To send a newsletter, export the emails from Firestore and paste them into a free tool like Mailchimp, ConvertKit, or Beehiiv. You can connect a proper email service later.",
      },
    ],
  },
  {
    id: "contact",
    icon: <MessageSquare className="w-4 h-4" />,
    title: "Contact Form Submissions",
    steps: [
      {
        heading: "Where messages go",
        body: "Every message submitted through the /contact page is saved to Firebase → Firestore → contacts collection. Each document contains the sender's name, email, reason, and message.",
      },
      {
        heading: "Email notifications",
        body: "If your Gmail credentials (GMAIL_USER and GMAIL_APP_PASSWORD) are set up in Firebase Secret Manager, you will also receive an email in your Gmail inbox for every submission. The email has Reply-To set to the sender, so you can reply directly from Gmail.",
      },
      {
        heading: "How to see all messages",
        body: "Go to console.firebase.google.com → your project → Firestore Database → contacts collection. Messages are stored there permanently.",
      },
    ],
  },
  {
    id: "seo",
    icon: <Globe className="w-4 h-4" />,
    title: "SEO — How Your Site Ranks",
    steps: [
      {
        heading: "Every blog post has its own meta tags",
        body: "When you publish a post, the title and excerpt automatically become the <title> and meta description for that page — what Google and AI search engines like Perplexity show in results.",
      },
      {
        heading: "Override SEO per post",
        body: "Open any post, scroll to SEO Settings, and fill in the SEO Title and Meta Description fields. These override the defaults. Use this when you want a shorter or more keyword-focused title in Google than what appears on the page.",
      },
      {
        heading: "Use the AI Assist for SEO",
        body: "In the post editor, open AI Assist and click 'Suggest SEO Title' or 'Suggest Meta Description'. The AI writes them based on your post title and excerpt. You can edit the suggestion before saving.",
      },
      {
        heading: "The /best-ai-tools-2026 page",
        body: "This page already has proper title and description meta tags hardcoded. It is your most important page for organic traffic — keep the content detailed and update it regularly.",
      },
      {
        heading: "Firestore rules must be deployed",
        body: "If you ever update the firestore.rules file, run 'firebase deploy --only firestore:rules' in your terminal. Without this, some features (homepage sections, search, newsletter) will fail silently for visitors.",
      },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string | null>("dashboard");

  function toggle(id: string) {
    setOpen((prev) => (prev === id ? null : id));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Info className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
            Help &amp; Guide
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about running your Glafix site — in plain language.
          </p>
        </div>
      </div>

      {SECTIONS.map((section) => {
        const isOpen = open === section.id;
        return (
          <div
            key={section.id}
            className={`bg-card border rounded-xl overflow-hidden transition-colors ${
              isOpen ? "border-primary/30" : "border-border"
            }`}
          >
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <span className={`${isOpen ? "text-primary" : "text-muted-foreground"} transition-colors`}>
                {section.icon}
              </span>
              <span className="flex-1 text-sm font-semibold text-foreground">{section.title}</span>
              {section.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-background bg-primary rounded px-1.5 py-0.5">
                  {section.badge}
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Steps */}
            {isOpen && (
              <div className="border-t border-border divide-y divide-border/50">
                {section.steps.map((step, i) => (
                  <div key={i} className="px-5 py-4 flex gap-4">
                    <span className="text-xs font-bold text-primary/40 w-5 shrink-0 pt-0.5 text-right">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{step.heading}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Quick reference footer */}
      <div className="mt-8 p-5 bg-muted/10 border border-border rounded-xl space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Quick Reference</p>
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            { icon: <FileText className="w-3.5 h-3.5" />, label: "All posts visible regardless of status in Dashboard" },
            { icon: <Sparkles className="w-3.5 h-3.5" />, label: "AI Assist needs a post title before it can suggest anything" },
            { icon: <Image className="w-3.5 h-3.5" />, label: "Deleting a post also deletes all uploaded images/videos" },
            { icon: <Globe className="w-3.5 h-3.5" />, label: "YouTube embeds do not use your storage — they stream from YouTube" },
            { icon: <Home className="w-3.5 h-3.5" />, label: "Homepage and AI Stack sections only go live after clicking Save Changes" },
            { icon: <Globe className="w-3.5 h-3.5" />, label: "After editing firestore.rules, run: firebase deploy --only firestore:rules" },
          ].map(({ icon, label }, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
