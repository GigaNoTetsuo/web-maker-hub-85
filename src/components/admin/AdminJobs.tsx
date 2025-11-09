import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("micro_jobs")
      .select(`
        *,
        profiles (full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
      return;
    }

    setJobs(data || []);
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from("micro_jobs")
      .update({ status })
      .eq("id", jobId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Job ${status}`,
    });

    fetchJobs();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Jobs</CardTitle>
        <CardDescription>View and manage all micro jobs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{job.work_type}</Badge>
                    <Badge>{job.status}</Badge>
                    <span className="text-sm">Points: {job.benefit_points}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Location: {job.location} | By: {job.profiles?.full_name || "Unknown"}
                  </p>
                  {job.media_url && (
                    <img
                      src={job.media_url}
                      alt={job.title}
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  {job.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateJobStatus(job.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateJobStatus(job.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminJobs;