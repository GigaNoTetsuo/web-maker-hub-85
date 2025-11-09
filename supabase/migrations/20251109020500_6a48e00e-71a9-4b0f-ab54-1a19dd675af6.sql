-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_skills table
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON public.user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON public.user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create course_progress table
CREATE TABLE public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_modules INTEGER[] DEFAULT '{}',
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create test_questions table
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view test questions
CREATE POLICY "Authenticated users can view questions"
  ON public.test_questions FOR SELECT
  TO authenticated
  USING (true);

-- Create test_attempts table
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage REAL NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test attempts"
  ON public.test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test attempts"
  ON public.test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_number TEXT UNIQUE NOT NULL,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert sample test questions for course 1 (Tree Plantation)
INSERT INTO public.test_questions (course_id, question, options, correct_answer) VALUES
('1', 'What is the primary benefit of planting native tree species?', '["They grow faster than exotic species", "They support local ecosystems and require less maintenance", "They produce more timber", "They need more water"]', 1),
('1', 'What is the ideal season for tree planting in most regions?', '["Summer", "Winter", "Spring or Fall", "Any season"]', 2),
('1', 'How wide should the planting hole be compared to the root ball?', '["Same size", "2-3 times wider", "Slightly smaller", "Twice as deep"]', 1),
('1', 'What is a common mistake to avoid when planting trees?', '["Watering immediately after planting", "Planting too deep", "Using original soil", "Adding compost"]', 1),
('1', 'What does sustainable forest management include?', '["Clear-cutting all trees at once", "Selective cutting and allowing regeneration", "Removing all dead trees", "Planting only one species"]', 1),
('1', 'Why should mulch NOT be placed against the tree trunk?', '["It attracts pests and causes rot", "It looks unattractive", "It prevents growth", "It costs more"]', 0),
('1', 'What is the purpose of thinning in forest management?', '["To remove all small trees", "To reduce overcrowding and promote healthy growth", "To harvest timber quickly", "To prevent wildlife habitat"]', 1),
('1', 'When is the best time to prune trees?', '["Late summer", "Late winter or early spring", "During fruit season", "Never"]', 1),
('1', 'What factor is most important when selecting tree species?', '["Aesthetic appearance", "Climate compatibility and native status", "Cost", "Growth speed"]', 1),
('1', 'What should you check for during regular tree health inspections?', '["Only trunk diameter", "Pest infestations, disease symptoms, and structural integrity", "Leaf color only", "Root depth"]', 1);

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();