import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ModuleTest from "@/components/ModuleTest";
import ModuleCertificate from "@/components/ModuleCertificate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Circle,
  BookOpen,
  Video,
  FileText,
  Award,
  Trophy,
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [showModuleTest, setShowModuleTest] = useState(false);
  const [moduleCertificates, setModuleCertificates] = useState<any[]>([]);
  const [currentModuleCertificate, setCurrentModuleCertificate] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    if (courseId) {
      loadProgress();
      loadModuleCertificates();
    }
  }, [courseId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUser(user);
    }
  };

  const loadModuleCertificates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("module_certificates")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (data) {
      setModuleCertificates(data);
    }
  };

  const hasModuleCertificate = (moduleId: number) => {
    return moduleCertificates.some((cert) => cert.module_id === moduleId);
  };

  const getModuleCertificate = (moduleId: number) => {
    return moduleCertificates.find((cert) => cert.module_id === moduleId);
  };

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (data) {
      setCompletedModules(data.completed_modules || []);
      setProgress(data.progress_percentage || 0);
    }
  };

  const saveProgress = async (modules: number[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const progressPercentage = (modules.length / course.totalModules) * 100;

    await supabase
      .from("course_progress")
      .upsert({
        user_id: user.id,
        course_id: courseId!,
        completed_modules: modules,
        progress_percentage: progressPercentage,
        last_accessed: new Date().toISOString(),
      }, {
        onConflict: "user_id,course_id"
      });

    setProgress(progressPercentage);
  };

  // Mock course data - in a real app, this would come from an API
  const courses = {
    "1": {
      title: "Tree Plantation & Forest Management",
      description: "Learn the fundamentals of tree planting, species selection, and long-term forest care.",
      level: "Beginner",
      totalModules: 6,
      modules: [
        {
          id: 0,
          title: "Introduction to Forestry",
          type: "video",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/etTwv3I4iXk",
          content: "Welcome to Tree Plantation & Forest Management. In this module, you'll learn the basics of sustainable forestry practices."
        },
        {
          id: 1,
          title: "Selecting the Right Tree Species",
          type: "text",
          duration: "20 min",
          content: `# Selecting the Right Tree Species
          
When selecting trees for plantation, consider the following factors:

## Climate Compatibility
- Temperature ranges in your region
- Rainfall patterns and water availability
- Soil type and pH levels

## Native vs. Non-Native Species
Native species are generally preferred as they:
- Support local ecosystems
- Require less maintenance
- Are more resistant to local pests

## Purpose of Plantation
Consider whether you're planting for:
- Carbon sequestration
- Timber production
- Wildlife habitat
- Soil stabilization

## Common Species by Region
**Tropical Regions:** Teak, Mahogany, Eucalyptus
**Temperate Regions:** Oak, Maple, Pine
**Arid Regions:** Acacia, Mesquite, Tamarisk`
        },
        {
          id: 2,
          title: "Soil Preparation Techniques",
          type: "video",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/1RMHV30tE9Y",
          content: "Learn proper soil preparation methods for optimal tree growth."
        },
        {
          id: 3,
          title: "Planting Methods and Best Practices",
          type: "text",
          duration: "25 min",
          content: `# Planting Methods and Best Practices

## When to Plant
- Best seasons: Spring or Fall
- Avoid extreme weather conditions
- Consider local climate patterns

## Step-by-Step Planting Process
1. **Dig the Hole:** Make it 2-3 times wider than the root ball
2. **Check Depth:** Tree should sit at the same level as in the nursery
3. **Remove Container:** Carefully extract the tree
4. **Position:** Place tree in center of hole
5. **Backfill:** Use original soil mixed with compost
6. **Water:** Deep watering immediately after planting
7. **Mulch:** Apply 2-4 inches around the base

## Common Mistakes to Avoid
- Planting too deep
- Not loosening root-bound roots
- Insufficient watering
- Placing mulch against the trunk`
        },
        {
          id: 4,
          title: "Watering and Maintenance",
          type: "video",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Master the art of proper tree watering and ongoing care."
        },
        {
          id: 5,
          title: "Long-term Forest Management",
          type: "text",
          duration: "30 min",
          content: `# Long-term Forest Management

## Monitoring Tree Health
Regular inspections should check for:
- Pest infestations
- Disease symptoms
- Growth patterns
- Structural integrity

## Pruning and Thinning
- Remove dead or diseased branches
- Thin overcrowded areas
- Shape young trees for proper structure
- Best time: Late winter or early spring

## Sustainable Harvesting
If harvesting timber:
- Use selective cutting methods
- Maintain forest density
- Allow regeneration time
- Protect soil and water resources

## Creating Wildlife Habitat
- Leave some dead trees standing (snags)
- Maintain diverse age classes of trees
- Preserve understory vegetation
- Create buffer zones near water`
        }
      ]
    },
    "2": {
      title: "Solar Panel Installation & Maintenance",
      description: "Master solar panel setup, maintenance, and troubleshooting.",
      level: "Intermediate",
      totalModules: 8,
      modules: [
        {
          id: 0,
          title: "Introduction to Solar Energy",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding solar energy fundamentals, photovoltaic technology, and how solar panels convert sunlight into electricity."
        },
        {
          id: 1,
          title: "Types of Solar Panel Systems",
          type: "text",
          duration: "25 min",
          content: `# Types of Solar Panel Systems

## Grid-Tied Systems
- Connected to utility grid
- Net metering benefits
- No battery backup
- Most cost-effective option

## Off-Grid Systems
- Complete independence from utility
- Requires battery storage
- Higher upfront costs
- Ideal for remote locations

## Hybrid Systems
- Combines grid connection with batteries
- Backup power during outages
- Optimal energy management
- Flexibility and reliability

## Components
- Solar panels
- Inverters (string, micro, or power optimizers)
- Mounting systems
- Monitoring equipment`
        },
        {
          id: 2,
          title: "Site Assessment and Planning",
          type: "video",
          duration: "22 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Learn how to evaluate roof conditions, sun exposure, shading analysis, and structural requirements."
        },
        {
          id: 3,
          title: "Installation Process",
          type: "text",
          duration: "30 min",
          content: `# Solar Panel Installation Process

## Safety First
- Personal protective equipment (PPE)
- Fall protection systems
- Electrical safety protocols
- Proper tool handling

## Installation Steps
1. **Mount Installation**: Secure mounting brackets
2. **Panel Placement**: Position and secure panels
3. **Wiring**: Connect panels in series/parallel
4. **Inverter Setup**: Install and configure
5. **Electrical Connection**: Connect to breaker box
6. **System Testing**: Verify all connections

## Best Practices
- Follow local electrical codes
- Ensure proper grounding
- Optimize panel orientation
- Document installation`
        },
        {
          id: 4,
          title: "System Monitoring",
          type: "video",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding monitoring systems, performance metrics, and troubleshooting common issues."
        },
        {
          id: 5,
          title: "Maintenance and Troubleshooting",
          type: "text",
          duration: "28 min",
          content: `# Solar Panel Maintenance

## Regular Maintenance
- Clean panels every 2-4 weeks
- Inspect for damage or debris
- Check mounting hardware
- Monitor system performance
- Verify inverter operation

## Common Issues
- **Hot Spots**: Caused by shading or defects
- **Micro-cracks**: Physical damage to cells
- **Inverter Errors**: Check display codes
- **Reduced Output**: Clean panels or check connections

## Troubleshooting Steps
1. Check monitoring system
2. Visual inspection
3. Electrical testing
4. Clean if necessary
5. Contact professional if needed`
        },
        {
          id: 6,
          title: "Safety and Regulations",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding electrical codes, permitting requirements, and safety standards."
        },
        {
          id: 7,
          title: "Economic Benefits and ROI",
          type: "text",
          duration: "25 min",
          content: `# Solar Energy Economics

## Financial Benefits
- Reduced electricity bills
- Tax incentives and rebates
- Increased property value
- Net metering credits

## Return on Investment
- Typical payback: 6-10 years
- 25+ year system lifespan
- Long-term savings potential
- Protection from rate increases

## Calculating ROI
1. System cost minus incentives
2. Annual energy savings
3. Maintenance costs
4. Energy rate escalation
5. System production over time

## Financing Options
- Cash purchase
- Solar loans
- Power purchase agreements (PPAs)
- Solar leases`
        }
      ]
    },
    "3": {
      title: "Water Conservation Methods",
      description: "Discover water-saving techniques and conservation practices.",
      level: "Beginner",
      totalModules: 5,
      modules: [
        {
          id: 0,
          title: "Water Crisis Overview",
          type: "video",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding global water scarcity, the importance of conservation, and the impact of water waste."
        },
        {
          id: 1,
          title: "Indoor Water Conservation",
          type: "text",
          duration: "20 min",
          content: `# Indoor Water Conservation

## Bathroom Conservation
- Install low-flow showerheads (saves 2,700 gal/year)
- Fix leaky faucets and toilets
- Take shorter showers
- Turn off tap while brushing teeth
- Use dual-flush toilets

## Kitchen Efficiency
- Run dishwasher only when full
- Use basin for washing dishes
- Keep drinking water in fridge
- Steam vegetables instead of boiling
- Install aerators on faucets

## Laundry Best Practices
- Wash full loads only
- Use cold water when possible
- Choose high-efficiency machines
- Reuse towels multiple times

## Leak Detection
- Check water meter regularly
- Inspect pipes and fixtures
- Look for water stains
- Monitor water bills`
        },
        {
          id: 2,
          title: "Outdoor Water Management",
          type: "video",
          duration: "22 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Learn efficient irrigation, xeriscaping, and landscape water management techniques."
        },
        {
          id: 3,
          title: "Rainwater Harvesting",
          type: "text",
          duration: "25 min",
          content: `# Rainwater Harvesting Systems

## System Components
- Catchment area (roof)
- Gutters and downspouts
- First flush diverter
- Storage tank/rain barrel
- Filtration system
- Distribution system

## Benefits
- Reduces water bills
- Decreases stormwater runoff
- Provides irrigation water
- Emergency water supply
- Reduces strain on municipal systems

## Installation Steps
1. Calculate roof catchment area
2. Size storage appropriately
3. Install collection system
4. Add filtration
5. Connect to distribution
6. Maintain regularly

## Uses
- Garden irrigation
- Toilet flushing
- Car washing
- Outdoor cleaning
- Emergency non-potable use`
        },
        {
          id: 4,
          title: "Greywater Systems",
          type: "text",
          duration: "20 min",
          content: `# Greywater Reuse

## What is Greywater?
Used water from:
- Sinks
- Showers
- Washing machines
- Bathtubs

NOT from toilets (blackwater)

## Safe Reuse Practices
- Use biodegradable soaps
- Avoid contaminated water
- Don't store more than 24 hours
- Filter before landscape use
- Rotate irrigation areas

## Simple Systems
- Laundry-to-landscape
- Branched drain systems
- Mulch basin irrigation
- Constructed wetlands

## Benefits
- Reduces water consumption 30-50%
- Decreases wastewater treatment load
- Provides nutrients to plants
- Cost-effective solution`
        }
      ]
    },
    "4": {
      title: "Renewable Energy Basics",
      description: "Understanding wind, solar, hydro power and their applications.",
      level: "Beginner",
      totalModules: 7,
      modules: [
        {
          id: 0,
          title: "Introduction to Renewable Energy",
          type: "video",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Overview of renewable energy sources, their importance, and the global transition to clean energy."
        },
        {
          id: 1,
          title: "Solar Energy Fundamentals",
          type: "text",
          duration: "22 min",
          content: `# Solar Energy

## How It Works
- Photovoltaic cells convert sunlight to electricity
- Concentrated solar power uses mirrors
- Passive solar for heating and lighting

## Advantages
- Abundant and inexhaustible
- No emissions during operation
- Decreasing costs
- Scalable from small to utility-scale

## Applications
- Residential rooftop systems
- Solar farms
- Solar water heating
- Off-grid power
- Solar-powered devices

## Limitations
- Intermittent (depends on sunlight)
- Requires storage solutions
- Weather dependent
- Initial installation costs`
        },
        {
          id: 2,
          title: "Wind Power",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding wind turbines, wind farm operations, and small-scale wind energy systems."
        },
        {
          id: 3,
          title: "Hydroelectric Power",
          type: "text",
          duration: "24 min",
          content: `# Hydroelectric Energy

## Types of Systems
- **Impoundment**: Large dams and reservoirs
- **Diversion**: Run-of-river systems
- **Pumped Storage**: Energy storage solution

## How It Works
1. Water flows through dam
2. Turns turbine blades
3. Generator produces electricity
4. Power transmitted to grid

## Benefits
- Reliable baseload power
- Long lifespan (50-100 years)
- Energy storage capability
- Flood control and irrigation

## Environmental Considerations
- Fish migration impacts
- Ecosystem changes
- Sediment accumulation
- Methane emissions from reservoirs`
        },
        {
          id: 4,
          title: "Geothermal and Biomass",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Exploring geothermal heat pumps, power plants, and biomass energy generation."
        },
        {
          id: 5,
          title: "Energy Storage Solutions",
          type: "text",
          duration: "26 min",
          content: `# Energy Storage Technologies

## Battery Storage
- Lithium-ion batteries
- Flow batteries
- Solid-state batteries
- Grid-scale installations

## Mechanical Storage
- Pumped hydro storage
- Compressed air energy storage (CAES)
- Flywheel energy storage

## Thermal Storage
- Molten salt systems
- Ice storage
- Hot water tanks

## Importance
- Addresses intermittency
- Grid stability
- Peak demand management
- Enables high renewable penetration

## Future Technologies
- Hydrogen storage
- Gravity storage
- Advanced batteries`
        },
        {
          id: 6,
          title: "The Future of Clean Energy",
          type: "text",
          duration: "22 min",
          content: `# Future of Renewable Energy

## Emerging Technologies
- Floating solar farms
- Offshore wind
- Wave and tidal energy
- Advanced nuclear (SMRs)
- Green hydrogen

## Grid Modernization
- Smart grids
- Distributed generation
- Microgrids
- AI-optimized systems

## Global Trends
- Costs declining rapidly
- Policy support increasing
- Corporate renewable commitments
- 100% renewable goals

## Career Opportunities
- Installation and maintenance
- Project development
- Energy analysis
- Policy and advocacy
- Research and innovation`
        }
      ]
    },
    "5": {
      title: "Waste Management & Recycling",
      description: "Learn waste sorting, recycling processes, and circular economy principles.",
      level: "Beginner",
      totalModules: 6,
      modules: [
        {
          id: 0,
          title: "Waste Management Overview",
          type: "video",
          duration: "16 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding waste hierarchy, global waste crisis, and the importance of proper waste management."
        },
        {
          id: 1,
          title: "The 3 Rs: Reduce, Reuse, Recycle",
          type: "text",
          duration: "20 min",
          content: `# Waste Reduction Principles

## Reduce (Most Important)
- Buy less, choose quality
- Avoid single-use items
- Choose products with less packaging
- Go digital when possible
- Plan purchases carefully

## Reuse
- Repair instead of replace
- Donate or sell unwanted items
- Use reusable bags and containers
- Refill instead of buying new
- Creative repurposing

## Recycle (Last Resort)
- Know local recycling rules
- Clean and sort properly
- Understand recycling numbers
- Don't wishcycle (contamination)
- Close the loop by buying recycled

## Beyond the 3 Rs
- Refuse: Say no to unnecessary items
- Rot: Compost organic waste
- Rethink: Question consumption patterns`
        },
        {
          id: 2,
          title: "Recycling Systems",
          type: "video",
          duration: "22 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "How recycling facilities work, material processing, and what happens to recycled materials."
        },
        {
          id: 3,
          title: "Composting Basics",
          type: "text",
          duration: "24 min",
          content: `# Composting Organic Waste

## What Can Be Composted?
**Greens (Nitrogen-rich):**
- Fruit and vegetable scraps
- Coffee grounds and filters
- Fresh grass clippings
- Plant trimmings

**Browns (Carbon-rich):**
- Dry leaves
- Shredded newspaper
- Cardboard
- Wood chips

## What NOT to Compost
- Meat and fish
- Dairy products
- Oils and fats
- Pet waste
- Diseased plants

## Composting Methods
- **Bin Composting**: Contained system
- **Heap Composting**: Open pile
- **Vermicomposting**: Using worms
- **Bokashi**: Fermentation method

## Maintaining Compost
- Balance greens and browns
- Keep moist but not wet
- Turn regularly for aeration
- Monitor temperature
- Wait 2-12 months for finished compost`
        },
        {
          id: 4,
          title: "E-Waste Management",
          type: "video",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Handling electronic waste properly, data security, and recycling electronics responsibly."
        },
        {
          id: 5,
          title: "Circular Economy",
          type: "text",
          duration: "25 min",
          content: `# Circular Economy Principles

## Linear vs Circular
**Linear Economy:** Take → Make → Dispose
**Circular Economy:** Reduce → Reuse → Recycle → Regenerate

## Core Principles
1. Design out waste and pollution
2. Keep products and materials in use
3. Regenerate natural systems

## Business Models
- Product as a service
- Sharing platforms
- Product life extension
- Resource recovery
- Circular supplies

## Benefits
- Reduced resource extraction
- Lower emissions
- Economic opportunities
- Job creation
- System resilience

## Examples
- Repair cafes
- Textile recycling programs
- Industrial symbiosis
- Modular product design
- Take-back programs

## Individual Actions
- Support circular businesses
- Choose durable products
- Participate in sharing economy
- Advocate for policy changes`
        }
      ]
    },
    "6": {
      title: "Energy Efficiency Auditing",
      description: "Conduct professional energy audits and identify savings.",
      level: "Advanced",
      totalModules: 9,
      modules: [
        {
          id: 0,
          title: "Introduction to Energy Auditing",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding energy audits, their importance, and the auditing process."
        },
        {
          id: 1,
          title: "Audit Types and Methods",
          type: "text",
          duration: "25 min",
          content: `# Energy Audit Levels

## Level 1: Walk-Through Audit
- Visual inspection
- Utility bill analysis
- Basic recommendations
- Low cost, quick assessment
- 2-4 hours duration

## Level 2: Detailed Audit
- Comprehensive survey
- Detailed measurements
- Energy modeling
- Cost-benefit analysis
- 1-2 days duration

## Level 3: Investment Grade Audit
- Detailed engineering analysis
- Sub-metering and monitoring
- Detailed financial analysis
- Design specifications
- Several weeks duration

## Audit Process
1. Pre-audit planning
2. Site inspection
3. Data collection
4. Analysis
5. Report preparation
6. Follow-up recommendations`
        },
        {
          id: 2,
          title: "Diagnostic Tools and Equipment",
          type: "video",
          duration: "24 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Using blower doors, thermal cameras, power meters, and other diagnostic equipment."
        },
        {
          id: 3,
          title: "Building Envelope Assessment",
          type: "text",
          duration: "28 min",
          content: `# Building Envelope Analysis

## Components to Assess
- Walls and insulation
- Windows and doors
- Roof and attic
- Foundation and basement
- Air sealing

## Insulation Types
- Fiberglass batts
- Spray foam
- Cellulose
- Rigid foam boards
- Reflective barriers

## R-Values Explained
- Measure of thermal resistance
- Higher R-value = better insulation
- Varies by climate zone
- Recommended minimums:
  - Attic: R-38 to R-60
  - Walls: R-13 to R-21
  - Floors: R-25 to R-30

## Air Leakage Detection
- Blower door test
- Thermal imaging
- Smoke pencils
- Visual inspection

## Common Problem Areas
- Recessed lighting
- Electrical outlets
- Door/window frames
- Plumbing penetrations
- Attic hatches`
        },
        {
          id: 4,
          title: "HVAC System Evaluation",
          type: "video",
          duration: "26 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Assessing heating, cooling, and ventilation systems for efficiency and performance."
        },
        {
          id: 5,
          title: "Lighting and Appliances",
          type: "text",
          duration: "22 min",
          content: `# Lighting and Appliance Efficiency

## Lighting Upgrades
**LED Benefits:**
- 75% less energy than incandescent
- Last 25x longer
- Less heat generation
- Available in various color temperatures

**Controls:**
- Occupancy sensors
- Dimmer switches
- Timers and schedulers
- Daylight harvesting

## Appliance Efficiency
**ENERGY STAR Certification:**
- 10-50% more efficient
- Third-party verified
- Available for most appliances

**Major Appliances:**
- Refrigerators
- Washing machines
- Dishwashers
- Water heaters
- Dryers

## Phantom Loads
- 5-10% of home energy use
- Devices drawing power when "off"
- Use smart power strips
- Unplug unused devices

## Recommendations
- Replace oldest appliances first
- Right-size equipment
- Proper maintenance
- Use efficiently`
        },
        {
          id: 6,
          title: "Water Heating Systems",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Evaluating water heater efficiency, sizing, and alternative technologies."
        },
        {
          id: 7,
          title: "Energy Modeling and Analysis",
          type: "text",
          duration: "30 min",
          content: `# Energy Analysis Tools

## Software Tools
- REM/Rate
- EnergyPlus
- HERS software
- Utility data analysis tools
- Simple spreadsheet models

## Data Collection
- Utility bills (12-24 months)
- Building specifications
- Equipment nameplate data
- Occupancy patterns
- Weather data

## Analysis Methods
- Baseline energy use
- Energy use intensity (EUI)
- Cost per square foot
- Benchmarking
- Savings calculations

## Financial Analysis
**Metrics:**
- Simple payback period
- Return on investment (ROI)
- Net present value (NPV)
- Internal rate of return (IRR)

**Consider:**
- Utility incentives
- Tax credits
- Financing costs
- Maintenance savings
- Energy price escalation`
        },
        {
          id: 8,
          title: "Report Writing and Recommendations",
          type: "text",
          duration: "26 min",
          content: `# Audit Report Development

## Report Components
1. Executive summary
2. Building description
3. Current energy use
4. Recommended measures
5. Cost-benefit analysis
6. Implementation priorities
7. Monitoring plan

## Recommendation Categories
**No-Cost/Low-Cost:**
- Behavioral changes
- Maintenance improvements
- Equipment adjustments
- Operational changes

**Capital Improvements:**
- Insulation upgrades
- Equipment replacement
- Building envelope repairs
- System upgrades

## Prioritization
- Quick wins first
- Bundle related measures
- Consider incentives
- Staged implementation

## Follow-Up
- Monitor savings
- Verify implementation
- Adjust recommendations
- Continuous improvement

## Professional Standards
- BPI certifications
- ASHRAE guidelines
- Local building codes
- Industry best practices`
        }
      ]
    }
  };

  const course = courses[courseId as keyof typeof courses];
  
  if (!course) {
    navigate("/learn");
    return null;
  }

  const currentModuleData = course.modules[currentModule];

  const handleModuleComplete = () => {
    if (!completedModules.includes(currentModule)) {
      const newCompleted = [...completedModules, currentModule];
      setCompletedModules(newCompleted);
      saveProgress(newCompleted);
    }
    
    // Load certificate if it exists for this module
    const cert = getModuleCertificate(currentModule);
    if (cert) {
      setCurrentModuleCertificate(cert);
    }
  };

  const handleNext = () => {
    setShowModuleTest(false);
    setCurrentModuleCertificate(null);
    if (currentModule < course.modules.length - 1) {
      const nextModule = currentModule + 1;
      setCurrentModule(nextModule);
      
      // Check if next module has a certificate
      const cert = getModuleCertificate(nextModule);
      if (cert) {
        setCurrentModuleCertificate(cert);
      }
    }
  };

  const handlePrevious = () => {
    setShowModuleTest(false);
    setCurrentModuleCertificate(null);
    if (currentModule > 0) {
      const prevModule = currentModule - 1;
      setCurrentModule(prevModule);
      
      // Check if previous module has a certificate
      const cert = getModuleCertificate(prevModule);
      if (cert) {
        setCurrentModuleCertificate(cert);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/learn")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {course.title}
              </h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {course.level}
            </Badge>
          </div>

          {/* Progress Bar */}
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Course Progress</span>
              </div>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedModules.length} of {course.totalModules} modules completed
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <Card className="lg:col-span-1 p-4 h-fit bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Modules
            </h3>
            <div className="space-y-2">
              {course.modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setShowModuleTest(false);
                    setCurrentModuleCertificate(null);
                    setCurrentModule(index);
                    const cert = getModuleCertificate(index);
                    if (cert) {
                      setCurrentModuleCertificate(cert);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentModule === index
                      ? "bg-primary/10 border-l-2 border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {hasModuleCertificate(index) ? (
                        <Trophy className="w-5 h-5 text-primary" />
                      ) : completedModules.includes(index) ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {module.type === "video" ? (
                          <Video className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">{module.duration}</span>
                        {hasModuleCertificate(index) && (
                          <Badge className="bg-primary/10 text-primary text-xs py-0 px-1">
                            Certified
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm font-medium ${
                        currentModule === index ? "text-primary" : "text-foreground"
                      }`}>
                        {index + 1}. {module.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-card border-border">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {currentModuleData.type === "video" ? (
                    <Video className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                    Module {currentModule + 1} of {course.totalModules}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {currentModuleData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Duration: {currentModuleData.duration}
                </p>
              </div>

              <Tabs defaultValue={currentModuleData.type} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="video" disabled={currentModuleData.type !== "video"}>
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="text" disabled={currentModuleData.type !== "text"}>
                    <FileText className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="mt-0">
                  {currentModuleData.type === "video" && (
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Video Player</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Interactive video content would be embedded here
                            </p>
                          </div>
                        </div>
                      </div>
                      <Card className="p-4 bg-muted/50 border-border">
                        <p className="text-sm text-foreground">{currentModuleData.content}</p>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="text" className="mt-0">
                  {currentModuleData.type === "text" && (
                    <Card className="p-6 bg-muted/50 border-border">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="text-foreground whitespace-pre-wrap">
                          {currentModuleData.content}
                        </div>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentModule === 0}
                  className="border-border"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={handleModuleComplete}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {completedModules.includes(currentModule) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      Mark Complete
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentModule === course.modules.length - 1}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Module Test Section */}
            {completedModules.includes(currentModule) && !showModuleTest && !currentModuleCertificate && (
              <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Test Your Knowledge
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take a quick test to earn a certificate for this module. You need 80% to pass.
                    </p>
                    <Button
                      onClick={() => setShowModuleTest(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Take Module Test
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Module Test Display */}
            {showModuleTest && (
              <div className="mt-6">
                <ModuleTest
                  courseId={courseId!}
                  moduleId={currentModule}
                  moduleName={currentModuleData.title}
                  onTestComplete={(passed) => {
                    setShowModuleTest(false);
                    if (passed) {
                      loadModuleCertificates();
                      const cert = getModuleCertificate(currentModule);
                      setCurrentModuleCertificate(cert);
                    }
                  }}
                  onSkip={() => setShowModuleTest(false)}
                />
              </div>
            )}

            {/* Module Certificate Display */}
            {currentModuleCertificate && (
              <div className="mt-6">
                <ModuleCertificate
                  moduleName={currentModuleCertificate.module_name}
                  courseName={course.title}
                  userName={user?.user_metadata?.full_name || "Student"}
                  certificateNumber={currentModuleCertificate.certificate_number}
                  issuedDate={currentModuleCertificate.issued_at}
                />
              </div>
            )}

            {/* Certification Test Section */}
            {completedModules.length === course.totalModules && (
              <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ready for Certification?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've completed all modules! Take the 30-minute certification test and earn your certificate. You need 80% to pass.
                    </p>
                    <Button
                      onClick={() => navigate(`/learn/${courseId}/test`)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="lg"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Take Certification Test
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
