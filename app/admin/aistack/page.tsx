"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, ChevronUp, ChevronDown, Award, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAiStack, setAiStack, AiStackEntry } from "@/lib/firestore";

const EMPTY_ENTRY: Omit<AiStackEntry, "id"> = {
  rank: 1,
  category: "",
  winner: "",
  runnerUp: "",
  verdict: "",
  pros: ["", "", ""],
  href: "/best-ai-tools-2026",
  score: 9.0,
};

function newEntry(rank: number): AiStackEntry {
  return { ...EMPTY_ENTRY, id: crypto.randomUUID(), rank, pros: ["", "", ""] };
}

export default function AiStackPage() {
  const [entries, setEntries] = useState<AiStackEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AiStackEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAiStack()
      .then((data) => setEntries(data.sort((a, b) => a.rank - b.rank)))
      .catch(() => toast.error("Failed to load entries"))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(entry: AiStackEntry) {
    setEditingId(entry.id);
    setDraft({ ...entry, pros: [...(entry.pros ?? ["", "", ""])] });
  }

  function startAdd() {
    const e = newEntry(entries.length + 1);
    setEditingId(e.id);
    setDraft(e);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function applyDraft() {
    if (!draft) return;
    const cleaned = { ...draft, pros: draft.pros.filter(Boolean) };
    setEntries((prev) => {
      const exists = prev.find((e) => e.id === draft.id);
      return exists
        ? prev.map((e) => (e.id === draft.id ? cleaned : e))
        : [...prev, cleaned];
    });
    setEditingId(null);
    setDraft(null);
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancelEdit();
  }

  function moveEntry(id: string, dir: -1 | 1) {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr.map((e, i) => ({ ...e, rank: i + 1 }));
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));
      await setAiStack(ranked);
      setEntries(ranked);
      toast.success("AI Stack 2026 saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
              AI Stack 2026
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage the ranked tool categories shown on /best-ai-tools-2026.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={startAdd}
            disabled={editingId !== null}
            className="gap-2 border-border"
          >
            <Plus className="w-4 h-4" /> Add Entry
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || editingId !== null}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {entries.length === 0 && editingId === null && (
        <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          No entries yet. Click &ldquo;Add Entry&rdquo; to create your first ranked tool.
        </div>
      )}

      {/* Entry list */}
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div key={entry.id}>
            {editingId === entry.id && draft ? (
              <EntryForm
                draft={draft}
                onChange={setDraft}
                onSave={applyDraft}
                onCancel={cancelEdit}
              />
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <span className="text-xl font-bold text-primary/30 w-8 shrink-0 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
                  #{entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{entry.category || <span className="text-muted-foreground italic">Untitled</span>}</p>
                  <p className="text-xs text-muted-foreground truncate">Winner: {entry.winner} · Score: {entry.score}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveEntry(entry.id, -1)} disabled={idx === 0} className="p-1.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveEntry(entry.id, 1)} disabled={idx === entries.length - 1} className="p-1.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => startEdit(entry)} className="px-3 py-1.5 rounded text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors ml-1">
                    Edit
                  </button>
                  <button onClick={() => deleteEntry(entry.id)} className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New entry form (not yet in list) */}
        {editingId && !entries.find((e) => e.id === editingId) && draft && (
          <EntryForm
            draft={draft}
            onChange={setDraft}
            onSave={applyDraft}
            onCancel={cancelEdit}
          />
        )}
      </div>
    </div>
  );
}

function EntryForm({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: AiStackEntry;
  onChange: (d: AiStackEntry) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  function set<K extends keyof AiStackEntry>(key: K, val: AiStackEntry[K]) {
    onChange({ ...draft, [key]: val });
  }

  function setPro(i: number, val: string) {
    const pros = [...draft.pros];
    pros[i] = val;
    onChange({ ...draft, pros });
  }

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-xl" />
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-foreground">
          {draft.category || "New Entry"}
        </p>
        <button onClick={onCancel} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Category Label</Label>
          <Input value={draft.category} onChange={(e) => set("category", e.target.value)} placeholder="All-in-One Marketing & CRM" className="bg-muted/20 border-border text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Score (0–10)</Label>
          <Input type="number" min={0} max={10} step={0.1} value={draft.score} onChange={(e) => set("score", parseFloat(e.target.value) || 0)} className="bg-muted/20 border-border text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Winner</Label>
          <Input value={draft.winner} onChange={(e) => set("winner", e.target.value)} placeholder="GoHighLevel" className="bg-muted/20 border-border text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Runner-up</Label>
          <Input value={draft.runnerUp} onChange={(e) => set("runnerUp", e.target.value)} placeholder="ClickFunnels 2.0" className="bg-muted/20 border-border text-sm" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Verdict</Label>
        <Textarea value={draft.verdict} onChange={(e) => set("verdict", e.target.value)} placeholder="Why this tool wins in this category..." rows={3} className="bg-muted/20 border-border resize-none text-sm" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Top 3 Pros</Label>
        <div className="grid sm:grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Input key={i} value={draft.pros[i] ?? ""} onChange={(e) => setPro(i, e.target.value)} placeholder={`Pro ${i + 1}`} className="bg-muted/20 border-border text-sm" />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">&ldquo;Full Comparison&rdquo; Link</Label>
        <Input value={draft.href} onChange={(e) => set("href", e.target.value)} placeholder="/category/Reviews" className="bg-muted/20 border-border text-sm font-mono" />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={onSave} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
          <Save className="w-3.5 h-3.5" /> Apply
        </Button>
        <Button onClick={onCancel} size="sm" variant="ghost" className="text-muted-foreground">
          Cancel
        </Button>
      </div>
    </div>
  );
}
