-- Create micro_jobs table for user-posted jobs
CREATE TABLE public.micro_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  work_type text NOT NULL,
  location text NOT NULL,
  latitude real,
  longitude real,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  benefit_points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.micro_jobs ENABLE ROW LEVEL SECURITY;

-- Users can view all approved micro jobs
CREATE POLICY "Anyone can view approved micro jobs"
ON public.micro_jobs FOR SELECT
USING (status = 'approved' OR user_id = auth.uid());

-- Users can insert their own micro jobs
CREATE POLICY "Users can create their own micro jobs"
ON public.micro_jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own micro jobs
CREATE POLICY "Users can update their own micro jobs"
ON public.micro_jobs FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for micro job media
INSERT INTO storage.buckets (id, name, public)
VALUES ('micro-job-media', 'micro-job-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for micro job media
CREATE POLICY "Users can upload their own media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'micro-job-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view media"
ON storage.objects FOR SELECT
USING (bucket_id = 'micro-job-media');

CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'micro-job-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'micro-job-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create trigger for updated_at
CREATE TRIGGER update_micro_jobs_updated_at
BEFORE UPDATE ON public.micro_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();