"use client";

import { useState, useTransition, useMemo, useDeferredValue } from "react";
import { Icon } from "@/components/Icon";
import { createBook, updateBook, deleteBook } from "@/lib/actions/admin";
import type { AdminBook, GenreOption } from "@/lib/supabase/admin_queries";

type BookFormData = {
  title_bn: string;
  author_bn: string;
  description_bn: string;
  cover_color: string;
  genre: string | null;
};

const emptyForm: BookFormData = {
  title_bn: "",
  author_bn: "",
  description_bn: "",
  cover_color: "#754338",
  genre: null,
};

function BookModal({
  open,
  onClose,
  editBook,
  genres,
}: {
  open: boolean;
  onClose: () => void;
  editBook: AdminBook | null;
  genres: GenreOption[];
}) {
  const isEdit = editBook !== null;
  const [form, setForm] = useState<BookFormData>(
    isEdit
      ? {
          title_bn: editBook.title_bn,
          author_bn: editBook.author_bn || "",
          description_bn: editBook.description_bn || "",
          cover_color: editBook.cover_color || "#754338",
          genre: editBook.genre_id,
        }
      : emptyForm
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.title_bn.trim()) {
      setError("বইয়ের শিরোনাম দিন।");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = isEdit
        ? await updateBook(editBook.id, form)
        : await createBook(form);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  const set = (key: keyof BookFormData, value: string | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="বন্ধ করুন"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#dedfd9] bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="serif text-xl font-bold">
            {isEdit ? "বই সম্পাদনা" : "নতুন বই যোগ করুন"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#f0eeea]"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="field-label">শিরোনাম (বাংলা) *</span>
            <input
              className="field mt-1"
              value={form.title_bn}
              onChange={(e) => set("title_bn", e.target.value)}
              placeholder="যেমন: পথের পাঁচালী"
            />
          </label>
          <label className="block">
            <span className="field-label">লেখক (বাংলা)</span>
            <input
              className="field mt-1"
              value={form.author_bn}
              onChange={(e) => set("author_bn", e.target.value)}
              placeholder="যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায়"
            />
          </label>
          <label className="block">
            <span className="field-label">বর্ণনা (বাংলা)</span>
            <textarea
              className="field mt-1"
              rows={3}
              value={form.description_bn}
              onChange={(e) => set("description_bn", e.target.value)}
              placeholder="বইটির সংক্ষিপ্ত বর্ণনা…"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="field-label">ধরণ</span>
              <select
                className="field mt-1"
                value={form.genre || ""}
                onChange={(e) => set("genre", e.target.value || null)}
              >
                <option value="">বেছে নিন</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name_bn}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">কভার রঙ</span>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={form.cover_color}
                  onChange={(e) => set("cover_color", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--line)]"
                />
                <input
                  className="field flex-1"
                  value={form.cover_color}
                  onChange={(e) => set("cover_color", e.target.value)}
                  placeholder="#754338"
                />
              </div>
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs font-bold text-red-600">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#dedfd9] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#7d857e] hover:bg-[#f0eeea]"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-[#303b36] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {isPending
              ? "সেভ হচ্ছে…"
              : isEdit
                ? "আপডেট করুন"
                : "যোগ করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BooksAdmin({
  books,
  genres,
}: {
  books: AdminBook[];
  genres: GenreOption[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [genreFilter, setGenreFilter] = useState("সব ধরণ");
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<AdminBook | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const genreNames = useMemo(() => [
    "সব ধরণ",
    ...Array.from(new Set(books.map((b) => b.genre_name).filter(Boolean))),
  ], [books]);

  const shown = useMemo(() => {
    const q = deferredQuery.toLowerCase();
    return books.filter(
      (book) =>
        (genreFilter === "সব ধরণ" || book.genre_name === genreFilter) &&
        `${book.title_bn} ${book.author_bn}`
          .toLowerCase()
          .includes(q)
    );
  }, [books, genreFilter, deferredQuery]);

  const openAdd = () => {
    setEditBook(null);
    setModalOpen(true);
  };

  const openEdit = (book: AdminBook) => {
    setEditBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditBook(null);
  };

  const handleDelete = (id: string) => {
    if (deleteId === id) {
      startTransition(async () => {
        await deleteBook(id);
        setDeleteId(null);
      });
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">
            ক্যাটালগ
          </p>
          <h1 className="serif mt-2 text-3xl font-bold">বই</h1>
          <p className="mt-2 text-sm text-[#7d857e]">
            ক্যাটালগের বই যোগ, সম্পাদনা বা মুছুন।
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-[#303b36] px-5 py-3 text-sm font-bold text-white"
        >
          + নতুন বই
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#dedfd9] p-4 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-field"
              placeholder="বই বা লেখক খুঁজুন"
            />
          </div>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="rounded-lg border border-[#dedfd9] bg-white px-3 py-2 text-sm font-bold text-[#4d514d]"
          >
            {genreNames.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left">
            <thead className="bg-[#fafaf8] text-[10px] font-bold uppercase tracking-wide text-[#929991]">
              <tr>
                <th className="px-5 py-3">বই</th>
                <th className="px-5 py-3">লেখক</th>
                <th className="px-5 py-3">ধরণ</th>
                <th className="px-5 py-3">রেকর্ডিং</th>
                <th className="px-5 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((book) => (
                <tr
                  key={book.id}
                  className="border-t border-[#eee7dd] text-sm"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-7 rounded-md"
                        style={{
                          backgroundColor: book.cover_color || "#754338",
                        }}
                      />
                      <span className="font-bold">{book.title_bn}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#6f746f]">
                    {book.author_bn || "—"}
                  </td>
                  <td className="px-5 py-4">
                    {book.genre_name ? (
                      <span className="rounded-full bg-[#edf0e8] px-2.5 py-1 text-xs font-bold text-[#5d6b59]">
                        {book.genre_name}
                      </span>
                    ) : (
                      <span className="text-xs text-[#929991]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#6f746f]">
                    {book.recording_count}টি
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(book)}
                        className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold hover:bg-[#f8f4ee]"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book.id)}
                        disabled={isPending}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                          deleteId === book.id
                            ? "border-red-300 bg-red-50 text-red-600"
                            : "border-[#dedfd9] text-[#9e5548] hover:bg-red-50"
                        }`}
                      >
                        {deleteId === book.id ? "নিশ্চিত?" : "মুছুন"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shown.length === 0 && (
          <p className="p-8 text-center text-sm text-[#7d857e]">
            কোনো বই পাওয়া যায়নি।
          </p>
        )}
      </div>

      {modalOpen && (
        <BookModal
          key={editBook?.id ?? "new"}
          open={modalOpen}
          onClose={closeModal}
          editBook={editBook}
          genres={genres}
        />
      )}
    </div>
  );
}
