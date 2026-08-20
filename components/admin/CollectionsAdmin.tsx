"use client";

import { useState, useTransition, useMemo, useDeferredValue } from "react";
import { Icon } from "@/components/Icon";
import { createCollection, updateCollection, deleteCollection } from "@/lib/actions/admin";
import type { AdminCollection, AdminBookPick } from "@/lib/supabase/admin_queries";

type Source = { name: string; url: string };

type FormData = {
  title: string;
  description: string;
  icon: string;
  copyright_notice: string;
  sources: Source[];
  book_ids: string[];
};

const emptyForm: FormData = {
  title: "",
  description: "",
  icon: "📚",
  copyright_notice: "",
  sources: [],
  book_ids: [],
};

function CollectionModal({
  open,
  onClose,
  editCollection,
  allBooks,
}: {
  open: boolean;
  onClose: () => void;
  editCollection: AdminCollection | null;
  allBooks: AdminBookPick[];
}) {
  const isEdit = editCollection !== null;
  const [form, setForm] = useState<FormData>(
    isEdit
      ? {
          title: editCollection.title,
          description: editCollection.description,
          icon: editCollection.icon,
          copyright_notice: editCollection.copyright_notice,
          sources: editCollection.sources,
          book_ids: editCollection.book_ids,
        }
      : emptyForm
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const deferredBookSearch = useDeferredValue(bookSearch);
  const [newSource, setNewSource] = useState({ name: "", url: "" });

  if (!open) return null;

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleBook = (id: string) =>
    set(
      "book_ids",
      form.book_ids.includes(id)
        ? form.book_ids.filter((b) => b !== id)
        : [...form.book_ids, id]
    );

  const addSource = () => {
    if (!newSource.name.trim() || !newSource.url.trim()) return;
    set("sources", [...form.sources, newSource]);
    setNewSource({ name: "", url: "" });
  };

  const removeSource = (idx: number) =>
    set("sources", form.sources.filter((_, i) => i !== idx));

  const filteredBooks = useMemo(() => {
    const q = deferredBookSearch.toLowerCase();
    return allBooks.filter((b) =>
      `${b.title_bn} ${b.author_bn ?? ""}`.toLowerCase().includes(q)
    );
  }, [allBooks, deferredBookSearch]);

  const handleSubmit = () => {
    if (!form.title.trim()) { setError("সংগ্রহের নাম দিন।"); return; }
    setError("");
    startTransition(async () => {
      const result = isEdit
        ? await updateCollection(editCollection.id, form)
        : await createCollection(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10">
      <button type="button" aria-label="বন্ধ করুন" className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#dedfd9] bg-white p-6 shadow-xl sm:p-8 mx-4">
        <div className="flex items-center justify-between">
          <h2 className="serif text-xl font-bold">{isEdit ? "সংগ্রহ সম্পাদনা" : "নতুন সংগ্রহ"}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#f0eeea]">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Icon + title */}
          <div className="flex gap-3">
            <label className="block w-24">
              <span className="field-label">আইকন</span>
              <input className="field mt-1 text-center text-2xl" value={form.icon} onChange={(e) => set("icon", e.target.value)} maxLength={2} />
            </label>
            <label className="block flex-1">
              <span className="field-label">সংগ্রহের নাম *</span>
              <input className="field mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="যেমন: রবীন্দ্রনাথের নির্বাচিত রচনা" />
            </label>
          </div>

          <label className="block">
            <span className="field-label">বিবরণ</span>
            <textarea className="field mt-1" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="সংগ্রহটির সম্পর্কে সংক্ষেপে…" />
          </label>

          <label className="block">
            <span className="field-label">কপিরাইট নোট</span>
            <textarea className="field mt-1" rows={2} value={form.copyright_notice} onChange={(e) => set("copyright_notice", e.target.value)} placeholder="প্রকাশের আগে স্বত্বের অবস্থা যাচাই করুন…" />
          </label>

          {/* Sources */}
          <div>
            <span className="field-label block">উৎস</span>
            {form.sources.map((src, i) => (
              <div key={i} className="mt-2 flex items-center gap-2 text-sm">
                <span className="flex-1 truncate font-bold">{src.name}</span>
                <span className="flex-1 truncate text-xs text-[#7d857e]">{src.url}</span>
                <button type="button" onClick={() => removeSource(i)} className="text-red-500 hover:text-red-700"><Icon name="close" size={14} /></button>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <input className="field flex-1" placeholder="উৎসের নাম" value={newSource.name} onChange={(e) => setNewSource((p) => ({ ...p, name: e.target.value }))} />
              <input className="field flex-1" placeholder="https://…" value={newSource.url} onChange={(e) => setNewSource((p) => ({ ...p, url: e.target.value }))} />
              <button type="button" onClick={addSource} className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold">+ যোগ</button>
            </div>
          </div>

          {/* Book picker */}
          <div>
            <span className="field-label block mb-2">বই নির্বাচন করুন ({form.book_ids.length}টি নির্বাচিত)</span>
            <input
              className="field mb-2"
              placeholder="বই খুঁজুন…"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <div className="max-h-52 overflow-y-auto rounded-xl border border-[#dedfd9]">
              {filteredBooks.map((book) => {
                const checked = form.book_ids.includes(book.id);
                return (
                  <label key={book.id} className={`flex cursor-pointer items-center gap-3 border-b border-[#f0eeea] px-4 py-2.5 last:border-0 ${checked ? "bg-[#f5f0ea]" : "hover:bg-[#fafaf8]"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleBook(book.id)} className="accent-[var(--maroon)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{book.title_bn}</span>
                      <span className="block truncate text-xs text-[#7d857e]">{book.author_bn}</span>
                    </span>
                  </label>
                );
              })}
              {filteredBooks.length === 0 && <p className="p-4 text-center text-sm text-[#7d857e]">কোনো বই পাওয়া যায়নি</p>}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-xs font-bold text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#dedfd9] pt-5">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#7d857e] hover:bg-[#f0eeea]">বাতিল</button>
          <button type="button" onClick={handleSubmit} disabled={isPending} className="rounded-xl bg-[#303b36] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {isPending ? "সেভ হচ্ছে…" : isEdit ? "আপডেট করুন" : "তৈরি করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CollectionsAdmin({
  collections,
  allBooks,
}: {
  collections: AdminCollection[];
  allBooks: AdminBookPick[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCollection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (c: AdminCollection) => { setEditItem(c); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleDelete = (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
      return;
    }
    startTransition(async () => {
      await deleteCollection(id);
      setDeleteId(null);
    });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">কিউরেটেড</p>
          <h1 className="serif mt-2 text-3xl font-bold">সংগ্রহ</h1>
          <p className="mt-2 text-sm text-[#7d857e]">থিমভিত্তিক বইয়ের সংগ্রহ তৈরি ও সম্পাদনা করুন।</p>
        </div>
        <button type="button" onClick={openAdd} className="rounded-xl bg-[#303b36] px-5 py-3 text-sm font-bold text-white">
          + নতুন সংগ্রহ
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white">
        <div className="hidden grid-cols-[3fr_1fr_1fr_auto] gap-4 bg-[#fafaf8] px-5 py-3 text-[10px] font-bold uppercase text-[#929991] sm:grid">
          <span>সংগ্রহ</span>
          <span>বইয়ের সংখ্যা</span>
          <span>উৎস</span>
          <span className="text-right">অ্যাকশন</span>
        </div>
        {collections.map((col) => (
          <div key={col.id} className="grid gap-4 border-t border-[#eee7dd] px-5 py-4 text-sm sm:grid-cols-[3fr_1fr_1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ead6bf] text-xl">{col.icon}</span>
              <div>
                <div className="font-bold">{col.title}</div>
                <div className="mt-0.5 text-xs text-[#7d857e] line-clamp-1">{col.description}</div>
              </div>
            </div>
            <div className="text-[#6f746f]">{col.book_count}টি বই</div>
            <div className="text-[#6f746f]">{col.sources.length}টি উৎস</div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => openEdit(col)} className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold hover:bg-[#f8f4ee]">সম্পাদনা</button>
              <button
                type="button"
                onClick={() => handleDelete(col.id)}
                disabled={isPending}
                className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${deleteId === col.id ? "border-red-300 bg-red-50 text-red-600" : "border-[#dedfd9] text-[#9e5548] hover:bg-red-50"}`}
              >
                {deleteId === col.id ? "নিশ্চিত?" : "মুছুন"}
              </button>
            </div>
          </div>
        ))}
        {collections.length === 0 && <p className="p-8 text-center text-sm text-[#7d857e]">কোনো সংগ্রহ নেই।</p>}
      </div>

      {modalOpen && (
        <CollectionModal
          key={editItem?.id ?? "new"}
          open={modalOpen}
          onClose={closeModal}
          editCollection={editItem}
          allBooks={allBooks}
        />
      )}
    </div>
  );
}
