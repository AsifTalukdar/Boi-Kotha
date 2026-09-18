"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UploadableBook } from "@/lib/supabase/queries";
import { createBook } from "@/lib/actions/admin";
import { Icon } from "./Icon";

import { StepSelectBook, type UploadMode } from "./upload/StepSelectBook";
import { StepCopyright, type CopyrightStatus } from "./upload/StepCopyright";
import { StepAudio } from "./upload/StepAudio";
import { StepSuccess } from "./upload/StepSuccess";

const steps = ["বই বেছে নিন", "স্বত্ব ঘোষণা", "অডিও আপলোড", "নিশ্চিতকরণ"];

function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : null);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    audio.src = url;
  });
}

export function UploadStepper({ books: initialBooks }: { books: UploadableBook[] }) {
 const [books, setBooks] = useState(initialBooks);
 const [step, setStep] = useState(1);
 const [mode, setMode] = useState<UploadMode>("book");
 const [selectedBookId, setSelectedBookId] = useState("");
 const [copyrightStatus, setCopyrightStatus] = useState<CopyrightStatus | "">("");
 const [proofName, setProofName] = useState("");
 const [audioFile, setAudioFile] = useState<File | null>(null);
 const [uploading, setUploading] = useState(false);
 const [uploadError, setUploadError] = useState("");

 // Manual book form state
 const [manualTitle, setManualTitle] = useState("");
 const [manualAuthor, setManualAuthor] = useState("");
 const [manualDescription, setManualDescription] = useState("");
 const [manualCoverColor, setManualCoverColor] = useState("#754338");
 const [creatingBook, startCreatingBook] = useTransition();
 const [manualError, setManualError] = useState("");
 const [manualCreated, setManualCreated] = useState(false);

 const canContinue = uploading ? false : step === 1
  ? (mode === "book" ? Boolean(selectedBookId) : (manualCreated && Boolean(selectedBookId)))
  : step === 2
   ? Boolean(copyrightStatus) && (copyrightStatus !== "permission" || Boolean(proofName))
   : step === 3
    ? Boolean(audioFile)
    : true;

 const changeAudio = (event: ChangeEvent<HTMLInputElement>) => setAudioFile(event.target.files?.[0] ?? null);
 const dropAudio = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  setAudioFile(event.dataTransfer.files?.[0] ?? null);
 };

 const handleCreateBook = () => {
  if (!manualTitle.trim()) {
   setManualError("বইয়ের শিরোনাম দিন।");
   return;
  }
  setManualError("");
  startCreatingBook(async () => {
   // Create the book via server action
   const supabase = createClient();
   const { data, error } = await supabase.from("books").insert({
     title_bn: manualTitle.trim(),
     author_bn: manualAuthor.trim() || null,
     description_bn: manualDescription.trim() || null,
     cover_color: manualCoverColor,
   }).select("id, title_bn, author_bn").single();

   if (error) {
     setManualError(error.message || "বই তৈরি করা যায়নি।");
     return;
   }

   if (data) {
     // Add the new book to the local list and auto-select it
     const newBook: UploadableBook = {
       id: data.id,
       title: data.title_bn,
       author: data.author_bn || "",
     };
     setBooks((prev) => [newBook, ...prev]);
     setSelectedBookId(data.id);
     setManualCreated(true);
   }
  });
 };

  const submitRecording = async () => {
   if (!audioFile || !selectedBookId) return;
   
   if (audioFile.size > 500 * 1024 * 1024) {
     setUploadError("ফাইল সাইজ ৫০০ MB এর বেশি হতে পারবে না।");
     return;
   }
   
   setUploading(true);
   setUploadError("");
   try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("অনুগ্রহ করে লগ ইন করুন।");
    
    const durationSeconds = await readAudioDuration(audioFile);
    
    const recordingId = crypto.randomUUID();
    const fileExtension = audioFile.name.split('.').pop() || 'mp3';
    const storagePath = `${user.id}/${recordingId}.${fileExtension}`;
    
    const { error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(storagePath, audioFile, {
        upsert: false,
      });
      
    if (uploadError) {
      console.error(uploadError);
      throw new Error("আপলোড ব্যর্থ হয়েছে।");
    }
    
    const { error: insertError } = await supabase.from("recordings").insert({
      id: recordingId,
      book_id: selectedBookId,
      narrator_id: user.id,
      storage_path: storagePath,
      duration_seconds: Math.round(durationSeconds || 0),
      status: "pending",
    });
    
    if (insertError) {
      console.error(insertError);
      throw new Error("ডেটাবেসে সেভ করতে সমস্যা হয়েছে।");
    }

    setStep(4);
   } catch (error) {
    setUploadError(error instanceof Error ? error.message : "আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
   } finally {
    setUploading(false);
   }
  };

 const goNext = () => {
  if (step === 3) {
   submitRecording();
   return;
  }
  setStep((current) => current + 1);
 };

 return <div className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-5 shadow-[0_12px_35px_rgba(91,53,32,.05)] sm:p-7">
  <ol className="mb-8 grid grid-cols-4 gap-2">
   {steps.map((label, index) => {
    const number = index + 1;
    const done = step > number;
    const active = step === number;
    return <li key={label} className="relative flex flex-col items-center gap-2 text-center">
     {number < steps.length && <span className={`absolute left-1/2 top-4 h-px w-full ${done ? "bg-[var(--maroon)]" : "bg-[var(--line)]"}`} />}
     <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active || done ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] bg-[var(--cream)] text-[var(--muted)]"}`}>{done ? <Icon name="check" size={15} /> : number}</span>
     <span className={`hidden text-[10px] font-bold sm:block ${active ? "text-[var(--maroon)]" : "text-[var(--muted)]"}`}>{label}</span>
    </li>;
   })}
  </ol>

  {step === 1 && <StepSelectBook
    books={books} mode={mode} setMode={setMode}
    selectedBookId={selectedBookId} setSelectedBookId={setSelectedBookId}
    manualTitle={manualTitle} setManualTitle={setManualTitle}
    manualAuthor={manualAuthor} setManualAuthor={setManualAuthor}
    manualDescription={manualDescription} setManualDescription={setManualDescription}
    manualCoverColor={manualCoverColor} setManualCoverColor={setManualCoverColor}
    creatingBook={creatingBook} handleCreateBook={handleCreateBook}
    manualError={manualError} manualCreated={manualCreated} setManualCreated={setManualCreated}
  />}

  {step === 2 && <StepCopyright
    copyrightStatus={copyrightStatus} setCopyrightStatus={setCopyrightStatus}
    proofName={proofName} setProofName={setProofName}
  />}

  {step === 3 && <StepAudio
    audioFile={audioFile} changeAudio={changeAudio} dropAudio={dropAudio}
    uploading={uploading} uploadError={uploadError}
  />}

  {step === 4 && <StepSuccess />}

  {step < 4 && <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5">
   <button type="button" disabled={step === 1 || uploading} onClick={() => setStep((current) => current - 1)} className="rounded-xl px-3 py-2 text-sm font-bold text-[var(--muted)] disabled:opacity-30">পেছনে</button>
   <button type="button" disabled={!canContinue} onClick={goNext} className="rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === 3 ? (uploading ? "আপলোড হচ্ছে…" : "জমা দিন") : "এগিয়ে যান"} →</button>
  </div>}
 </div>;
}