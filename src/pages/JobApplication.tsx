import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const applicationSchema = z.object({
  applicantName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  applicantEmail: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  applicantPhone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  coverLetter: z.string().trim().min(50, "Cover letter must be at least 50 characters").max(1000, "Cover letter must be less than 1000 characters"),
  availability: z.string().trim().min(5, "Please specify your availability").max(200, "Availability must be less than 200 characters"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const JobApplication = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  const jobTitle = searchParams.get("title") || "Climate Micro-Job";
  const jobCompany = searchParams.get("company") || "";
  const jobLocation = searchParams.get("location") || "";
  const jobPay = searchParams.get("pay") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to apply for jobs",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(user);

      // Pre-fill user profile data if available
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setValue("applicantName", profile.full_name);
      }
      if (user.email) {
        setValue("applicantEmail", user.email);
      }
    };

    checkUser();
  }, [navigate, toast, setValue]);

  const onSubmit = async (data: ApplicationForm) => {
    if (!user || !jobId) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("job_applications")
        .insert({
          user_id: user.id,
          job_id: jobId,
          job_title: jobTitle,
          applicant_name: data.applicantName,
          applicant_email: data.applicantEmail,
          applicant_phone: data.applicantPhone || null,
          cover_letter: data.coverLetter,
          availability: data.availability,
          status: "pending",
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent successfully.",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for applying to <strong>{jobTitle}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              You will be redirected to the jobs page shortly...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/jobs")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <Card className="max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Apply for Job</h1>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">{jobTitle}</p>
              {jobCompany && <p>{jobCompany}</p>}
              <div className="flex gap-3 text-xs">
                {jobLocation && <span>📍 {jobLocation}</span>}
                {jobPay && <span>💰 {jobPay}</span>}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="applicantName">Full Name *</Label>
              <Input
                id="applicantName"
                {...register("applicantName")}
                placeholder="Enter your full name"
                className={errors.applicantName ? "border-destructive" : ""}
              />
              {errors.applicantName && (
                <p className="text-sm text-destructive">{errors.applicantName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantEmail">Email Address *</Label>
              <Input
                id="applicantEmail"
                type="email"
                {...register("applicantEmail")}
                placeholder="your.email@example.com"
                className={errors.applicantEmail ? "border-destructive" : ""}
              />
              {errors.applicantEmail && (
                <p className="text-sm text-destructive">{errors.applicantEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantPhone">Phone Number (Optional)</Label>
              <Input
                id="applicantPhone"
                type="tel"
                {...register("applicantPhone")}
                placeholder="+1 (555) 000-0000"
                className={errors.applicantPhone ? "border-destructive" : ""}
              />
              {errors.applicantPhone && (
                <p className="text-sm text-destructive">{errors.applicantPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                {...register("coverLetter")}
                placeholder="Tell us why you're interested in this climate action opportunity and what relevant experience you have..."
                rows={6}
                className={errors.coverLetter ? "border-destructive" : ""}
              />
              {errors.coverLetter && (
                <p className="text-sm text-destructive">{errors.coverLetter.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Input
                id="availability"
                {...register("availability")}
                placeholder="e.g., Weekends, Evenings, Flexible schedule"
                className={errors.availability ? "border-destructive" : ""}
              />
              {errors.availability && (
                <p className="text-sm text-destructive">{errors.availability.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/jobs")}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default JobApplication;
