import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminWorkVerification = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchPendingWork();
  }, []);

  const fetchPendingWork = async () => {
    const { data, error } = await supabase
      .from("micro_jobs")
      .select(`
        *,
        profiles (full_name, avatar_url)
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

    setJobs(data || []);
  };

  const handleVerify = async (jobId: string, verified: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const updateData: any = {
      verified_by: user.id,
      verified_at: new Date().toISOString(),
      admin_notes: adminNotes,
      status: verified ? "verified" : "rejected",
    };

    if (verified && paymentAmount) {
      updateData.payment_amount = parseFloat(paymentAmount);
      updateData.payment_sent = true;
    }

    const { error } = await supabase
      .from("micro_jobs")
      .update(updateData)
      .eq("id", jobId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: verified 
        ? "Work verified and payment processed" 
        : "Work rejected",
    });

    setSelectedJob(null);
    setPaymentAmount("");
    setAdminNotes("");
    fetchPendingWork();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Verification & Payment</CardTitle>
          <CardDescription>Review submitted work and process payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border p-4 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge variant="outline">{job.work_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Submitted by: {job.profiles?.full_name || "Unknown"}</span>
                      <span>Location: {job.location}</span>
                      <span>Points: {job.benefit_points}</span>
                    </div>
                  </div>
                </div>

                {job.media_url && (
                  <div className="mt-2">
                    <Label>Submitted Media:</Label>
                    {job.media_type === "image" ? (
                      <img
                        src={job.media_url}
                        alt="Work submission"
                        className="mt-2 max-w-md rounded-lg border"
                      />
                    ) : (
                      <video
                        src={job.media_url}
                        controls
                        className="mt-2 max-w-md rounded-lg border"
                      />
                    )}
                  </div>
                )}

                {selectedJob?.id === job.id ? (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment">Payment Amount ($)</Label>
                      <Input
                        id="payment"
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter payment amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Admin Notes</Label>
                      <Textarea
                        id="notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add any notes about this submission"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerify(job.id, true)}
                        disabled={!paymentAmount}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify & Send Payment
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleVerify(job.id, false)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedJob(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setSelectedJob(job)}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                )}
              </div>
            ))}
            {jobs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No pending work submissions
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWorkVerification;