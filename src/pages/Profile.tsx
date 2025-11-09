import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Certificate from "@/components/Certificate";
import { 
  Award,
  TreeDeciduous,
  Sun,
  Droplets,
  MapPin,
  Mail,
  Phone,
  Edit,
  Star,
  TrendingUp,
  LogOut,
  FileText
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUser(user);
      loadUserData(user.id);
    }
  };

  const loadUserData = async (userId: string) => {
    // Load skills
    const { data: skillsData } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", userId);

    if (skillsData) {
      setSkills(skillsData);
    }

    // Load certificates
    const { data: certsData } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", userId);

    if (certsData) {
      setCertificates(certsData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
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

  const userName = user?.user_metadata?.full_name || "User";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const achievements = [
    { 
      id: 1, 
      title: "Green Pioneer", 
      description: "Complete your first 10 jobs",
      icon: Award,
      earned: true,
      date: "Jan 2025"
    },
    { 
      id: 2, 
      title: "Tree Champion", 
      description: "Plant 100+ trees",
      icon: TreeDeciduous,
      earned: true,
      date: "Feb 2025"
    },
    { 
      id: 3, 
      title: "Solar Expert", 
      description: "Complete 20 solar jobs",
      icon: Sun,
      earned: true,
      date: "Feb 2025"
    },
    { 
      id: 4, 
      title: "Water Guardian", 
      description: "Save 10,000L of water",
      icon: Droplets,
      earned: false,
      progress: 84
    },
    { 
      id: 5, 
      title: "Climate Leader", 
      description: "Reach 1000 impact score",
      icon: Star,
      earned: false,
      progress: 85
    },
    { 
      id: 6, 
      title: "Top Performer", 
      description: "Maintain 95%+ rating",
      icon: TrendingUp,
      earned: false,
      progress: 92
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 md:p-8 mb-8 bg-gradient-card border-border">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userName}</h1>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userEmail}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Certified
                  </Badge>
                  <Badge className="bg-primary/10 text-primary">
                    {certificates.length} Certificates
                  </Badge>
                  <Badge className="bg-secondary/10 text-secondary">
                    {skills.length} Skills Earned
                  </Badge>
                </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
              
              <p className="text-muted-foreground">
                Learning and contributing to climate action through GreenPath.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Earned Skills & Certifications
              </h2>
              
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No skills earned yet. Complete courses to earn certifications!
                  </p>
                  <Button onClick={() => navigate("/learn")}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 bg-gradient-hero border border-primary/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {skill.skill_name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Earned on {new Date(skill.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">
                          Certified
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Certificates */}
            {certificates.length > 0 && (
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  My Certificates
                </h2>
                
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 bg-muted/50 border border-border rounded-lg hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cert.course_name}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono">
                              {cert.certificate_number}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCertificate(cert);
                            setShowCertificateDialog(true);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                ))}
                </div>
              </Card>
            )}

            {/* Achievements */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Achievements</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.earned
                          ? 'bg-gradient-hero border-primary/30'
                          : 'bg-muted/30 border-border opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          achievement.earned ? 'bg-gradient-primary' : 'bg-muted'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            achievement.earned ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${
                            achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.earned ? (
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                              {achievement.date}
                            </Badge>
                          ) : achievement.progress ? (
                            <div>
                              <Progress value={achievement.progress} className="h-1 mb-1" />
                              <span className="text-xs text-muted-foreground">
                                {achievement.progress}% complete
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-primary text-primary-foreground">
              <h3 className="text-lg font-bold mb-4">Impact Score</h3>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">847</div>
                <p className="text-sm opacity-90 mb-4">Top 10% of all users</p>
                <div className="w-full bg-primary-foreground/20 rounded-full h-2 mb-2">
                  <div className="bg-primary-foreground h-2 rounded-full" style={{ width: "85%" }} />
                </div>
                <p className="text-xs opacity-75">153 points to next tier</p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Monthly Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jobs Completed</span>
                  <span className="font-bold text-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Income Earned</span>
                  <span className="font-bold text-foreground">$520</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hours Worked</span>
                  <span className="font-bold text-foreground">32h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Rating</span>
                  <span className="font-bold text-foreground">4.9★</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  View Certificates
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Account Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Certificate Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Certificate</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <Certificate
              courseName={selectedCertificate.course_name}
              userName={userName}
              certificateNumber={selectedCertificate.certificate_number}
              issuedDate={selectedCertificate.issued_at}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
