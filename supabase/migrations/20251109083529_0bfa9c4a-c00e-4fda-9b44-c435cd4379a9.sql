-- Update the auto_assign_admin_role function to check for admin1@gmail.com
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the user's email is admin1@gmail.com
  IF NEW.email = 'admin1@gmail.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;