import { createClient } from "./server";

export type RequestRow = {
  id: string;
  title: string;
  category: string;
  votes: number;
  created_at: string;
};

export async function getRequests(): Promise<RequestRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("votes", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
  return data;
}
