-- Add 5 more questions to Course 1 modules (to make 10 total per module)
-- Module 0: Introduction to Sustainable Forestry
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 0, 'What is the main goal of sustainable forestry?', '["Maximize timber production", "Balance environmental, social, and economic needs", "Clear-cut all forests", "Plant only exotic species"]', 1),
('1', 0, 'Which practice is NOT part of sustainable forestry?', '["Selective cutting", "Clear-cutting without replanting", "Maintaining biodiversity", "Protecting water resources"]', 1),
('1', 0, 'What role do forests play in climate change?', '["They emit carbon dioxide", "They absorb and store carbon dioxide", "They have no effect", "They only produce oxygen"]', 1),
('1', 0, 'Why is biodiversity important in forests?', '["It makes forests look nice", "It ensures ecosystem resilience and health", "It increases timber yield", "It has no importance"]', 1),
('1', 0, 'What is forest certification?', '["A license to cut trees", "Verification that forests are managed sustainably", "A degree in forestry", "A tree planting permit"]', 1);

-- Module 1: Tree Species Selection
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 1, 'Why are native species preferred in reforestation?', '["They are cheaper", "They adapt better to local conditions", "They grow faster", "They look better"]', 1),
('1', 1, 'What is a pioneer species?', '["A rare tree", "An early colonizer after disturbance", "An exotic tree", "A slow-growing tree"]', 1),
('1', 1, 'Which factor is MOST important when selecting tree species?', '["Tree height", "Climate compatibility", "Leaf color", "Branch pattern"]', 1),
('1', 1, 'What is monoculture planting?', '["Planting one species over large areas", "Planting many species together", "Planting in rows", "Planting at night"]', 0),
('1', 1, 'Why should you avoid monoculture?', '["It costs more", "It increases vulnerability to pests and diseases", "Trees grow too tall", "It takes longer"]', 1);

-- Module 2: Planting Techniques
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 2, 'What is the best time to plant bare-root seedlings?', '["Mid-summer", "During dormancy (late fall or early spring)", "During flowering", "Never"]', 1),
('1', 2, 'How deep should you plant a tree seedling?', '["Very deep", "At the same depth as it was in the nursery", "With roots exposed", "Twice as deep"]', 1),
('1', 2, 'What spacing is recommended for most tree plantations?', '["As close as possible", "6-10 feet apart", "100 feet apart", "Random spacing"]', 1),
('1', 2, 'Why is watering critical after planting?', '["To wash away soil", "To help establish roots and reduce transplant shock", "To attract wildlife", "It is not necessary"]', 1),
('1', 2, 'What is hardening off?', '["Making trees taller", "Gradually acclimating seedlings to outdoor conditions", "Cutting branches", "Fertilizing heavily"]', 1);

-- Module 3: Forest Health & Pest Management
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 3, 'What is Integrated Pest Management (IPM)?', '["Using only chemical pesticides", "A holistic approach combining multiple pest control methods", "Ignoring pests", "Cutting all infected trees"]', 1),
('1', 3, 'What are common signs of tree disease?', '["Healthy green leaves", "Discolored leaves, cankers, and die-back", "Strong growth", "Many flowers"]', 1),
('1', 3, 'How can you prevent pest outbreaks?', '["Plant monocultures", "Maintain diverse, healthy forests", "Never inspect trees", "Remove all insects"]', 1),
('1', 3, 'What is a biological control method?', '["Using chemicals", "Using natural predators to control pests", "Cutting trees", "Burning forests"]', 1),
('1', 3, 'When should you remove a diseased tree?', '["Never", "When it poses risk to surrounding trees", "Always immediately", "Only in winter"]', 1);

-- Module 4: Harvesting Practices
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 4, 'What is selective cutting?', '["Cutting all trees", "Removing specific trees while maintaining forest structure", "Cutting only young trees", "Random cutting"]', 1),
('1', 4, 'Why is directional felling important?', '["To save time", "To control where trees fall and minimize damage", "To impress others", "It is not important"]', 1),
('1', 4, 'What is the purpose of leaving snags?', '["They look nice", "They provide wildlife habitat", "They block views", "They are dangerous"]', 1),
('1', 4, 'What is a buffer zone?', '["A logging area", "Protected area along waterways", "An open field", "A parking lot"]', 1),
('1', 4, 'What safety equipment is essential for logging?', '["Sunglasses only", "Hard hat, chainsaw chaps, and hearing protection", "No equipment needed", "Just gloves"]', 1);

