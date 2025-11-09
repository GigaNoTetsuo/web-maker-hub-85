import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, BookOpen, FileQuestion, GraduationCap } from "lucide-react";

const ContentGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  // Module Questions Form
  const [moduleForm, setModuleForm] = useState({
    courseId: "",
    moduleId: "",
    moduleName: "",
    numQuestions: "5"
  });

  // Course Questions Form
  const [courseForm, setCourseForm] = useState({
    courseId: "",
    courseName: "",
    numQuestions: "10"
  });

  // Content Form
  const [contentForm, setContentForm] = useState({
    topic: "",
    contentType: "module",
  });

  const handleGenerateModuleQuestions = async () => {
    if (!moduleForm.courseId || !moduleForm.moduleId || !moduleForm.moduleName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-module-questions', {
        body: {
          courseId: moduleForm.courseId,
          moduleId: parseInt(moduleForm.moduleId),
          moduleName: moduleForm.moduleName,
          numQuestions: parseInt(moduleForm.numQuestions)
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
        });
        setGeneratedContent(JSON.stringify(data.questions, null, 2));
      } else {
        throw new Error(data.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCourseQuestions = async () => {
    if (!courseForm.courseId || !courseForm.courseName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course-questions', {
        body: {
          courseId: courseForm.courseId,
          courseName: courseForm.courseName,
          numQuestions: parseInt(courseForm.numQuestions)
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
        });
        setGeneratedContent(JSON.stringify(data.questions, null, 2));
      } else {
        throw new Error(data.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentForm.topic) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course-content', {
        body: {
          topic: contentForm.topic,
          contentType: contentForm.contentType,
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success!",
          description: "Content generated successfully",
        });
        setGeneratedContent(data.content);
      } else {
        throw new Error(data.error || "Failed to generate content");
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Content Generator
          </h1>
          <p className="text-muted-foreground">
            Generate quizzes, tests, and course content using Groq AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Module Questions Generator */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Module Quiz Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="module-course-id">Course ID</Label>
                <Input
                  id="module-course-id"
                  placeholder="e.g., 1"
                  value={moduleForm.courseId}
                  onChange={(e) => setModuleForm({...moduleForm, courseId: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="module-id">Module ID</Label>
                <Input
                  id="module-id"
                  type="number"
                  placeholder="e.g., 1"
                  value={moduleForm.moduleId}
                  onChange={(e) => setModuleForm({...moduleForm, moduleId: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  placeholder="e.g., Introduction to Solar Energy"
                  value={moduleForm.moduleName}
                  onChange={(e) => setModuleForm({...moduleForm, moduleName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="module-num">Number of Questions</Label>
                <Input
                  id="module-num"
                  type="number"
                  placeholder="5"
                  value={moduleForm.numQuestions}
                  onChange={(e) => setModuleForm({...moduleForm, numQuestions: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleGenerateModuleQuestions} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Module Questions
              </Button>
            </div>
          </Card>

          {/* Course Questions Generator */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Certification Test Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="course-id">Course ID</Label>
                <Input
                  id="course-id"
                  placeholder="e.g., 1"
                  value={courseForm.courseId}
                  onChange={(e) => setCourseForm({...courseForm, courseId: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="course-name">Course Name</Label>
                <Input
                  id="course-name"
                  placeholder="e.g., Solar Energy Basics"
                  value={courseForm.courseName}
                  onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="course-num">Number of Questions</Label>
                <Input
                  id="course-num"
                  type="number"
                  placeholder="10"
                  value={courseForm.numQuestions}
                  onChange={(e) => setCourseForm({...courseForm, numQuestions: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleGenerateCourseQuestions} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Course Questions
              </Button>
            </div>
          </Card>

          {/* Content Generator */}
          <Card className="p-6 bg-card border-border lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Course Content Generator</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="content-topic">Topic</Label>
                <Input
                  id="content-topic"
                  placeholder="e.g., Renewable Energy Sources"
                  value={contentForm.topic}
                  onChange={(e) => setContentForm({...contentForm, topic: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="content-type">Content Type</Label>
                <select
                  id="content-type"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={contentForm.contentType}
                  onChange={(e) => setContentForm({...contentForm, contentType: e.target.value})}
                >
                  <option value="module">Module Content</option>
                  <option value="course">Course Outline</option>
                  <option value="general">General Content</option>
                </select>
              </div>
              
              <Button 
                onClick={handleGenerateContent} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Content
              </Button>
            </div>
          </Card>

          {/* Generated Content Display */}
          {generatedContent && (
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <h3 className="text-lg font-bold text-foreground mb-4">Generated Content</h3>
              <Textarea
                value={generatedContent}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
