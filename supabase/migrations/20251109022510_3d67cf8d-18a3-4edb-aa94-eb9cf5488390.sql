-- Create module_test_questions table
CREATE TABLE public.module_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.module_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view module questions"
  ON public.module_test_questions FOR SELECT
  TO authenticated
  USING (true);

-- Create module_test_attempts table
CREATE TABLE public.module_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage REAL NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.module_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own module test attempts"
  ON public.module_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module test attempts"
  ON public.module_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create module_certificates table
CREATE TABLE public.module_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  module_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_number TEXT UNIQUE NOT NULL,
  UNIQUE(user_id, course_id, module_id)
);

ALTER TABLE public.module_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own module certificates"
  ON public.module_certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module certificates"
  ON public.module_certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert module test questions for Course 1, Module 0
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 0, 'What is the primary goal of sustainable forestry?', '["Maximum timber production", "Balancing environmental, social, and economic needs", "Clear cutting efficiency", "Urban development"]', 1),
('1', 0, 'Which factor is NOT important in forestry planning?', '["Biodiversity", "Water quality", "Social media trends", "Soil health"]', 2),
('1', 0, 'What does RLS stand for in forestry?', '["Reduced Logging System", "Responsible Land Stewardship", "Random Location Selection", "Root Level Support"]', 1),
('1', 0, 'How often should forest health be monitored?', '["Once a decade", "Regularly throughout the year", "Only after disasters", "Never"]', 1),
('1', 0, 'What is the main benefit of mixed-species forests?', '["Easier harvesting", "Greater ecosystem resilience", "Faster growth", "Less maintenance"]', 1);

-- Insert module test questions for Course 1, Module 1
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 1, 'Why are native tree species preferred?', '["They grow faster", "They support local ecosystems and require less maintenance", "They are cheaper", "They look better"]', 1),
('1', 1, 'What climate factor is crucial for tree selection?', '["Political climate", "Temperature ranges and rainfall patterns", "Market climate", "Social climate"]', 1),
('1', 1, 'Which region is best suited for Oak trees?', '["Tropical", "Temperate", "Arctic", "Desert"]', 1),
('1', 1, 'What should you consider for carbon sequestration?', '["Tree height only", "Species growth rate and longevity", "Leaf color", "Root depth only"]', 1),
('1', 1, 'What is a disadvantage of non-native species?', '["Too slow growing", "May disrupt local ecosystems", "Too expensive", "Always fail"]', 1);

-- Insert module test questions for Course 1, Module 2
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 2, 'What is the ideal soil pH for most trees?', '["3.0-4.0", "6.0-7.5", "9.0-10.0", "11.0-12.0"]', 1),
('1', 2, 'Why is soil testing important?', '["It is not important", "To understand nutrient levels and pH", "Only for appearance", "To determine color"]', 1),
('1', 2, 'What improves soil drainage?', '["Adding clay", "Adding organic matter and sand", "Compacting soil", "Adding rocks"]', 1),
('1', 2, 'When should you amend soil?', '["After planting", "Before planting", "Never", "Only in winter"]', 1),
('1', 2, 'What does tilling accomplish?', '["Compacts soil", "Aerates and loosens soil", "Kills all organisms", "Removes nutrients"]', 1);

-- Insert module test questions for Course 1, Module 3
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 3, 'How wide should the planting hole be?', '["Same as root ball", "2-3 times wider than root ball", "As small as possible", "10 feet wide"]', 1),
('1', 3, 'What is a common planting mistake?', '["Watering after planting", "Planting too deep", "Using good soil", "Proper spacing"]', 1),
('1', 3, 'When is the best time to plant trees?', '["Summer heat", "Spring or Fall", "Mid-winter", "Any time"]', 1),
('1', 3, 'What should you do with root-bound roots?', '["Leave them as is", "Gently loosen and spread them", "Cut them all off", "Tie them together"]', 1),
('1', 3, 'Why mulch around trees?', '["For decoration only", "Retains moisture and suppresses weeds", "To attract pests", "No reason"]', 1);

-- Insert module test questions for Course 1, Module 4
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 4, 'How often should new trees be watered?', '["Once a month", "Deeply and regularly, especially in first year", "Never", "Every hour"]', 1),
('1', 4, 'What indicates overwatering?', '["Dry leaves", "Yellowing leaves and soggy soil", "Strong growth", "Deep roots"]', 1),
('1', 4, 'When is the best time to water?', '["Midday sun", "Early morning or evening", "Only at night", "During rain"]', 1),
('1', 4, 'Why is deep watering better than frequent shallow watering?', '["It is not better", "Encourages deep root growth", "Saves time only", "Looks better"]', 1),
('1', 4, 'What maintenance task is essential?', '["Painting trunk", "Regular inspection and pruning dead branches", "Daily fertilizing", "Constant digging"]', 1);

-- Insert module test questions for Course 1, Module 5
INSERT INTO public.module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 5, 'What is selective cutting?', '["Cutting all trees", "Removing specific trees while maintaining forest structure", "Random cutting", "Cutting youngest trees"]', 1),
('1', 5, 'Why leave dead standing trees?', '["They look nice", "Provide wildlife habitat", "Save work", "No reason"]', 1),
('1', 5, 'What is forest regeneration?', '["Painting trees", "Natural or assisted regrowth after harvesting", "Building roads", "Removing all vegetation"]', 1),
('1', 5, 'How does thinning benefit forests?', '["It does not", "Reduces competition and promotes healthy growth", "Kills trees", "Wastes resources"]', 1),
('1', 5, 'What is sustainable harvesting?', '["Taking everything", "Harvesting at a rate that allows regeneration", "Never harvesting", "Random harvesting"]', 1);