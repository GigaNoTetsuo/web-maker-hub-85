import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  TreeDeciduous, 
  Sun, 
  Droplets, 
  Wind,
  Recycle,
  Zap,
  BookOpen,
  Clock,
  Trophy
} from "lucide-react";

const Learn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUser(user);
      loadProgress(user.id);
    }
  };

  const loadProgress = async (userId: string) => {
    const { data } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      setUserProgress(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getUserCourseProgress = (courseId: number) => {
    const progress = userProgress.find((p) => p.course_id === courseId.toString());
    return progress ? progress.progress_percentage : 0;
  };

  const isCoursCompleted = (courseId: number) => {
    const progress = getUserCourseProgress(courseId);
    return progress === 100;
  };
  
  const courses = [
    {
      id: 1,
      title: "Tree Plantation & Forest Management",
      description: "Learn the fundamentals of tree planting, species selection, and long-term forest care.",
      icon: TreeDeciduous,
      duration: "4 hours",
      modules: 6,
      level: "Beginner",
      progress: 100,
      completed: true
    },
    {
      id: 2,
      title: "Solar Panel Installation & Maintenance",
      description: "Master solar panel setup, maintenance, and troubleshooting for residential and commercial systems.",
      icon: Sun,
      duration: "6 hours",
      modules: 8,
      level: "Intermediate",
      progress: 75,
      completed: false
    },
    {
      id: 3,
      title: "Water Conservation Methods",
      description: "Discover techniques for water harvesting, efficient irrigation, and conservation practices.",
      icon: Droplets,
      duration: "3 hours",
      modules: 5,
      level: "Beginner",
      progress: 60,
      completed: false
    },
    {
      id: 4,
      title: "Renewable Energy Basics",
      description: "Understanding wind, solar, hydro power and their applications in sustainable energy.",
      icon: Wind,
      duration: "5 hours",
      modules: 7,
      level: "Beginner",
      progress: 0,
      completed: false
    },
    {
      id: 5,
      title: "Waste Management & Recycling",
      description: "Learn effective waste sorting, recycling processes, and circular economy principles.",
      icon: Recycle,
      duration: "4 hours",
      modules: 6,
      level: "Beginner",
      progress: 0,
      completed: false
    },
    {
      id: 6,
      title: "Energy Efficiency Auditing",
      description: "Conduct professional energy audits for homes and businesses to identify savings.",
      icon: Zap,
      duration: "7 hours",
      modules: 9,
      level: "Advanced",
      progress: 0,
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Learning Modules
          </h1>
          <p className="text-muted-foreground">
            Build your green skills with our comprehensive courses designed for climate action
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">42h</p>
                <p className="text-sm text-muted-foreground">Learning Time</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Badge className="w-6 h-6 bg-accent text-accent-foreground flex items-center justify-center text-xs">
                  12
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = course.icon;
            const userProgressValue = getUserCourseProgress(course.id);
            const isCompleted = isCoursCompleted(course.id);
            
            return (
              <Card
                key={course.id}
                className="p-6 bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {course.level}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{course.modules} modules</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>

                {userProgressValue > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-primary font-medium">{userProgressValue}%</span>
                    </div>
                    <Progress value={userProgressValue} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate(`/learn/${course.id}`)}
                    className={`w-full ${
                      isCompleted 
                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                        : userProgressValue > 0 
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                          : 'bg-primary text-primary-foreground hover:bg-primary-dark'
                    }`}
                  >
                    {isCompleted 
                      ? 'Review Course' 
                      : userProgressValue > 0 
                        ? 'Continue Learning' 
                        : 'Start Course'}
                  </Button>
                  
                  {isCompleted ? (
                    <Button
                      onClick={() => navigate(`/learn/${course.id}/test`)}
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Take Certification Test
                    </Button>
                  ) : (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Complete all modules to unlock certification test
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Learn;
