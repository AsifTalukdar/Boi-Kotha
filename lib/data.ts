export type Book = { id:string; title:string; author:string; duration:string; genre:string; cover:string; accent:string; description:string; narrator:string };
export const books:Book[] = [
 {id:'pother-panchali',title:'পথের পাঁচালী',author:'বিভূতিভূষণ বন্দ্যোপাধ্যায়',duration:'৯ ঘ ৪২ মি',genre:'উপন্যাস',cover:'#754338',accent:'#d18d4a',narrator:'শাওন ইসলাম',description:'অপুর গ্রামবাংলা, নদী, মাঠ আর ছোট ছোট স্বপ্নের ভেতর দিয়ে বড় হয়ে ওঠার এক অনন্ত গল্প।'},
 {id:'shesher-kobita',title:'শেষের কবিতা',author:'রবীন্দ্রনাথ ঠাকুর',duration:'৫ ঘ ১৮ মি',genre:'উপন্যাস',cover:'#bd8a61',accent:'#f2c795',narrator:'নাফিসা নওশীন',description:'ভালোবাসা, বুদ্ধি আর বিদায়ের ভেতর দিয়ে অমিত-লাবণ্যের অনন্য কথোপকথন।'},
 {id:'lalsalu',title:'লালসালু',author:'সৈয়দ ওয়ালীউল্লাহ',duration:'৪ ঘ ১২ মি',genre:'উপন্যাস',cover:'#5c3a33',accent:'#e4a26a',narrator:'মেহেদী হাসান',description:'গ্রামবাংলার মাটি ও মানুষের ওপর ক্ষমতার ছায়া ফেলা এক গভীর, সংযত উপন্যাস।'},
 {id:'meghnad-badh',title:'মেঘনাদবধ কাব্য',author:'মাইকেল মধুসূদন দত্ত',duration:'৬ ঘ ০২ মি',genre:'কবিতা',cover:'#3f4c4a',accent:'#d5a36a',narrator:'ফারহান কবির',description:'মহাকাব্যের ভাষায় বীরত্ব, পরাজয় এবং মানবিকতার গাঢ় পুনর্কথন।'},
 {id:'bonolota-sen',title:'বনলতা সেন',author:'জীবনানন্দ দাশ',duration:'১ ঘ ০৯ মি',genre:'কবিতা',cover:'#66715d',accent:'#d9bb81',narrator:'রাইসা রহমান',description:'হাজার বছর ধরে পথ হাঁটার পর এক মুখের শান্তিতে ফিরে আসার কবিতা।'},
 {id:'nishith-rater-golpo',title:'নিশীথ রাতের গল্প',author:'শরৎচন্দ্র চট্টোপাধ্যায়',duration:'২ ঘ ৩৬ মি',genre:'ছোটগল্প',cover:'#493c5b',accent:'#caa1ce',narrator:'তাসনিম জাহান',description:'নির্জন রাতের ভেতর মানুষের অচেনা মুখ ও অমীমাংসিত কথাদের গল্প।'},
 {id:'kabuliwala',title:'কাবুলিওয়ালা',author:'রবীন্দ্রনাথ ঠাকুর',duration:'৩৯ মি',genre:'ছোটগল্প',cover:'#9b5f43',accent:'#f3cd96',narrator:'ইমরান হোসেন',description:'মিনি আর রহমতের ছোট্ট বন্ধুত্বে ঘরের টান ও দূরদেশের স্মৃতি।'},
 {id:'ruposhi-bangla',title:'রূপসী বাংলা',author:'জীবনানন্দ দাশ',duration:'১ ঘ ২৮ মি',genre:'কবিতা',cover:'#3e6256',accent:'#b9d297',narrator:'শাওন ইসলাম',description:'বাংলার নদী, কুয়াশা, ধানসিঁড়ি আর স্মৃতির জন্য লেখা স্বপ্নময় কবিতামালা.'},
];
export const genreOptions=[
 {id:"uponnash",name:"উপন্যাস"},
 {id:"chotogolpo",name:"ছোটগল্প"},
 {id:"kobita",name:"কবিতা"},
];

