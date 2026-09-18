import { createClient } from "./server";

export type RequestRow = {
  id: string;
  description: string;
  author_bn: string | null;
  category: string;
  votes: number;
  status: string | null;
  created_at: string;
};

export async function getRequests(): Promise<RequestRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("id, description, author_bn, category, votes, status, created_at")
    .order("votes", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
  return data ?? [];
}
