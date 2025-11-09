-- Create function to increment user points safely
CREATE OR REPLACE FUNCTION public.increment_user_points(
  p_user_id UUID,
  p_points INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET points = points + p_points
  WHERE id = p_user_id;
END;
$$;