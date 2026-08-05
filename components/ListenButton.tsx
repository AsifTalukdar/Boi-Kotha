"use client";

import type {Book} from "@/lib/data";
import {usePlayer} from "@/components/PlayerContext";
import {Icon} from "@/components/Icon";

export function ListenButton({book,compact=false}:{book:Book;compact?:boolean}){const{currentBook,isPlaying,play,toggle}=usePlayer();const isCurrent=currentBook?.id===book.id;const onClick=()=>isCurrent?toggle():play(book);if(compact)return <button type="button" onClick={onClick} aria-label={`${book.title} শুনুন`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--maroon)] text-white"><Icon name={isCurrent&&isPlaying?"pause":"play"} size={14}/></button>;return <button type="button" onClick={onClick} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-3 text-sm font-bold text-white"><Icon name={isCurrent&&isPlaying?"pause":"play"} size={15}/>{isCurrent&&isPlaying?"বিরতি দিন":"এখনই শুনুন"}</button>}
