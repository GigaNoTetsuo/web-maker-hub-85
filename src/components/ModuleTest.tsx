import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface ModuleTestProps {
  courseId: string;
  moduleId: number;
  moduleName: string;
  onTestComplete: (passed: boolean) => void;
  onSkip: () => void;
}

const ModuleTest = ({ courseId, moduleId, moduleName, onTestComplete, onSkip }: ModuleTestProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, [courseId, moduleId]);

  const loadQuestions = async () => {
    const { data, error } = await supabase
      .from("module_test_questions")
      .select("*")
      .eq("course_id", courseId)
      .eq("module_id", moduleId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load test questions",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const formattedQuestions = data.map((q) => ({
        ...q,
        options: JSON.parse(q.options as unknown as string),
      }));
      setQuestions(formattedQuestions);
      setSelectedAnswers(new Array(formattedQuestions.length).fill(-1));
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
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
      await supabase.from("module_test_attempts").insert({
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        score: calculatedScore,
        total_questions: questions.length,
        percentage,
        passed,
      });

      if (passed) {
        const certificateNumber = `GP-M-${courseId}-${moduleId}-${user.id.slice(0, 8)}-${Date.now()}`;
        await supabase.from("module_certificates").insert({
          user_id: user.id,
          course_id: courseId,
          module_id: moduleId,
          module_name: moduleName,
          certificate_number: certificateNumber,
        });
      }
    }

    onTestComplete(passed);
  };

  if (questions.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <p className="text-center text-muted-foreground">Loading test...</p>
      </Card>
    );
  }

  if (!testStarted) {
    return (
      <Card className="p-8 bg-card border-border">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Module Test: {moduleName}
            </h2>
            <p className="text-muted-foreground">
              Test your knowledge of this module
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-left">
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
                  You need {Math.ceil(questions.length * 0.8)} correct answers
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onSkip}
              variant="outline"
              className="border-border"
            >
              Skip Test
            </Button>
            <Button
              onClick={handleStartTest}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Test
            </Button>
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
              {passed ? "Module Completed!" : "Keep Learning"}
            </h2>
            <p className="text-muted-foreground">
              {passed
                ? "You passed the module test and earned a certificate!"
                : "You need 80% to pass. Review the module and try again."}
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
      {/* Progress */}
      <Card className="p-4 bg-gradient-card border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">
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
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModuleTest;
