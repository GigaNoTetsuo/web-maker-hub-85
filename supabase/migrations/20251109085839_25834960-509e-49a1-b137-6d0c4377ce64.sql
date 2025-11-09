-- Add points field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0 NOT NULL;

-- Create withdrawals table for cash withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points_withdrawn INTEGER NOT NULL,
  amount_pkr NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_details JSONB,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  CONSTRAINT withdrawals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT withdrawals_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS on withdrawals table
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Users can view their own withdrawals
CREATE POLICY "Users can view own withdrawals"
ON public.withdrawals
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own withdrawal requests
CREATE POLICY "Users can create own withdrawals"
ON public.withdrawals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all withdrawals
CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all withdrawals
CREATE POLICY "Admins can update all withdrawals"
ON public.withdrawals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);