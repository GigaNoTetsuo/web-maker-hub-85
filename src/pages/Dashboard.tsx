import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  TreeDeciduous, 
  DollarSign, 
  BookOpen, 
  Briefcase,
  Cloud,
  Droplets,
  TrendingUp,
  Award,
  Trophy
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
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

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "User";
  
  const recentActivities = [
    { id: 1, type: "course", title: "Completed Solar Panel Maintenance", date: "2 days ago", points: 50 },
    { id: 2, type: "job", title: "Tree Planting - Central Park", date: "1 week ago", earned: "$45" },
    { id: 3, type: "course", title: "Started Water Conservation Methods", date: "1 week ago", progress: 60 },
    { id: 4, type: "job", title: "Energy Audit - Community Center", date: "2 weeks ago", earned: "$80" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your impact on the environment and your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Courses Completed"
            value={8}
            subtitle="3 in progress"
            trend="↑ 2 this month"
          />
          <StatCard
            icon={Briefcase}
            label="Jobs Completed"
            value={24}
            subtitle="12 available"
            trend="↑ 4 this week"
          />
          <StatCard
            icon={DollarSign}
            label="Total Earned"
            value="$1,240"
            subtitle="This month: $320"
            trend="↑ 15% vs last month"
          />
          <StatCard
            icon={Award}
            label="Impact Score"
            value={847}
            subtitle="Top 10% users"
            trend="↑ 45 points"
          />
        </div>

        {/* Environmental Impact */}
        <Card className="p-6 mb-8 bg-gradient-card border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Environmental Impact</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              This Month
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TreeDeciduous className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">127</p>
                <p className="text-sm text-muted-foreground">Trees Planted</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2.4t</p>
                <p className="text-sm text-muted-foreground">CO₂ Offset</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Droplets className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8,400L</p>
                <p className="text-sm text-muted-foreground">Water Saved</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'course' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        {activity.type === 'course' ? (
                          <BookOpen className={`w-5 h-5 ${activity.type === 'course' ? 'text-primary' : 'text-secondary'}`} />
                        ) : (
                          <Briefcase className={`w-5 h-5 ${activity.type === 'course' ? 'text-primary' : 'text-secondary'}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    {activity.earned && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {activity.earned}
                      </Badge>
                    )}
                    {activity.points && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        +{activity.points} pts
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6 bg-card border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link to="/learn">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                
                <Button
                  onClick={() => {
                    // Find first completed course and redirect to test
                    navigate("/learn");
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Take Certification Test
                </Button>
                
                <Link to="/jobs">
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Find Jobs
                  </Button>
                </Link>
                
                <Link to="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    View Achievements
                  </Button>
                </Link>
                
                <Button className="w-full justify-start bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
              </div>
            </Card>

            {/* Achievement Highlight */}
            <Card className="p-6 bg-gradient-hero border-primary/20 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Next Milestone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  5 more jobs to unlock "Climate Champion" badge
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
