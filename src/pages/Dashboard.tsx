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
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    coursesInProgress: 0,
    jobsCompleted: 0,
    totalEarned: 0,
    impactScore: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [nextMilestone, setNextMilestone] = useState({
    name: "",
    current: 0,
    target: 0,
    percentage: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // If user is admin, redirect to admin portal
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (role) {
      navigate("/admin");
      return;
    }

    setUser(user);
    await fetchUserStats(user.id);
    await fetchRecentActivity(user.id);
    setLoading(false);
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // Fetch completed courses (certificates)
      const { data: certificates } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId);

      // Fetch courses in progress
      const { data: progress } = await supabase
        .from("course_progress")
        .select("progress_percentage")
        .eq("user_id", userId)
        .lt("progress_percentage", 100);

      // Fetch completed jobs (approved and payment sent)
      const { data: completedJobs } = await supabase
        .from("micro_jobs")
        .select("payment_amount")
        .eq("user_id", userId)
        .eq("status", "approved")
        .eq("payment_sent", true);

      // Fetch user profile for points (impact score)
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", userId)
        .single();

      // Calculate total earned
      const totalEarned = completedJobs?.reduce((sum, job) => {
        return sum + (Number(job.payment_amount) || 0);
      }, 0) || 0;

      const completedJobsCount = completedJobs?.length || 0;

      setStats({
        coursesCompleted: certificates?.length || 0,
        coursesInProgress: progress?.length || 0,
        jobsCompleted: completedJobsCount,
        totalEarned: totalEarned,
        impactScore: profile?.points || 0,
      });

      // Calculate next milestone
      const milestones = [
        { name: "Green Starter", target: 5 },
        { name: "Eco Warrior", target: 10 },
        { name: "Climate Champion", target: 25 },
        { name: "Sustainability Hero", target: 50 },
        { name: "Earth Guardian", target: 100 },
      ];

      const nextGoal = milestones.find(m => m.target > completedJobsCount) || milestones[milestones.length - 1];
      const percentage = (completedJobsCount / nextGoal.target) * 100;

      setNextMilestone({
        name: nextGoal.name,
        current: completedJobsCount,
        target: nextGoal.target,
        percentage: Math.min(percentage, 100),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentActivity = async (userId: string) => {
    try {
      const activities: any[] = [];

      // Fetch recent certificates (courses completed)
      const { data: certificates } = await supabase
        .from("certificates")
        .select("course_name, issued_at")
        .eq("user_id", userId)
        .order("issued_at", { ascending: false })
        .limit(3);

      certificates?.forEach(cert => {
        activities.push({
          id: `cert-${cert.issued_at}`,
          type: "course",
          title: `Completed ${cert.course_name}`,
          date: getRelativeTime(cert.issued_at),
          points: 50,
        });
      });

      // Fetch recent completed jobs
      const { data: jobs } = await supabase
        .from("micro_jobs")
        .select("title, verified_at, payment_amount, benefit_points")
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("verified_at", { ascending: false })
        .limit(3);

      jobs?.forEach(job => {
        activities.push({
          id: `job-${job.verified_at}`,
          type: "job",
          title: job.title,
          date: getRelativeTime(job.verified_at),
          earned: `Rs ${Number(job.payment_amount || 0).toFixed(0)}`,
          points: job.benefit_points,
        });
      });

      // Sort by date and take top 4
      activities.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setRecentActivities(activities.slice(0, 4));
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
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
            value={stats.coursesCompleted}
            subtitle={`${stats.coursesInProgress} in progress`}
          />
          <StatCard
            icon={Briefcase}
            label="Jobs Completed"
            value={stats.jobsCompleted}
          />
          <StatCard
            icon={DollarSign}
            label="Total Earned"
            value={`Rs ${stats.totalEarned.toFixed(0)}`}
          />
          <StatCard
            icon={Award}
            label="Impact Score"
            value={stats.impactScore}
            subtitle="Points earned"
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
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
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
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity. Start learning or complete jobs to see your progress here!
                  </p>
                )}
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
                  {nextMilestone.target - nextMilestone.current > 0 
                    ? `${nextMilestone.target - nextMilestone.current} more jobs to unlock "${nextMilestone.name}" badge`
                    : `You've reached "${nextMilestone.name}"! Keep going!`
                  }
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all" 
                    style={{ width: `${nextMilestone.percentage}%` }} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextMilestone.current} / {nextMilestone.target} jobs completed
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
