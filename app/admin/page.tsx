import {Icon} from "@/components/Icon";
import {ModerationRow} from "@/components/ModerationRow";

const queue=[
 {title:"শেষের কবিতা — অধ্যায় ০৪",narrator:"নাফিসা নওশীন",duration:"৩২:১৮",submitted:"আজ, ১০:৪২",quality:"ভালো",safety:"নিরাপদ"},
 {title:"মেঘনাদবধ কাব্য — সর্গ ০২",narrator:"ফারহান কবির",duration:"৪৫:০৯",submitted:"আজ, ০৯:১৫",quality:"মাঝারি",safety:"নিরাপদ"},
 {title:"কাবুলিওয়ালা — সম্পূর্ণ",narrator:"ইমরান হোসেন",duration:"৩৯:০২",submitted:"গতকাল",quality:"ভালো",safety:"নিরাপদ"},
];

export default function AdminPage(){return <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">মডারেশন কিউ</p><h1 className="serif mt-2 text-3xl font-bold">মডারেশন কিউ</h1><p className="mt-2 text-sm text-[#7d857e]">নতুন জমা পড়া রেকর্ডিংগুলো শুনে যাচাই করুন।</p></div><button type="button" className="rounded-xl bg-[#303b36] px-4 py-3 text-sm font-bold text-white">CSV এক্সপোর্ট</button></div><div className="mb-5 grid gap-3 sm:grid-cols-3"><Stat label="অপেক্ষায় আছে" value="১২"/><Stat label="আজ অনুমোদিত" value="০৮"/><Stat label="গড় রিভিউ সময়" value="১৮ মি"/></div><div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white"><div className="flex gap-3 border-b border-[#dedfd9] p-4"><div className="relative max-w-sm flex-1"><Icon name="search" size={16}/><input className="search-field" placeholder="রেকর্ডিং বা ন্যারেটর খুঁজুন"/></div><button type="button" className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold">সব স্ট্যাটাস ▾</button></div><div className="hidden grid-cols-[1.6fr_1fr_.8fr_.9fr_auto] gap-4 bg-[#fafaf8] px-5 py-3 text-[10px] font-bold uppercase text-[#929991] sm:grid"><span>রেকর্ডিং</span><span>জমা দেওয়া</span><span>AI চেক</span><span>অডিও</span><span>অ্যাকশন</span></div>{queue.map(item=><ModerationRow key={item.title} item={item}/>)}</div></div>}

function Stat({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-[#dedfd9] bg-white p-5"><p className="text-xs font-bold text-[#7d857e]">{label}</p><p className="serif mt-2 text-3xl font-bold">{value}</p><span className="mt-1 inline-flex text-[11px] text-[#bc7a45]">পর্যালোচনা প্রয়োজন</span></div>}
