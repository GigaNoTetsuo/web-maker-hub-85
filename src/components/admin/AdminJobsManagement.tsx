import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminJobsManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [workSubmissions, setWorkSubmissions] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchWorkSubmissions();
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

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        profiles (full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
      return;
    }

    setApplications(data || []);
  };

  const fetchWorkSubmissions = async () => {
    const { data, error } = await supabase
      .from("micro_jobs")
      .select(`
        *,
        profiles!micro_jobs_user_id_fkey (full_name)
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch work submissions",
        variant: "destructive",
      });
      return;
    }

    setWorkSubmissions(data || []);
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
    fetchWorkSubmissions();
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Application ${status}`,
    });

    fetchApplications();
  };

  const handleVerifyWork = async (jobId: string, isApproved: boolean) => {
    const updateData: any = {
      status: isApproved ? "verified" : "rejected",
      verified_by: (await supabase.auth.getUser()).data.user?.id,
      verified_at: new Date().toISOString(),
      admin_notes: adminNotes || null,
    };

    if (isApproved && paymentAmount) {
      updateData.payment_sent = true;
      updateData.payment_amount = parseFloat(paymentAmount);
    }

    const { error } = await supabase
      .from("micro_jobs")
      .update(updateData)
      .eq("id", jobId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify work",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: isApproved ? "Work verified and payment processed" : "Work rejected",
    });

    setSelectedJob(null);
    setPaymentAmount("");
    setAdminNotes("");
    fetchWorkSubmissions();
  };

  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="verification">Work Verification</TabsTrigger>
        <TabsTrigger value="posted-jobs">Posted Jobs</TabsTrigger>
      </TabsList>

      <TabsContent value="applications">
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Review and manage user job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border p-4 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{app.job_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applicant: {app.profiles?.full_name || app.applicant_name}
                      </p>
                      <p className="text-sm mt-2">{app.cover_letter}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge>{app.status}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(app.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateApplicationStatus(app.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verification">
        <Card>
          <CardHeader>
            <CardTitle>Work Verification</CardTitle>
            <CardDescription>Review and verify submitted work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workSubmissions.map((job) => (
                <div key={job.id} className="border p-4 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted by: {job.profiles?.full_name || "Unknown"}
                      </p>
                      {job.media_url && (
                        <div className="mt-2">
                          {job.media_type === "image" ? (
                            <img
                              src={job.media_url}
                              alt="Work submission"
                              className="w-48 h-48 object-cover rounded"
                            />
                          ) : (
                            <video
                              src={job.media_url}
                              controls
                              className="w-48 h-48 rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      {selectedJob === job.id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <Input
                            type="number"
                            placeholder="Payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                          />
                          <Textarea
                            placeholder="Admin notes (optional)"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleVerifyWork(job.id, true)}
                            >
                              Verify & Pay
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerifyWork(job.id, false)}
                            >
                              Reject
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(null);
                              setPaymentAmount("");
                              setAdminNotes("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedJob(job.id)}
                        >
                          Process Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="posted-jobs">
        <Card>
          <CardHeader>
            <CardTitle>Posted Jobs</CardTitle>
            <CardDescription>Manage all job postings</CardDescription>
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
      </TabsContent>
    </Tabs>
  );
};

export default AdminJobsManagement;
