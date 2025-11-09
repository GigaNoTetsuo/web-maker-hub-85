import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

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
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
          title: "Solar Energy Fundamentals",
          type: "video",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Understanding how solar energy works and its benefits."
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
  const progress = (completedModules.length / course.totalModules) * 100;

  const handleModuleComplete = () => {
    if (!completedModules.includes(currentModule)) {
      setCompletedModules([...completedModules, currentModule]);
    }
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handlePrevious = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  const handleNext = () => {
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
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
                  onClick={() => setCurrentModule(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentModule === index
                      ? "bg-primary/10 border-l-2 border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {completedModules.includes(index) ? (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
