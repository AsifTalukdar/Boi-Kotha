"use client";

import {useState} from "react";
import {adminUsers} from "@/lib/data";

export default function AdminUsersPage(){
 const [users,setUsers]=useState(adminUsers);
 const toggleStatus=(id:string)=>setUsers(current=>current.map(user=>user.id===id?{...user,status:user.status==="সক্রিয়"?"স্থগিত":"সক্রিয়"}:user));
 return <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8"><div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">অ্যাকাউন্ট</p><h1 className="serif mt-2 text-3xl font-bold">ইউজার</h1><p className="mt-2 text-sm text-[#7d857e]">ইউজার, ন্যারেটর এবং তাদের অ্যাকাউন্ট স্ট্যাটাস পরিচালনা করুন।</p></div><div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white"><div className="overflow-x-auto"><table className="min-w-[700px] w-full text-left"><thead className="bg-[#fafaf8] text-[10px] font-bold uppercase tracking-wide text-[#929991]"><tr><th className="px-5 py-3">নাম</th><th className="px-5 py-3">ইমেইল</th><th className="px-5 py-3">ভূমিকা</th><th className="px-5 py-3">যোগদানের তারিখ</th><th className="px-5 py-3">স্ট্যাটাস</th><th className="px-5 py-3 text-right">অ্যাকশন</th></tr></thead><tbody>{users.map(user=><tr key={user.id} className="border-t border-[#eee7dd] text-sm"><td className="px-5 py-4 font-bold">{user.name}</td><td className="px-5 py-4 text-[#6f746f]">{user.email}</td><td className="px-5 py-4">{user.role}</td><td className="px-5 py-4 text-[#6f746f]">{user.joinDate}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.status==="সক্রিয়"?"bg-[#e5eee1] text-[#52704d]":"bg-[#f5dfd8] text-[#9e5548]"}`}>{user.status}</span></td><td className="px-5 py-4 text-right"><button type="button" onClick={()=>toggleStatus(user.id)} className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold hover:bg-[#f8f4ee]">{user.status==="সক্রিয়"?"স্থগিত করুন":"সক্রিয় করুন"}</button></td></tr>)}</tbody></table></div></div></div>;
}
