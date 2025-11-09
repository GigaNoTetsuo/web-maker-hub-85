import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TreeDeciduous, 
  Sun, 
  Droplets, 
  Zap,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Loader2,
  Wind,
  Star,
  Sparkles,
  Plus,
  Leaf,
  BookOpen
} from "lucide-react";

const Jobs = () => {
  const { toast } = useToast();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [climateData, setClimateData] = useState<any>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [filterMode, setFilterMode] = useState<"recommended" | "all">("recommended");
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isGeneratingJobs, setIsGeneratingJobs] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");

  type JobWithScores = typeof allJobs[0] & {
    recommendationScore?: number;
    matchedSkills?: string[];
    aiGenerated?: boolean;
  };

  const allJobs = [
    {
      id: 1,
      title: "Tree Planting - Riverside Park",
      company: "Green City Initiative",
      location: "Brooklyn, NY",
      pay: "$45",
      duration: "3 hours",
      icon: TreeDeciduous,
      type: "Planting",
      difficulty: "Easy",
      match: 95,
      description: "Plant 50 native tree saplings along the riverside walking trail.",
      skills: ["Tree Planting", "Physical Work"],
      urgent: false
    },
    {
      id: 2,
      title: "Solar Panel Cleaning",
      company: "SunPower Community",
      location: "Queens, NY",
      pay: "$80",
      duration: "4 hours",
      icon: Sun,
      type: "Maintenance",
      difficulty: "Medium",
      match: 92,
      description: "Clean and inspect 20 residential solar panel installations.",
      skills: ["Solar Maintenance", "Safety Certified"],
      urgent: true
    },
    {
      id: 3,
      title: "Water Conservation Survey",
      company: "Aqua Solutions",
      location: "Manhattan, NY",
      pay: "$60",
      duration: "2 hours",
      icon: Droplets,
      type: "Survey",
      difficulty: "Easy",
      match: 88,
      description: "Conduct water usage surveys in 15 residential units.",
      skills: ["Data Collection", "Communication"],
      urgent: false
    },
    {
      id: 4,
      title: "Energy Efficiency Audit",
      company: "EcoAudit Pro",
      location: "Bronx, NY",
      pay: "$120",
      duration: "5 hours",
      icon: Zap,
      type: "Audit",
      difficulty: "Advanced",
      match: 85,
      description: "Perform comprehensive energy audit for small business location.",
      skills: ["Energy Auditing", "Report Writing"],
      urgent: false
    },
    {
      id: 5,
      title: "Community Garden Setup",
      company: "Urban Harvest",
      location: "Staten Island, NY",
      pay: "$55",
      duration: "4 hours",
      icon: TreeDeciduous,
      type: "Installation",
      difficulty: "Medium",
      match: 82,
      description: "Help establish raised beds and irrigation for community garden.",
      skills: ["Gardening", "Construction"],
      urgent: true
    },
    {
      id: 6,
      title: "Rainwater Harvesting Install",
      company: "Water Wise NYC",
      location: "Brooklyn, NY",
      pay: "$90",
      duration: "6 hours",
      icon: Droplets,
      type: "Installation",
      difficulty: "Medium",
      match: 78,
      description: "Install rainwater collection system for urban building.",
      skills: ["Plumbing", "Water Systems"],
      urgent: false
    }
  ];

  const [jobs, setJobs] = useState<JobWithScores[]>(allJobs);
  const [allJobsWithScores, setAllJobsWithScores] = useState<JobWithScores[]>(allJobs);

  useEffect(() => {
    // Check for authenticated user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchUserSkills(user.id);
      }
    };
    
    checkUser();
    getLocationAndMatchJobs();
  }, []);

  useEffect(() => {
    // Apply filter when mode changes
    if (filterMode === "recommended") {
      const recommended = allJobsWithScores.filter(
        (job: any) => (job.recommendationScore || 0) >= 50
      );
      setJobs(recommended.length > 0 ? recommended : allJobsWithScores);
    } else {
      setJobs(allJobsWithScores);
    }
  }, [filterMode, allJobsWithScores]);

  const fetchUserSkills = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('skill_name')
        .eq('user_id', uid);

      if (error) throw error;
      
      const skills = data?.map(s => s.skill_name) || [];
      setUserSkills(skills);
      console.log('User skills loaded:', skills);

      if (skills.length > 0) {
        await getRecommendations(uid);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const getRecommendations = async (uid: string) => {
    setIsLoadingRecommendations(true);
    try {
      // Send jobs without icon property (can't serialize React components)
      const jobsForApi = allJobs.map(({ icon, ...job }) => job);
      
      const { data, error } = await supabase.functions.invoke('recommend-jobs', {
        body: { userId: uid, jobs: jobsForApi }
      });

      if (error) throw error;

      console.log('Recommended jobs:', data);
      
      // Merge scores back with original jobs (including icons)
      const jobsWithScores = allJobs.map((originalJob, index) => ({
        ...originalJob,
        recommendationScore: data.jobs[index]?.recommendationScore || 0,
        matchedSkills: data.jobs[index]?.matchedSkills || []
      }));
      
      setAllJobsWithScores(jobsWithScores);
      
      if (filterMode === "recommended") {
        const recommended = jobsWithScores.filter(
          (job: any) => (job.recommendationScore || 0) >= 50
        );
        setJobs(recommended.length > 0 ? recommended : jobsWithScores);
      } else {
        setJobs(jobsWithScores);
      }

      toast({
        title: "Jobs Personalized",
        description: `Found ${jobsWithScores.filter((j: any) => (j.recommendationScore || 0) >= 50).length} jobs matching your skills`,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setAllJobsWithScores(allJobs);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      TreeDeciduous,
      Sun,
      Droplets,
      Zap,
      Leaf,
      BookOpen
    };
    return icons[iconName] || Leaf;
  };

  const getLocationAndMatchJobs = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', latitude, longitude);
        setLocationGranted(true);

        // Get location name using reverse geocoding
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoResponse.json();
          const locationName = `${geoData.address.city || geoData.address.town || geoData.address.village}, ${geoData.address.country}`;
          setUserLocation(locationName);
        } catch (error) {
          console.error('Error getting location name:', error);
        }

        try {
          // Send jobs without icon property (can't serialize React components)
          const jobsForApi = allJobs.map(({ icon, ...job }) => job);
          
          const { data, error } = await supabase.functions.invoke('match-climate-jobs', {
            body: {
              latitude,
              longitude,
              jobs: jobsForApi,
            },
          });

          if (error) throw error;

          console.log('Climate-matched jobs:', data);
          setClimateData(data.climate);
          
          // Merge climate ranking back with original jobs (including icons)
          const rankedJobsWithIcons = data.jobs.map((apiJob: any) => {
            const originalJob = allJobs.find(j => j.id === apiJob.id);
            return {
              ...originalJob,
              ...apiJob,
              icon: originalJob?.icon // Preserve the icon
            };
          });
          
          setAllJobsWithScores(rankedJobsWithIcons);
          
          // Apply filter based on current mode
          if (filterMode === "recommended" && userId) {
            const recommended = rankedJobsWithIcons.filter(
              (job: any) => (job.recommendationScore || 0) >= 50
            );
            setJobs(recommended.length > 0 ? recommended : rankedJobsWithIcons);
          } else {
            setJobs(rankedJobsWithIcons);
          }

          toast({
            title: "Jobs Matched to Your Climate",
            description: `Temperature: ${data.climate.temperature}°C, Showing relevant opportunities`,
          });
        } catch (error) {
          console.error('Error matching jobs:', error);
          toast({
            title: "Error",
            description: "Failed to match jobs with climate data",
            variant: "destructive",
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoadingLocation(false);
        toast({
          title: "Location Access Denied",
          description: "Showing all available jobs without climate matching",
        });
      }
    );
  };

  const generateNewJobs = async () => {
    if (isGeneratingJobs) return;
    
    setIsGeneratingJobs(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-climate-jobs', {
        body: {
          climateData,
          location: userLocation,
          count: 3
        }
      });

      if (error) throw error;

      console.log('AI Generated jobs:', data.jobs);
      
      // Map icon strings to components
      const jobsWithIcons = data.jobs.map((job: any) => ({
        ...job,
        icon: getIconComponent(job.icon)
      }));

      // Add to existing jobs
      const updatedJobs = [...allJobsWithScores, ...jobsWithIcons];
      setAllJobsWithScores(updatedJobs);
      
      if (filterMode === "recommended") {
        const recommended = updatedJobs.filter(
          (job: any) => (job.recommendationScore || 0) >= 50 || job.aiGenerated
        );
        setJobs(recommended.length > 0 ? recommended : updatedJobs);
      } else {
        setJobs(updatedJobs);
      }

      toast({
        title: "New Climate Jobs Generated!",
        description: `Added ${data.jobs.length} AI-generated jobs based on local conditions`,
      });
    } catch (error) {
      console.error('Error generating jobs:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate new jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingJobs(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Climate Micro-Jobs
          </h1>
          <p className="text-muted-foreground">
            AI-matched opportunities based on your local climate conditions
          </p>
          
          {isLoadingLocation && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing your local climate conditions...</span>
            </div>
          )}
          
          {climateData && locationGranted && (
            <Card className="mt-6 p-4 max-w-2xl mx-auto bg-primary/5">
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span>{climateData.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{climateData.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>{climateData.windSpeed} km/h</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Jobs ranked by relevance to your local climate conditions
              </p>
            </Card>
          )}
          
          {!locationGranted && !isLoadingLocation && (
            <Button 
              onClick={getLocationAndMatchJobs}
              className="mt-4 mx-auto block"
              variant="outline"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Enable Location for Climate-Matched Jobs
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as "recommended" | "all")}>
            <TabsList>
              <TabsTrigger value="recommended" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Recommended For You
                {userId && userSkills.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {allJobsWithScores.filter((j: any) => (j.recommendationScore || 0) >= 50 || j.aiGenerated).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                All Jobs
                <Badge variant="secondary" className="ml-1">
                  {allJobsWithScores.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            {userId && userSkills.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Your skills: {userSkills.slice(0, 3).join(', ')}{userSkills.length > 3 ? '...' : ''}</span>
              </div>
            )}

            {userId && userSkills.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Add skills to your profile to see personalized recommendations
              </div>
            )}

            {!userId && (
              <div className="text-sm text-muted-foreground">
                Sign in to get personalized job recommendations
              </div>
            )}

            {isLoadingRecommendations && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Personalizing jobs...</span>
              </div>
            )}

            <Button
              onClick={generateNewJobs}
              disabled={isGeneratingJobs}
              className="gap-2"
              variant="outline"
            >
              {isGeneratingJobs ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Generate Climate Jobs
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Available Jobs</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">$65</p>
                <p className="text-xs text-muted-foreground">Avg. Payout</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Near You</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Jobs Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const Icon = job.icon;
            return (
              <Card
                key={job.id}
                className="p-6 bg-card border-border hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {job.title}
                        </h3>
                        {job.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        {job.aiGenerated && (
                          <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 items-end">
                    {job.match && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-500/10 text-blue-500 font-semibold text-xs"
                      >
                        {job.match}% Climate Match
                      </Badge>
                    )}
                    {job.recommendationScore !== undefined && job.recommendationScore >= 50 && (
                      <Badge 
                        variant="secondary" 
                        className="bg-yellow-500/10 text-yellow-500 font-semibold text-xs flex items-center gap-1"
                      >
                        <Star className="h-3 w-3" />
                        {job.recommendationScore}% Skills Match
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {job.description}
                </p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.location}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill: string) => {
                    const isMatched = job.matchedSkills?.includes(skill);
                    return (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className={isMatched 
                          ? "bg-green-500/10 text-green-600 border border-green-500/20 text-xs" 
                          : "bg-muted text-muted-foreground text-xs"
                        }
                      >
                        {isMatched && <Star className="h-3 w-3 mr-1 inline" />}
                        {skill}
                      </Badge>
                    );
                  })}
                  <Badge 
                    variant="secondary" 
                    className="bg-accent/10 text-accent text-xs"
                  >
                    {job.difficulty}
                  </Badge>
                </div>

                {/* Action */}
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark">
                  Apply for Job
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
