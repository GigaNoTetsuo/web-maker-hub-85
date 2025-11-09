import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SwipeCard } from "@/components/SwipeCard";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Heart,
  Flame,
  Star,
  Zap,
  Target,
  Lightbulb,
  Brain,
  Clock,
  Shield,
  Award,
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
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadQuestions = async () => {
    try {
      toast({
        title: "Generating Questions...",
        description: "AI is creating your personalized challenge",
      });

      const { data, error } = await supabase.functions.invoke('generate-module-questions', {
        body: {
          courseId,
          moduleId,
          moduleName,
          numQuestions: 5
        }
      });

      if (error) throw error;

      if (data.success && data.questions) {
        const formattedQuestions = data.questions.map((q: any) => ({
          id: `${courseId}-${moduleId}-${Math.random()}`,
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
        }));
        setQuestions(formattedQuestions);
        setSelectedAnswers(new Array(formattedQuestions.length).fill(-1));
        
        toast({
          title: "Ready!",
          description: "Your challenge questions are ready",
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
    
    // Check if answer is correct
    const correct = answerIndex === questions[currentQuestion].correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const xpGain = 10 + (newStreak * 2); // Bonus XP for streaks
      setEarnedXP(earnedXP + xpGain);
      
      toast({
        title: "🎉 Correct!",
        description: `+${xpGain} XP ${newStreak > 1 ? `(${newStreak}x Streak!)` : ''}`,
      });
    } else {
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives > 0) {
        toast({
          title: "❌ Incorrect",
          description: `${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining`,
          variant: "destructive",
        });
      }
    }
    
    // Move to next question after card animation
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 700);
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

      // Module certificates removed - only course certifications award certificates
    }

    onTestComplete(passed);
  };

  if (!testStarted) {
    return (
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-background border-2 border-primary/20 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div>
            <Badge className="mb-3 bg-secondary/20 text-secondary border-secondary/30">
              <Target className="w-3 h-3 mr-1" />
              Challenge Mode
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-World Challenge
            </h2>
            <p className="text-lg font-semibold text-foreground mb-1">
              {moduleName}
            </p>
            <p className="text-muted-foreground">
              Apply your knowledge to solve practical scenarios
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">{questions.length} Challenges</p>
                  <p className="text-xs text-muted-foreground">Real-life scenarios</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">3 Lives</p>
                  <p className="text-xs text-muted-foreground">Answer carefully</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Earn XP</p>
                  <p className="text-xs text-muted-foreground">Build your streak</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">80% to Pass</p>
                  <p className="text-xs text-muted-foreground">Earn certificate</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3 text-left">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">How it works:</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Each challenge presents a real-world scenario</li>
                  <li>• Build streaks for bonus XP rewards</li>
                  <li>• You have 3 lives - use them wisely!</li>
                  <li>• Pass with 80% to earn your certificate</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onSkip}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleStartTest}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              {loading ? "Generating..." : "Start Challenge"}
            </Button>
          </div>
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
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generating Your Challenge
            </h2>
            <p className="text-muted-foreground">
              AI is creating personalized questions for you...
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
      <Card className={`p-8 border-2 animate-fade-in ${
        passed 
          ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-background border-green-500/30' 
          : 'bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-background border-orange-500/30'
      }`}>
        <div className="text-center space-y-6">
          <div className="relative">
            {passed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
            )}
            <div
              className={`relative w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                passed 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                  : "bg-gradient-to-br from-orange-500 to-yellow-500"
              }`}
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Target className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          <div>
            <h2 className={`text-4xl font-bold mb-2 ${
              passed 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent' 
                : 'text-foreground'
            }`}>
              {passed ? "🎉 Challenge Completed!" : "💪 Keep Going!"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {passed
                ? "Amazing work! You've mastered this module!"
                : "Review the material and try again. You've got this!"}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <Star className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{score}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </Card>
            <Card className="p-4 bg-secondary/5 border-secondary/20">
              <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{questions.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </Card>
            <Card className="p-4 bg-muted/50 border-border">
              <Award className="w-6 h-6 text-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{percentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
              <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{earnedXP}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </Card>
          </div>

          {passed && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-green-600" />
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-base py-2 px-4 border-0">
                  Challenge Completed!
                </Badge>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Great job! Continue to complete all modules and ace the final course test to earn your certificate.
              </p>
            </div>
          )}

          {!passed && (
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Review the module content and try again. You need {Math.ceil(questions.length * 0.8)} correct answers to pass.
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-sm font-bold text-foreground">{currentQuestion + 1}/{questions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3 bg-gradient-to-br from-red-500/10 to-pink-500/5 border-red-500/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lives</p>
              <p className="text-sm font-bold text-foreground">{lives}/3</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              {streak > 0 ? (
                <Flame className="w-4 h-4 text-white" />
              ) : (
                <Zap className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{streak > 0 ? 'Streak' : 'XP'}</p>
              <p className="text-sm font-bold text-foreground">
                {streak > 0 ? `${streak}x` : `${earnedXP}`}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
        <Progress value={progress} className="h-3" />
      </Card>

      {/* Swipeable Cards Stack */}
      <div className="relative h-[600px] w-full max-w-2xl mx-auto">
        {questions.map((q, index) => {
          // Show current card and next 2 cards in stack
          if (index < currentQuestion || index > currentQuestion + 2) {
            return null;
          }
          
          const offset = index - currentQuestion;
          
          return (
            <SwipeCard
              key={q.id}
              question={q.question}
              options={q.options}
              questionNumber={index + 1}
              totalQuestions={questions.length}
              onSelectAnswer={(answerIndex) => {
                handleSelectAnswer(answerIndex);
              }}
              isActive={index === currentQuestion}
              zIndex={questions.length - offset}
            />
          );
        })}
      </div>

      {/* Complete Button (shown on last question) */}
      {currentQuestion === questions.length - 1 && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmitTest}
            disabled={selectedAnswers.some((a) => a === -1) || showFeedback}
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Complete Challenge
          </Button>
        </div>
      )}

      {lives === 0 && (
        <Card className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/5 border-2 border-red-500/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold text-foreground">Out of Lives!</p>
              <p className="text-sm text-muted-foreground">
                Review the module and try again when ready.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ModuleTest;
