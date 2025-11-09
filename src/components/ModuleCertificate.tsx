import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Calendar, Share2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModuleCertificateProps {
  moduleName: string;
  courseName: string;
  userName: string;
  certificateNumber: string;
  issuedDate: string;
}

const ModuleCertificate = ({
  moduleName,
  courseName,
  userName,
  certificateNumber,
  issuedDate,
}: ModuleCertificateProps) => {
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const shareText = `I just completed "${moduleName}" from the ${courseName} course on GreenPath! 🌱\n\nCertificate #${certificateNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GreenPath Module Certificate",
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your achievement with others",
      });
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Certificate",
      description: "Use your browser's print dialog to save as PDF",
    });
  };

  return (
    <div className="space-y-4">
      <Card ref={certificateRef} className="p-8 bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-2 border-primary/20">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          <div>
            <Badge className="bg-primary text-primary-foreground mb-4">
              Module Certificate
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {moduleName}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Part of {courseName}
            </p>
            <p className="text-muted-foreground">
              This certifies that
            </p>
          </div>

          <div className="py-6 border-t border-b border-border">
            <p className="text-4xl font-bold text-primary mb-2">{userName}</p>
            <p className="text-muted-foreground">
              has successfully completed this module and demonstrated knowledge
              of the subject matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Issued On</p>
                <p className="font-semibold text-foreground">
                  {new Date(issuedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Award className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Certificate ID</p>
                <p className="font-semibold text-foreground font-mono text-xs">
                  {certificateNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="inline-block border-t-2 border-foreground/20 pt-2">
              <p className="text-sm font-semibold text-foreground">GreenPath</p>
              <p className="text-xs text-muted-foreground">Climate Action Platform</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleShare}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Certificate
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1 border-primary/30 hover:bg-primary/10"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Save PDF
        </Button>
      </div>
    </div>
  );
};

export default ModuleCertificate;
