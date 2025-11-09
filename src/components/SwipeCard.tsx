import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Shield, Award, Star } from "lucide-react";

interface SwipeCardProps {
  question: string;
  options: string[];
  questionNumber: number;
  totalQuestions: number;
  onSelectAnswer: (index: number) => void;
  isActive: boolean;
  zIndex: number;
}

export const SwipeCard = ({
  question,
  options,
  questionNumber,
  totalQuestions,
  onSelectAnswer,
  isActive,
  zIndex,
}: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | "up">("up");
  const cardRef = useRef<HTMLDivElement>(null);

  const optionIcons = [Target, Shield, Award, Star];

  const handleOptionClick = (index: number) => {
    if (!isActive || isFlying) return;
    
    // Determine fly direction based on option index
    const directions: ("left" | "right" | "up")[] = ["left", "right", "up", "up"];
    const direction = directions[index % directions.length];
    
    setFlyDirection(direction);
    setIsFlying(true);
    
    // Wait for animation to complete before notifying parent
    setTimeout(() => {
      onSelectAnswer(index);
    }, 600);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive || isFlying) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive) return;
    setDragOffset({
      x: dragOffset.x + e.movementX,
      y: dragOffset.y + e.movementY,
    });
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    setIsDragging(false);
    
    // If dragged significantly, trigger fly away
    if (Math.abs(dragOffset.x) > 100 || Math.abs(dragOffset.y) > 100) {
      const direction = Math.abs(dragOffset.x) > Math.abs(dragOffset.y)
        ? (dragOffset.x > 0 ? "right" : "left")
        : "up";
      
      setFlyDirection(direction);
      setIsFlying(true);
      
      setTimeout(() => {
        // Select first option as default when swiped
        onSelectAnswer(0);
      }, 600);
    } else {
      // Reset position
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const getTransform = () => {
    if (isFlying) {
      switch (flyDirection) {
        case "left":
          return "translateX(-150vw) translateY(-20vh) rotate(-30deg)";
        case "right":
          return "translateX(150vw) translateY(-20vh) rotate(30deg)";
        case "up":
          return "translateY(-150vh) scale(0.8)";
      }
    }
    
    if (isDragging) {
      const rotation = dragOffset.x * 0.1;
      return `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`;
    }
    
    return "translate(0, 0) rotate(0deg)";
  };

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 flex items-center justify-center touch-none"
      style={{
        zIndex,
        pointerEvents: isActive ? "auto" : "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card
        className={`w-full max-w-2xl p-8 bg-gradient-to-br from-card to-muted/20 border-2 border-primary/20 relative overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl ${
          isFlying ? "transition-transform duration-500 ease-in" : isDragging ? "" : "transition-transform duration-300 ease-out"
        }`}
        style={{
          transform: getTransform(),
          opacity: isActive ? 1 : 0.5,
          scale: isActive ? 1 : 0.95,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full -ml-16 -mb-16"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                Challenge #{questionNumber} / {totalQuestions}
              </Badge>
              <h3 className="text-2xl font-bold text-foreground leading-relaxed">
                {question}
              </h3>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {options.map((option, index) => {
              const OptionIcon = optionIcons[index % optionIcons.length];
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-gradient-to-br from-muted/30 to-background hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border-2 border-border bg-background group-hover:border-primary/50 group-hover:bg-primary/5 flex items-center justify-center transition-all flex-shrink-0">
                      <OptionIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="flex-1 font-medium text-foreground/80 group-hover:text-foreground text-base pt-2">
                      {option}
                    </span>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </button>
              );
            })}
          </div>

          {/* Swipe hint */}
          {isActive && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                👆 Tap an option or swipe the card
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
