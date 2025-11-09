import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TreeDeciduous, 
  Sun, 
  Droplets, 
  Zap,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp
} from "lucide-react";

const Jobs = () => {
  const jobs = [
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
            AI-matched opportunities based on your skills and location
          </p>
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
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary font-semibold"
                  >
                    {job.match}% Match
                  </Badge>
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
                  {job.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="bg-muted text-muted-foreground text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
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