export type CuratedCollection={id:string;icon:string;title:string;description:string;copyrightNotice:string;bookIds:string[];sources:{name:string;url:string}[]};
export const curatedCollections:CuratedCollection[]=[
 {id:"rabindra",icon:"র",title:"রবীন্দ্রনাথের নির্বাচিত রচনা",description:"শ্রবণের জন্য বাছাই করা গল্প ও উপন্যাসের একটি শান্ত সংগ্রহ।",copyrightNotice:"প্রকাশের আগে প্রতিটি রেকর্ডিংয়ের পাবলিক-ডোমেইন বা অনুমতির অবস্থা যাচাই করা প্রয়োজন।",bookIds:["shesher-kobita","kabuliwala"],sources:[{name:"বাংলা উইকিসংকলন",url:"https://bn.wikisource.org/"},{name:"Internet Archive",url:"https://archive.org/"}]},
 {id:"kobitar-desh",icon:"ক",title:"কবিতার দেশ",description:"বাংলার প্রকৃতি, স্মৃতি ও কাব্যভাষার কাছাকাছি কিছু পাঠ।",copyrightNotice:"এই সংগ্রহের টেক্সট বা অডিও ব্যবহার করার আগে স্বত্বের অবস্থা ও উৎসের শর্ত নিশ্চিত করুন।",bookIds:["meghnad-badh","bonolota-sen","ruposhi-bangla"],sources:[{name:"বাংলা উইকিসংকলন",url:"https://bn.wikisource.org/"},{name:"Open Library",url:"https://openlibrary.org/"}]},
];

export const requests = [
 {id:'r1',title:'হুমায়ূন আহমেদের ‘নন্দিত নরকে’',meta:'উপন্যাস · ৩ দিন আগে',votes:128,tint:'#ead5bd',icon:'বই'},
 {id:'r2',title:'শামসুর রাহমানের নির্বাচিত কবিতা',meta:'কবিতা · ৫ দিন আগে',votes:94,tint:'#dce0cc',icon:'ক'},
 {id:'r3',title:'মুক্তিযুদ্ধের স্মৃতিচারণা — নারীকণ্ঠ',meta:'স্মৃতিকথা · ১ সপ্তাহ আগে',votes:76,tint:'#e4c9c2',icon:'স্ম'},
 {id:'r4',title:'শিশুদের জন্য ঠাকুরমার ঝুলি',meta:'শিশু · ২ সপ্তাহ আগে',votes:61,tint:'#d9d7e4',icon:'গল্প'},
];

export const navLinks = [{href:'/',label:'হোম',icon:'⌂'},{href:'/requests',label:'রিকোয়েস্ট বোর্ড',icon:'✦'},{href:'/saved',label:'প্রিয় বই',icon:'❤'}];

export type NarratorUpload = {
 id:string;
 title:string;
 status:"অনুমোদিত"|"পর্যালোচনাধীন"|"বাতিল";
 statusTone:"status-green"|"status-amber"|"status-red";
 date:string;
 votes:number;
 plays:number;
};

export const narratorUploads:NarratorUpload[] = [
 {id:"kabuliwala",title:"কাবুলিওয়ালা",status:"অনুমোদিত",statusTone:"status-green",date:"২৮ জুলাই ২০২৬",votes:142,plays:1240},
 {id:"ruposhi-bangla",title:"রূপসী বাংলা",status:"পর্যালোচনাধীন",statusTone:"status-amber",date:"৩১ জুলাই ২০২৬",votes:0,plays:0},
 {id:"nishith-rater-golpo",title:"নিশীথ রাতের গল্প",status:"বাতিল",statusTone:"status-red",date:"১২ জুলাই ২০২৬",votes:28,plays:318},
 {id:"bonolota-sen",title:"বনলতা সেন",status:"অনুমোদিত",statusTone:"status-green",date:"০৫ জুলাই ২০২৬",votes:96,plays:846},
];

export type LeaderboardEntry = { rank:number; name:string; initials:string; votes:number; isCurrent?:boolean };

