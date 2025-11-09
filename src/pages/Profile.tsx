import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  TrendingUp
} from "lucide-react";

const Profile = () => {
  const skills = [
    { name: "Tree Planting", level: 95, certified: true },
    { name: "Solar Maintenance", level: 80, certified: true },
    { name: "Water Conservation", level: 70, certified: false },
    { name: "Energy Auditing", level: 60, certified: false }
  ];

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
                SC
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Sarah Chen</h1>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Brooklyn, NY
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      sarah.chen@email.com
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      +1 (555) 123-4567
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      4.9 Rating
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      Top 10% Performer
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      24 Jobs Completed
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-muted-foreground">
                Passionate about environmental conservation and renewable energy. 
                Experienced in tree planting, solar panel maintenance, and community education.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Skills & Certifications</h2>
              
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        {skill.certified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            Certified
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

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
    </div>
  );
};

export default Profile;
