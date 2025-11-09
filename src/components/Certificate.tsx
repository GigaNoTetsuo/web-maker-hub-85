import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Calendar, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateProps {
  courseName: string;
  userName: string;
  certificateNumber: string;
  issuedDate: string;
}

const Certificate = ({
  courseName,
  userName,
  certificateNumber,
  issuedDate,
}: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
              Certificate of Completion
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {courseName}
            </h2>
            <p className="text-muted-foreground">
              This certifies that
            </p>
          </div>

          <div className="py-6 border-t border-b border-border">
            <p className="text-4xl font-bold text-primary mb-2">{userName}</p>
            <p className="text-muted-foreground">
              has successfully completed the course and demonstrated proficiency in
              the subject matter
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
      <div className="flex justify-center">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
};

export default Certificate;
