import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, MapPin, CheckCircle2, XCircle, Shield } from "lucide-react";
import { pipeline } from "@huggingface/transformers";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  work_type: z.string().min(1, "Please select a work type"),
  location: z.string().min(3, "Location is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const workTypes = [
  "Tree Planting",
  "Clean Water",
  "Solar Installation",
  "Waste Management",
  "Community Garden",
  "Energy Audit",
  "Conservation",
  "Other"
];

const SubmitWork = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [detectedText, setDetectedText] = useState<string>("");
  const [detectionDetails, setDetectionDetails] = useState<{ model: string; text: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      work_type: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  // Generate verification token on component mount
  useEffect(() => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationToken(token);
  }, []);

  const verifyImageToken = async (file: File) => {
    setIsVerifying(true);
    setIsVerified(false);
    setDetectedText("");
    setDetectionDetails([]);

    let matched = false;

    // Precompute numeric-only token for robust matching
    const tokenDigits = verificationToken.replace(/\D/g, "");

    // Try multiple models to improve robustness (handwritten first)
    const modelCandidates = [
      "Xenova/trocr-large-handwritten",
      "Xenova/trocr-base-handwritten",
      "Xenova/trocr-large-printed",
      "Xenova/trocr-base-printed",
    ];

    // Create image URL from file once
    const imageUrl = URL.createObjectURL(file);

    try {
      for (const model of modelCandidates) {
        try {
          const detector = await pipeline("image-to-text", model as any, { device: "webgpu" as any });
          const result: any = await detector(imageUrl);
          const text = (Array.isArray(result) ? result[0]?.generated_text : result?.generated_text) || "";

          // Record detection
          setDetectionDetails((prev) => [...prev, { model, text }]);

          // Normalize to digits only for comparison
          const cleanDetected = text.replace(/\D/g, "");
          if (cleanDetected.includes(tokenDigits) && tokenDigits.length > 0) {
            matched = true;
            setDetectedText(text);
            setIsVerified(true);
            toast.success(`Verified with ${model}. Detected: "${text}"`);
            break; // stop trying others once matched
          }

          // Keep best attempt for display even if not matched yet
          if (!detectedText) setDetectedText(text);
        } catch (innerErr) {
          console.warn(`OCR failed for ${model}:`, innerErr);
          setDetectionDetails((prev) => [...prev, { model, text: "<model error>" }]);
        }
      }

      if (!matched) {
        setIsVerified(false);
        toast.error(`Token not found in OCR output. Expected: ${verificationToken}`);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again with a clearer image.");
      setIsVerified(false);
    } finally {
      URL.revokeObjectURL(imageUrl);
      setIsVerifying(false);
    }
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Only accept images for verification
      if (!file.type.startsWith('image')) {
        toast.error("Please upload an image with the verification token visible");
        return;
      }
      
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Verify token in image
      await verifyImageToken(file);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString());
          form.setValue("longitude", position.coords.longitude.toString());
          toast.success("Location captured successfully");
        },
        (error) => {
          toast.error("Could not get your location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!mediaFile) {
      toast.error("Please upload a photo with the verification token");
      return;
    }

    if (!isVerified) {
      toast.error("Please upload an image with the verification token visible");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit your work");
        navigate("/auth");
        return;
      }

      let mediaUrl = null;
      let mediaType = null;

      // Upload media if provided
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('micro-job-media')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('micro-job-media')
          .getPublicUrl(fileName);

        mediaUrl = publicUrl;
        mediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';
      }

      // Insert micro job
      const { error: insertError } = await supabase
        .from('micro_jobs')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          work_type: values.work_type,
          location: values.location,
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
          media_url: mediaUrl,
          media_type: mediaType,
          status: 'pending',
          benefit_points: 10, // Base points, can be adjusted
        });

      if (insertError) throw insertError;

      toast.success("Work submitted successfully! It will be reviewed shortly and you'll earn benefit points once approved.");
      navigate("/jobs");
    } catch (error: any) {
      console.error("Error submitting work:", error);
      toast.error(error.message || "Failed to submit work");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Submit Your Climate Work</h1>
          <p className="text-muted-foreground">
            Log your completed climate action work with proof and earn benefit points!
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4 p-4 bg-primary/10 border-2 border-primary rounded-lg">
            <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Verification Token Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To verify your work is genuine, write this token on paper and include it in your photo:
              </p>
              <div className="bg-background p-4 rounded-lg border-2 border-primary inline-block">
                <p className="text-4xl font-bold text-primary font-mono tracking-wider">
                  {verificationToken}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Example: Write "{verificationToken}" on paper, take a photo showing both the token and your work.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Planted 10 trees in Central Park" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you did, how much time it took, and its environmental impact..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="e.g., Central Park, New York" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={getCurrentLocation}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Upload Proof Photo with Token *</FormLabel>
                <p className="text-xs text-muted-foreground mb-2">
                  Image must show the verification token and your completed work
                </p>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="media-upload"
                    accept="image/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    {mediaPreview ? (
                      <div className="space-y-2">
                        <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                        {isVerifying && (
                          <div className="flex items-center justify-center gap-2 text-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Verifying token...</span>
                          </div>
                        )}
                        {!isVerifying && isVerified && (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Token verified!</span>
                          </div>
                        )}
                        {!isVerifying && !isVerified && mediaFile && (
                          <div className="flex items-center justify-center gap-2 text-destructive">
                            <XCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Token not detected - please upload a clearer image</span>
                          </div>
                        )}
                        {!isVerifying && mediaFile && (
                          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Model Detected:</p>
                            <p className="text-sm font-mono text-foreground break-words">
                              {detectedText || "No text detected"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Expected: {verificationToken}</p>

                            {detectionDetails.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-muted-foreground">Tried models:</p>
                                <ul className="mt-1 space-y-1">
                                  {detectionDetails.map((d, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground">
                                      <span className="font-medium text-foreground">{d.model}:</span> {d.text || "<no text>"}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Click to upload image with token</p>
                          <p className="text-xs text-muted-foreground">Photo must include verification token (max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/jobs")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isVerified || isVerifying} 
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Work"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SubmitWork;
