import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, TreeDeciduous, Sun, Droplets, Award, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  const features = [
    {
      icon: TreeDeciduous,
      title: "Learn Green Skills",
      description: "Master climate-focused skills like tree planting, solar maintenance, and water conservation through interactive courses."
    },
    {
      icon: Sun,
      title: "Find Climate Jobs",
      description: "Access paid micro-jobs in the green economy matched to your skills and location by our AI."
    },
    {
      icon: TrendingUp,
      title: "Track Your Impact",
      description: "See your environmental contribution with metrics on trees planted, CO2 offset, and more."
    },
    {
      icon: Award,
      title: "Earn & Grow",
      description: "Complete tasks, earn income, and build a career in the growing climate action sector."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Empowering Communities Through Climate Action
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Connect to{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Green Opportunities
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              GreenPath is an AI-powered platform connecting marginalized communities to climate micro-jobs 
              while providing essential green skills training. Build your future in the green economy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  Get Started
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="border-2">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How GreenPath Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem for learning, earning, and making a real environmental impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-primary-foreground">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the Climate Action Movement
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Be part of a growing community making real environmental impact while building 
                economic opportunities for underserved communities.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">1,200+</div>
                  <div className="text-sm opacity-90">Jobs Completed</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">5,400</div>
                  <div className="text-sm opacity-90">Trees Planted</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">850</div>
                  <div className="text-sm opacity-90">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">120t</div>
                  <div className="text-sm opacity-90">CO₂ Offset</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
