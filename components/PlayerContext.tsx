"use client";

import {createContext,useContext,useState} from "react";
import type {Book} from "@/lib/data";

type PlayerContextValue={currentBook:Book|null;isPlaying:boolean;progress:number;speed:string;play:(book:Book)=>void;toggle:()=>void;setProgress:(progress:number)=>void;cycleSpeed:()=>void};
const PlayerContext=createContext<PlayerContextValue|null>(null);

export function PlayerProvider({children}:{children:React.ReactNode}){
 const [currentBook,setCurrentBook]=useState<Book|null>(null);
 const [isPlaying,setIsPlaying]=useState(false);
 const [progress,setProgress]=useState(0);
 const [speed,setSpeed]=useState("1x");
 const play=(book:Book)=>{if(currentBook?.id!==book.id){setCurrentBook(book);setProgress(0)}setIsPlaying(true)};
 const toggle=()=>setIsPlaying(value=>!value);
 const cycleSpeed=()=>setSpeed(value=>value==="1x"?"1.25x":value==="1.25x"?"1.5x":"1x");
 return <PlayerContext.Provider value={{currentBook,isPlaying,progress,speed,play,toggle,setProgress,cycleSpeed}}>{children}</PlayerContext.Provider>;
}

export function usePlayer(){const context=useContext(PlayerContext);if(!context)throw new Error("usePlayer must be used within PlayerProvider");return context;}
