// Maps Supabase Auth's English error strings to Bengali copy for the UI.
// Supabase returns human-readable English messages (e.g. "Invalid login
// credentials"); we surface a localized equivalent and fall back to a generic
// Bengali message for anything unmapped so raw English never reaches the user.

const AUTH_ERROR_BN: Record<string, string> = {
  "invalid login credentials": "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
  "email not confirmed": "আপনার ইমেইলটি এখনো নিশ্চিত করা হয়নি। ইনবক্স দেখে নিশ্চিত করুন।",
  "user already registered": "এই ইমেইলে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। লগ ইন করুন।",
  "password should be at least 6 characters": "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।",
  "unable to validate email address: invalid format": "ইমেইল ঠিকানাটি সঠিক নয়।",
  "signups not allowed for this instance": "এই মুহূর্তে নতুন অ্যাকাউন্ট খোলা বন্ধ আছে।",
  "email rate limit exceeded": "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
};

export function localizeAuthError(message: string | null | undefined): string {
  if (!message) return "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  const normalized = message.trim().toLowerCase();
  if (AUTH_ERROR_BN[normalized]) return AUTH_ERROR_BN[normalized];
  // Partial match for messages that embed a variable part.
  for (const [key, value] of Object.entries(AUTH_ERROR_BN)) {
    if (normalized.includes(key)) return value;
  }
  return "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}
