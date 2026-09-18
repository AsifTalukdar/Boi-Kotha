-- Table: collections
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    copyright_notice TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: collection_books
CREATE TABLE public.collection_books (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (collection_id, book_id)
);

-- Table: requests
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    votes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone for these tables
CREATE POLICY "Allow public read access on collections" 
ON public.collections FOR SELECT USING (true);

CREATE POLICY "Allow public read access on collection_books" 
ON public.collection_books FOR SELECT USING (true);

CREATE POLICY "Allow public read access on requests" 
ON public.requests FOR SELECT USING (true);

-- Allow authenticated users to insert requests
CREATE POLICY "Allow authenticated users to insert requests" 
ON public.requests FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to upvote requests (update)
CREATE POLICY "Allow authenticated users to update requests (for votes)" 
ON public.requests FOR UPDATE TO authenticated USING (true);

-- ─── Admin CRUD support ─────────────────────────────────────────────

-- Suspended column on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT false;

-- Admin write policies for books
CREATE POLICY "Admins can insert books"
ON public.books FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update books"
ON public.books FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete books"
ON public.books FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin write policies for profiles (role/suspend management)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID REFERENCES public.recordings(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reports"
ON public.reports FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can insert reports"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = reporter_id);
