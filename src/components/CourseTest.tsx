import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface CourseTestProps {
  courseId: string;
  courseName: string;
  onTestComplete: (passed: boolean, score: number, percentage: number) => void;
}

const CourseTest = ({ courseId, courseName, onTestComplete }: CourseTestProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadQuestions = async () => {
    try {
      toast({
        title: "Generating Test...",
        description: "AI is creating your certification exam",
      });

      const { data, error } = await supabase.functions.invoke('generate-course-questions', {
        body: {
          courseId,
          courseName,
          numQuestions: 10
        }
      });

      if (error) throw error;

      if (data.success && data.questions) {
        const formattedQuestions = data.questions.map((q: any) => ({
          id: `${courseId}-${Math.random()}`,
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
        }));
        setQuestions(formattedQuestions);
        setSelectedAnswers(new Array(formattedQuestions.length).fill(-1));
        
        toast({
          title: "Ready!",
          description: "Your certification test is ready",
        });
      } else {
        throw new Error(data.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate test questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (testStarted && !testFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testFinished, timeLeft]);

  const handleStartTest = async () => {
    setLoading(true);
    setTestStarted(true);
    await loadQuestions();
    setLoading(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = async () => {
    const calculatedScore = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
    }, 0);

    const percentage = (calculatedScore / questions.length) * 100;
    const passed = percentage >= 80;

    setScore(calculatedScore);
    setTestFinished(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("test_attempts").insert({
        user_id: user.id,
        course_id: courseId,
        score: calculatedScore,
        total_questions: questions.length,
        percentage,
        passed,
      });

      if (passed) {
        const certificateNumber = `GP-${courseId}-${user.id.slice(0, 8)}-${Date.now()}`;
        await supabase.from("certificates").insert({
          user_id: user.id,
          course_id: courseId,
          course_name: courseName,
          certificate_number: certificateNumber,
        });

        await supabase.from("user_skills").insert({
          user_id: user.id,
          course_id: courseId,
          skill_name: courseName,
        });
      }
    }

    onTestComplete(passed, calculatedScore, percentage);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!testStarted) {
    return (
      <Card className="p-8 bg-card border-border">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Certification Test
            </h2>
            <p className="text-muted-foreground">
              Complete this test to earn your certificate
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Duration: 30 minutes</p>
                <p className="text-sm text-muted-foreground">
                  The timer starts as soon as you begin
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  {questions.length} Questions
                </p>
                <p className="text-sm text-muted-foreground">
                  Multiple choice questions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Passing Score: 80%</p>
                <p className="text-sm text-muted-foreground">
                  You need {Math.ceil(questions.length * 0.8)} correct answers to pass
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartTest}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Generating Test..." : "Start Test"}
          </Button>
        </div>
      </Card>
    );
  }

  if (testStarted && questions.length === 0 && loading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-background border-2 border-primary/20 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-spin">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generating Certification Test
            </h2>
            <p className="text-muted-foreground">
              AI is creating your personalized certification exam...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (testFinished) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 80;

    return (
      <Card className="p-8 bg-card border-border">
        <div className="text-center space-y-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
              passed ? "bg-primary/10" : "bg-destructive/10"
            }`}
          >
            {passed ? (
              <Trophy className="w-10 h-10 text-primary" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {passed ? "Congratulations!" : "Test Not Passed"}
            </h2>
            <p className="text-muted-foreground">
              {passed
                ? "You have successfully passed the certification test!"
                : "You need 80% to pass. Review the course material and try again."}
            </p>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {questions.length}
                </p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {percentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
            </div>
          </div>

          {passed && (
            <Badge className="bg-primary text-primary-foreground text-base py-2 px-4">
              <Trophy className="w-4 h-4 mr-2" />
              Certificate Earned
            </Badge>
          )}
        </div>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Timer and Progress */}
      <Card className="p-4 bg-gradient-card border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {selectedAnswers[currentQuestion] === index && (
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <span className="text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedAnswers[currentQuestion] === -1 && (
          <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>Please select an answer before moving to the next question</p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-border"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                selectedAnswers[index] !== -1
                  ? "bg-primary"
                  : index === currentQuestion
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmitTest}
            disabled={selectedAnswers.some((a) => a === -1)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Test
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === -1}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseTest;
