-- Ensure trigger to auto-assign admin role on signup exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_auto_assign_admin'
  ) THEN
    CREATE TRIGGER on_auth_user_created_auto_assign_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.auto_assign_admin_role();
  END IF;
END $$;