export const narratorLeaderboard:LeaderboardEntry[] = [
 {rank:1,name:"ফারহান কবির",initials:"ফা",votes:1492},
 {rank:2,name:"নাফিসা নওশীন",initials:"না",votes:1218},
 {rank:3,name:"মেহেদী হাসান",initials:"মে",votes:1084},
 {rank:7,name:"সায়ন্তনী রহমান",initials:"সা",votes:846,isCurrent:true},
 {rank:8,name:"তাসনিম জাহান",initials:"তা",votes:812},
];

export const narratorPlayTrend = [34,48,42,67,58,82,74,96];

export type AdminUser = {
 id:string;
 name:string;
 email:string;
 role:"শ্রোতা"|"ন্যারেটর"|"অ্যাডমিন";
 joinDate:string;
 status:"সক্রিয়"|"স্থগিত";
};

export const adminUsers:AdminUser[] = [
 {id:"u1",name:"সায়ন্তনী রহমান",email:"sayantani@example.com",role:"ন্যারেটর",joinDate:"১২ জুলাই ২০২৬",status:"সক্রিয়"},
 {id:"u2",name:"নাফিসা নওশীন",email:"nafisa@example.com",role:"ন্যারেটর",joinDate:"০৮ জুলাই ২০২৬",status:"সক্রিয়"},
 {id:"u3",name:"তানভীর ইসলাম",email:"tanvir@example.com",role:"শ্রোতা",joinDate:"০২ জুলাই ২০২৬",status:"সক্রিয়"},
 {id:"u4",name:"মাহিরা হক",email:"mahira@example.com",role:"শ্রোতা",joinDate:"২৮ জুন ২০২৬",status:"স্থগিত"},
 {id:"u5",name:"আরিফ হাসান",email:"arif@example.com",role:"শ্রোতা",joinDate:"১৮ জুন ২০২৬",status:"সক্রিয়"},
];

export type ContentReport = {
 id:string;
 reason:string;
 recording:string;
 reporter:string;
 date:string;
 status:"অপেক্ষমাণ"|"সমাধান"|"বাতিল";
};

export const contentReports:ContentReport[] = [
 {id:"report-1",reason:"কপিরাইট নিয়ে প্রশ্ন",recording:"শেষের কবিতা — অধ্যায় ০৪",reporter:"মুনতাসির আলম",date:"আজ, ১১:৩০",status:"অপেক্ষমাণ"},
 {id:"report-2",reason:"অডিওতে অতিরিক্ত নয়েজ",recording:"মেঘনাদবধ কাব্য — সর্গ ০২",reporter:"রাইসা রহমান",date:"আজ, ০৯:৫৫",status:"অপেক্ষমাণ"},
 {id:"report-3",reason:"ভুল শিরোনাম ও মেটাডেটা",recording:"কাবুলিওয়ালা — সম্পূর্ণ",reporter:"নওশাদ করিম",date:"গতকাল",status:"অপেক্ষমাণ"},
];

export type PaymentRecord = {
 id:string;
 user:string;
 amount:number;
 gateway:"SSLCommerz"|"AamarPay";
 status:"সফল"|"অপেক্ষমাণ"|"ব্যর্থ";
 date:string;
};

export const paymentRecords:PaymentRecord[] = [
 {id:"pay-1",user:"তানভীর ইসলাম",amount:199,gateway:"SSLCommerz",status:"সফল",date:"০৩ আগস্ট ২০২৬"},
 {id:"pay-2",user:"সাদিয়া আক্তার",amount:499,gateway:"AamarPay",status:"সফল",date:"০৩ আগস্ট ২০২৬"},
 {id:"pay-3",user:"আরিফ হাসান",amount:199,gateway:"SSLCommerz",status:"অপেক্ষমাণ",date:"০২ আগস্ট ২০২৬"},
 {id:"pay-4",user:"মাহিরা হক",amount:199,gateway:"AamarPay",status:"ব্যর্থ",date:"০২ আগস্ট ২০২৬"},
];
