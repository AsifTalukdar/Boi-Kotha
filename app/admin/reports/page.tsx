"use client";

import {useState} from "react";
import {contentReports} from "@/lib/data";

export default function AdminReportsPage(){
 const [reports,setReports]=useState(contentReports);
 const update=(id:string,status:"সমাধান"|"বাতিল")=>setReports(current=>current.map(report=>report.id===id?{...report,status}:report));
 return <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-8"><div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">সেফটি</p><h1 className="serif mt-2 text-3xl font-bold">রিপোর্টস</h1><p className="mt-2 text-sm text-[#7d857e]">ব্যবহারকারীর পাঠানো কনটেন্ট রিপোর্টগুলো পর্যালোচনা করুন।</p></div><div className="space-y-3">{reports.map(report=><article key={report.id} className="rounded-2xl border border-[#dedfd9] bg-white p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${report.status==="অপেক্ষমাণ"?"bg-[#fff0da] text-[#a66a2d]":report.status==="সমাধান"?"bg-[#e5eee1] text-[#52704d]":"bg-[#f0eeea] text-[#737773]"}`}>{report.status}</span><span className="text-xs text-[#858985]">{report.date}</span></div><h2 className="mt-3 font-bold">{report.recording}</h2><p className="mt-1 text-sm text-[#6f746f]">কারণ: {report.reason}</p><p className="mt-2 text-xs text-[#90948f]">রিপোর্ট করেছেন: {report.reporter}</p></div>{report.status==="অপেক্ষমাণ"&&<div className="flex h-fit gap-2"><button type="button" onClick={()=>update(report.id,"সমাধান")} className="rounded-lg bg-[#303b36] px-3 py-2 text-xs font-bold text-white">সমাধান</button><button type="button" onClick={()=>update(report.id,"বাতিল")} className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold">বাতিল</button></div>}</div></article>)}</div></div>;
}