-- Module 5: Long-term Forest Management
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('1', 5, 'What is a forest management plan?', '["A hiking map", "A document outlining long-term goals and practices", "A planting schedule only", "A timber sales record"]', 1),
('1', 5, 'How often should forests be monitored?', '["Never", "Regularly (at least annually)", "Only when problems arise", "Every 10 years"]', 1),
('1', 5, 'What is natural regeneration?', '["Planting seeds by hand", "Allowing forests to regrow naturally", "Fertilizing heavily", "Cutting all trees"]', 1),
('1', 5, 'Why is record-keeping important in forest management?', '["It is not important", "To track progress and make informed decisions", "For tax purposes only", "To show off"]', 1),
('1', 5, 'What is adaptive management?', '["Never changing plans", "Adjusting practices based on monitoring results", "Following old methods only", "Random decision-making"]', 1);

-- Course 2: Solar Panel Installation & Maintenance (8 modules, 10 questions each)
INSERT INTO module_test_questions (course_id, module_id, question, options, correct_answer) VALUES
('2', 0, 'What is a photovoltaic cell?', '["A battery", "A device that converts sunlight into electricity", "A solar heater", "A panel frame"]', 1),
('2', 0, 'What are the two main types of solar panels?', '["Big and small", "Monocrystalline and polycrystalline", "Red and blue", "Indoor and outdoor"]', 1),
('2', 0, 'What is solar irradiance?', '["Panel temperature", "The power of solar radiation per unit area", "Panel size", "Battery capacity"]', 1),
('2', 0, 'What is the efficiency of typical residential solar panels?', '["5-10%", "15-22%", "50-60%", "80-90%"]', 1),
('2', 0, 'What is the peak sun hour?', '["Noon only", "One hour of sunlight at 1000 W/m²", "Dawn", "Midnight"]', 1),
('2', 0, 'Why are solar panels rated in watts?', '["It sounds professional", "To indicate their power output under standard conditions", "For shipping purposes", "Random choice"]', 1),
('2', 0, 'What is the difference between AC and DC power?', '["No difference", "AC alternates direction, DC flows in one direction", "AC is stronger", "DC is for batteries only"]', 1),
('2', 0, 'What role does a solar inverter play?', '["Stores energy", "Converts DC to AC power", "Cools panels", "Measures sunlight"]', 1),
('2', 0, 'What is a solar array?', '["A single panel", "Multiple panels connected together", "A battery bank", "A mounting structure"]', 1),
('2', 0, 'What affects solar panel output the most?', '["Panel color", "Sunlight intensity and angle", "Panel weight", "Brand name"]', 1),
('2', 1, 'What is the first step in solar site assessment?', '["Installing panels", "Evaluating roof condition and orientation", "Buying equipment", "Hiring workers"]', 1),
('2', 1, 'What roof orientation is best in the Northern Hemisphere?', '["North", "South", "East or West", "It does not matter"]', 1),
('2', 1, 'What is shading analysis?', '["Painting analysis", "Identifying objects that block sunlight", "Color selection", "Temperature check"]', 1),
('2', 1, 'What is the ideal roof pitch for solar panels?', '["Flat", "15-40 degrees", "90 degrees vertical", "Upside down"]', 1),
('2', 1, 'Why is structural assessment important?', '["For aesthetics", "To ensure the roof can support panel weight", "For insurance", "It is not important"]', 1),
('2', 1, 'What tool is used for shading analysis?', '["Hammer", "Solar pathfinder or shading analyzer", "Ruler", "Thermometer"]', 1),
('2', 1, 'What is solar access?', '["Building entry", "The amount of sunlight reaching a location", "Panel storage", "Warranty terms"]', 1),
('2', 1, 'What permits are typically required for solar installation?', '["None", "Building and electrical permits", "Driving permit", "Tree cutting permit"]', 1),
('2', 1, 'What is a solar site survey?', '["Customer interview", "Comprehensive evaluation of installation location", "Panel counting", "Price quote"]', 1),
('2', 1, 'Why should you check local regulations?', '["You should not", "They may restrict installation or require specific standards", "For fun", "To delay project"]', 1),
('2', 2, 'What are the main components of a solar system?', '["Panels only", "Panels, inverter, mounting, and wiring", "Just batteries", "Only an inverter"]', 1),
('2', 2, 'What is a string inverter?', '["A rope", "An inverter connected to multiple panels in series", "A battery", "A mounting bracket"]', 1),
('2', 2, 'What are microinverters?', '["Tiny batteries", "Individual inverters for each panel", "Small panels", "Wiring connectors"]', 1),
('2', 2, 'What is system sizing?', '["Panel dimensions", "Calculating system capacity to meet energy needs", "Inverter weight", "Wire length"]', 1),
('2', 2, 'What is a charge controller used for?', '["Cleaning panels", "Regulating battery charging from panels", "Measuring voltage", "Cooling system"]', 1),
('2', 2, 'What voltage do residential solar systems typically use?', '["1000V", "240V or 48V DC", "12V only", "5V"]', 1),
('2', 2, 'What is the purpose of a combiner box?', '["Storing tools", "Combining multiple strings into one output", "Mixing chemicals", "Housing batteries"]', 1),
('2', 2, 'What type of wiring is used for solar systems?', '["Any wire", "UV-resistant, appropriately rated DC cable", "Speaker wire", "String"]', 1),
('2', 2, 'What is a grid-tied system?', '["Isolated system", "System connected to utility grid", "Battery-only system", "Portable system"]', 1),
('2', 2, 'What is an off-grid system?', '["Connected to grid", "Independent system with battery storage", "No solar panels", "Only during day"]', 1),
('2', 3, 'What is the first step in solar panel installation?', '["Connect wires", "Install mounting rails", "Test system", "Paint roof"]', 1),
('2', 3, 'What type of mounting is used for pitched roofs?', '["Glue", "Rail mounting with roof penetrations", "Magnets", "Rope"]', 1),
('2', 3, 'How should roof penetrations be sealed?', '["Leave open", "With appropriate flashing and sealant", "With tape", "With paint"]', 1),
('2', 3, 'What is the proper panel installation angle?', '["Flat", "Equal to latitude or optimized for season", "90 degrees", "Upside down"]', 1),
('2', 3, 'How should panels be grounded?', '["They should not be", "Connected to building ground system", "With plastic", "Buried in soil"]', 1),
('2', 3, 'What safety measure is critical during installation?', '["Working alone", "Fall protection and electrical safety", "Working at night", "No precautions needed"]', 1),
('2', 3, 'How are panels typically connected?', '["Glue", "MC4 connectors for electrical connections", "Velcro", "Wire nuts"]', 1),
('2', 3, 'Where should the inverter be installed?', '["Anywhere", "In a cool, shaded location near panels", "In direct sun", "Underground"]', 1),
('2', 3, 'What is commissioning?', '["Selling the system", "Testing and verifying system operation", "Painting panels", "Advertising"]', 1),
('2', 3, 'What should be done after installation?', '["Leave immediately", "Inspect, test, and document the system", "Remove tools only", "Wait and see"]', 1),
('2', 4, 'What is DC disconnect used for?', '["Music", "Safely isolating DC power from panels", "Temperature control", "Panel cleaning"]', 1),
('2', 4, 'What is AC disconnect used for?', '["Cooling", "Isolating AC power to grid", "Panel mounting", "Measuring sun"]', 1),
('2', 4, 'Why is proper wire sizing important?', '["Aesthetics", "To prevent overheating and voltage drop", "For color coding", "Not important"]', 1),
('2', 4, 'What is a rapid shutdown system?', '["Fast installation", "Safety feature to quickly de-energize panels", "Quick cleaning", "Instant power"]', 1),
('2', 4, 'What color is positive DC wiring typically?', '["Black", "Red", "Green", "Yellow"]', 1),
('2', 4, 'What is the purpose of conduit?', '["Water pipe", "Protecting electrical wiring", "Air vent", "Decoration"]', 1),
('2', 4, 'What voltage can solar panels produce?', '["Only 12V", "Varies, typically 30-50V per panel", "1V", "1000V per panel"]', 1),
('2', 4, 'What safety equipment is required for electrical work?', '["None", "Insulated tools, gloves, and voltage testers", "Just gloves", "Sunglasses"]', 1),
('2', 4, 'What is a ground fault?', '["Panel damage", "Unintended current path to ground", "Wire color", "Mounting issue"]', 1),
('2', 4, 'Why must you turn off power before working?', '["It is optional", "To prevent electric shock and injury", "To save energy", "For fun"]', 1),
('2', 5, 'What should be tested first after installation?', '["Nothing", "Voltage and continuity", "Panel color", "Roof strength"]', 1),
('2', 5, 'What tool measures DC voltage?', '["Hammer", "Multimeter", "Ruler", "Camera"]', 1),
('2', 5, 'What is open circuit voltage (Voc)?', '["Zero voltage", "Voltage with no load connected", "Maximum current", "Panel temperature"]', 1),
('2', 5, 'What is short circuit current (Isc)?', '["Zero current", "Current when panel terminals are shorted", "Voltage reading", "Panel weight"]', 1),
('2', 5, 'What should inverter display show when working?', '["Nothing", "Power output and system status", "Time only", "Error codes"]', 1),
('2', 5, 'What is an I-V curve?', '["Installation guide", "Graph showing panel current vs voltage performance", "Panel shape", "Mounting pattern"]', 1),
('2', 5, 'Why perform insulation resistance testing?', '["Not necessary", "To detect wiring faults and ensure safety", "For appearance", "To measure sun"]', 1),
('2', 5, 'What documents should be provided to customer?', '["None", "Installation manual, warranties, and system documentation", "Bill only", "Nothing"]', 1),
('2', 5, 'What is system monitoring?', '["Watching panels", "Tracking energy production and system health", "Counting panels", "Taking photos"]', 1),
('2', 5, 'When should final inspection occur?', '["Never", "After installation and successful testing", "Before installation", "Years later"]', 1),
('2', 6, 'How often should panels be cleaned?', '["Never", "Every 2-4 weeks depending on environment", "Daily", "Once in lifetime"]', 1),
('2', 6, 'What causes reduced panel output?', '["Good weather", "Dirt, shading, or equipment failure", "Proper installation", "New panels"]', 1),
('2', 6, 'What is hot spot formation?', '["Good sign", "Localized heating from shading or damage", "Normal operation", "Panel feature"]', 1),
('2', 6, 'How do you clean solar panels?', '["With acid", "With water and soft brush", "Never clean them", "With pressure washer"]', 1),
('2', 6, 'What should be checked during maintenance?', '["Nothing", "Connections, mounting, and system performance", "Panel color only", "Roof only"]', 1),
('2', 6, 'What indicates inverter failure?', '["Normal operation", "Error codes or no power output", "High production", "Clean panels"]', 1),
('2', 6, 'What is thermal imaging used for?', '["Entertainment", "Detecting hot spots and failures", "Cleaning", "Measuring weight"]', 1),
('2', 6, 'How long do solar panels typically last?', '["1 year", "25-30 years", "5 years", "Forever"]', 1),
('2', 6, 'What warranty do panels usually have?', '["No warranty", "25-year power output warranty", "1 year", "90 days"]', 1),
('2', 6, 'When should you call a professional?', '["Never", "For electrical issues or major problems", "For everything", "To clean panels"]', 1),
('2', 7, 'What is battery storage?', '["Panel storage", "Storing excess solar energy for later use", "Inverter backup", "Tool storage"]', 1),
('2', 7, 'What type of battery is common in solar systems?', '["Car battery", "Lithium-ion or lead-acid", "AA battery", "Button cell"]', 1),
('2', 7, 'What is net metering?', '["Panel measurement", "Selling excess power back to grid", "Counting panels", "Internet monitoring"]', 1),
('2', 7, 'What is solar panel degradation?', '["Instant failure", "Gradual reduction in performance over time", "Panel color change", "Warranty term"]', 1),
('2', 7, 'What is a power optimizer?', '["Battery", "Device that maximizes individual panel output", "Cleaning tool", "Mounting bracket"]', 1),
('2', 7, 'What is MPPT?', '["Panel type", "Maximum Power Point Tracking for efficiency", "Mounting method", "Wire size"]', 1),
('2', 7, 'What is solar tracking?', '["Following the sun", "System that moves panels to follow the sun", "Monitoring app", "Panel counting"]', 1),
('2', 7, 'What is bifacial solar technology?', '["Two inverters", "Panels that capture light from both sides", "Double wiring", "Two-story installation"]', 1),
('2', 7, 'What is a hybrid solar system?', '["Gas and solar", "System combining grid-tied and battery storage", "Mixed panel types", "Two roofs"]', 1),
('2', 7, 'What future trend is emerging in solar?', '["Smaller panels", "Perovskite cells and higher efficiency", "Heavier panels", "No trends"]', 1);