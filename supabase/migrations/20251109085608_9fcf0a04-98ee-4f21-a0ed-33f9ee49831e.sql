-- Drop existing foreign keys that point to auth.users
ALTER TABLE public.micro_jobs DROP CONSTRAINT IF EXISTS micro_jobs_user_id_fkey;
ALTER TABLE public.micro_jobs DROP CONSTRAINT IF EXISTS micro_jobs_verified_by_fkey;
ALTER TABLE public.job_applications DROP CONSTRAINT IF EXISTS job_applications_user_id_fkey;

-- Add foreign keys pointing to profiles table instead
ALTER TABLE public.micro_jobs
ADD CONSTRAINT micro_jobs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.micro_jobs
ADD CONSTRAINT micro_jobs_verified_by_fkey
FOREIGN KEY (verified_by) REFERENCES public.profiles(id)
ON DELETE SET NULL;

ALTER TABLE public.job_applications
ADD CONSTRAINT job_applications_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;