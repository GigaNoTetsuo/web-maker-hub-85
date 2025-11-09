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
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchWorkSubmissions();
    fetchWithdrawals();
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
      .not("media_url", "is", null)
      .neq("status", "verified")
      .neq("status", "rejected")
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

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase
      .from("withdrawals")
      .select(`
        *,
        profiles!withdrawals_user_id_fkey (full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch withdrawals",
        variant: "destructive",
      });
      return;
    }

    setWithdrawals(data || []);
  };

  const updateWithdrawalStatus = async (withdrawalId: string, status: string) => {
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status,
        processed_at: new Date().toISOString(),
        processed_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", withdrawalId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update withdrawal",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Withdrawal ${status}`,
    });

    fetchWithdrawals();
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
    // Get the job details first to get user_id and benefit_points
    const { data: jobData, error: jobError } = await supabase
      .from("micro_jobs")
      .select("user_id, benefit_points")
      .eq("id", jobId)
      .single();

    if (jobError) {
      toast({
        title: "Error",
        description: "Failed to fetch job details",
        variant: "destructive",
      });
      return;
    }

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

    // If approved, add points to user's profile
    if (isApproved && jobData.benefit_points) {
      const { error: pointsError } = await supabase.rpc(
        "increment_user_points",
        {
          p_user_id: jobData.user_id,
          p_points: jobData.benefit_points,
        }
      );

      if (pointsError) {
        console.error("Failed to add points:", pointsError);
      }
    }

    toast({
      title: "Success",
      description: isApproved 
        ? `Work verified, payment processed, and ${jobData.benefit_points} points added!` 
        : "Work rejected",
    });

    setSelectedJob(null);
    setPaymentAmount("");
    setAdminNotes("");
    fetchWorkSubmissions();
  };

  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="verification">Work Verification</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
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
            <CardDescription>Review and verify submitted work from users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No work submissions to verify yet
                </p>
              ) : (
                workSubmissions.map((job) => (
                  <div key={job.id} className="border p-4 rounded-lg space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge variant={job.status === "approved" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Submitted by: {job.profiles?.full_name || "Unknown"}</span>
                          <span>Location: {job.location}</span>
                          <span>Type: {job.work_type}</span>
                          <span>Points: {job.benefit_points}</span>
                        </div>
                        {job.media_url && (
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-2">Submitted Work:</p>
                            {job.media_type === "image" ? (
                              <img
                                src={job.media_url}
                                alt="Work submission"
                                className="max-w-md w-full h-auto object-cover rounded border"
                              />
                            ) : (
                              <video
                                src={job.media_url}
                                controls
                                className="max-w-md w-full h-auto rounded border"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
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
                              rows={3}
                            />
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleVerifyWork(job.id, true)}
                                className="w-full"
                              >
                                Verify & Pay
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleVerifyWork(job.id, false)}
                                className="w-full"
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedJob(null);
                                  setPaymentAmount("");
                                  setAdminNotes("");
                                }}
                                className="w-full"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setSelectedJob(job.id)}
                          >
                            Review Work
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="withdrawals">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>Review and process user withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No withdrawal requests yet
                </p>
              ) : (
                withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="border p-4 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {withdrawal.profiles?.full_name || "Unknown User"}
                          </h3>
                          <Badge variant={
                            withdrawal.status === "approved" 
                              ? "default" 
                              : withdrawal.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }>
                            {withdrawal.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Points:</span>
                            <span className="ml-2 font-semibold">{withdrawal.points_withdrawn}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="ml-2 font-semibold">₨{parseFloat(withdrawal.amount_pkr).toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Method:</span>
                            <span className="ml-2">{withdrawal.payment_method}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Details:</span>
                            <span className="ml-2">{withdrawal.payment_details?.details || "N/A"}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested: {new Date(withdrawal.created_at).toLocaleString()}
                        </p>
                      </div>
                      {withdrawal.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateWithdrawalStatus(withdrawal.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
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
