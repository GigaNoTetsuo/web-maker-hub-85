import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import CourseTest from "@/components/CourseTest";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CourseTestPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
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
      setLoading(false);
    }
  };

  const courses: { [key: string]: { title: string } } = {
    "1": { title: "Tree Plantation & Forest Management" },
    "2": { title: "Solar Panel Installation & Maintenance" },
    "3": { title: "Water Conservation Methods" },
    "4": { title: "Renewable Energy Basics" },
    "5": { title: "Waste Management & Recycling" },
    "6": { title: "Energy Efficiency Auditing" },
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

  const course = courses[courseId as string];
  if (!course) {
    navigate("/learn");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/learn")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {course.title} - Certification Test
        </h1>
        
        <CourseTest
          courseId={courseId!}
          courseName={course.title}
          onTestComplete={(passed) => {
            if (passed) {
              toast({
                title: "Congratulations!",
                description: "You've earned your certificate!",
              });
              setTimeout(() => {
                navigate("/profile");
              }, 2000);
            } else {
              toast({
                title: "Keep learning",
                description: "Review the course material and try again.",
                variant: "destructive",
              });
              setTimeout(() => {
                navigate(`/learn/${courseId}`);
              }, 2000);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CourseTestPage;
