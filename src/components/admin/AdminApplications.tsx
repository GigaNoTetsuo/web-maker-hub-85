import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const updateApplicationStatus = async (appId: string, status: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", appId);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>Review and manage job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border p-4 rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{app.job_title}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Applicant:</strong> {app.applicant_name}</p>
                    <p><strong>Email:</strong> {app.applicant_email}</p>
                    <p><strong>Phone:</strong> {app.applicant_phone}</p>
                    <p><strong>Availability:</strong> {app.availability}</p>
                    <p className="text-muted-foreground"><strong>Cover Letter:</strong> {app.cover_letter}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge>{app.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {app.status === "pending" && (
                    <>
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

export default AdminApplications;