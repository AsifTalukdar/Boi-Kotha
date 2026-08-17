import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

function compressAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:a libmp3lame', // convert to mp3
        '-b:a 64k', // 64kbps bitrate for spoken word
        '-ac 1', // mono
        '-ar 44100' // sample rate
      ])
      .save(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("audio") as File;
    const bookId = formData.get("bookId") as string;

    if (!file || !bookId) {
      return NextResponse.json({ error: "Missing file or bookId" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempInput = path.join(os.tmpdir(), `${crypto.randomUUID()}-${file.name}`);
    const tempOutput = path.join(os.tmpdir(), `${crypto.randomUUID()}.mp3`);

    await writeFile(tempInput, buffer);

    let durationSeconds = 0;
    try {
      durationSeconds = await getAudioDuration(tempInput);
    } catch (e) {
      console.warn("Could not get duration directly, proceeding anyway", e);
    }

    // Compress
    await compressAudio(tempInput, tempOutput);

    // Read compressed file
    const compressedBuffer = await readFile(tempOutput);

    // Upload to Supabase Storage (free — no credit card needed)
    const recordingId = crypto.randomUUID();
    const storagePath = `${user.id}/${recordingId}.mp3`;
    
    const { error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(storagePath, compressedBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return NextResponse.json({ error: "Failed to upload audio file" }, { status: 500 });
    }

    // Cleanup temp files
    await unlink(tempInput).catch(() => {});
    await unlink(tempOutput).catch(() => {});

    // Insert into Supabase
    const { error: insertErr } = await supabase.from("recordings").insert({
      id: recordingId,
      book_id: bookId,
      narrator_id: user.id,
      storage_path: storagePath,
      duration_seconds: Math.round(durationSeconds),
      status: "pending",
    });

    if (insertErr) {
      console.error("DB Insert Error", insertErr);
      return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
    }

    return NextResponse.json({ success: true, recordingId });

  } catch (error: any) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
