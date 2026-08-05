"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {Icon} from "@/components/Icon";

const adminNav = [
 {href:"/admin",label:"মডারেশন কিউ",count:"১২"},
 {href:"/admin/books",label:"বই"},
 {href:"/admin/users",label:"ইউজার"},
 {href:"/admin/reports",label:"রিপোর্টস"},
 {href:"/admin/payments",label:"পেমেন্টস"},
];

export function AdminSidebar(){
 const [open,setOpen] = useState(false);
 const pathname = usePathname();
 const isActive = (href:string) => href === "/admin" ? pathname === href : pathname.startsWith(href);
 return <>
  <button type="button" aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"} onClick={()=>setOpen(!open)} className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedfd9] bg-[#f6f5f1] text-[#303b36] shadow-sm md:hidden"><Icon name={open ? "close" : "menu"} size={19}/></button>
  {open && <button type="button" aria-label="মেনু বন্ধ করুন" className="fixed inset-0 z-30 bg-black/35 md:hidden" onClick={()=>setOpen(false)}/>}
  <aside className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-[#45514a] bg-[#303b36] p-6 text-white transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
   <Link href="/" className="flex items-center gap-3" onClick={()=>setOpen(false)}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5a16a] text-lg font-bold text-[#303b36]">অ</span><span className="serif text-lg font-bold">[PROJECT NAME]</span></Link>
   <div className="mt-14 text-[10px] font-bold uppercase tracking-[.18em] text-[#9eaaa0]">অ্যাডমিন প্যানেল</div>
   <nav className="mt-4 space-y-1" aria-label="অ্যাডমিন নেভিগেশন">{adminNav.map((item,index)=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${isActive(item.href) ? "bg-white/10 text-[#f4c789]" : "text-[#c0c9c1] hover:bg-white/5"}`}><span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-[10px]">{index+1}</span>{item.label}{item.count && <span className="ml-auto rounded-full bg-[#c77a53] px-2 py-0.5 text-[10px]">{item.count}</span>}</Link>)}</nav>
   <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-5"><Link href="/" onClick={()=>setOpen(false)} className="text-xs text-[#c0c9c1] hover:text-white">← শ্রোতা ভিউতে ফিরুন</Link></div>
  </aside>
 </>;
}
