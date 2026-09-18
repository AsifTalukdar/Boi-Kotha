import { getAdminBooks, getGenreOptions } from "@/lib/supabase/admin_queries";
import { BooksAdmin } from "@/components/admin/BooksAdmin";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const books = await getAdminBooks();
  const genres = await getGenreOptions();

  return <BooksAdmin books={books} genres={genres} />;
}
