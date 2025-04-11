// app/admin/applications/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, X } from "lucide-react";
import { getApplicationById } from "@/app/actions/admin";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const result = await getApplicationById(id as string);
        if (result.success) {
          setApplication(result.application);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Application Details"
          text="Loading application data..."
        />
        <div className="grid gap-4">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <p>Loading application details...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  if (!application) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Application Details"
          text="Application not found"
        />
        <div className="grid gap-4">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <p>Application not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Application Details"
        text={`Viewing application #${application.id.substring(0, 8)}`}
      >
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Application Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={
                  application.status === "APPROVED"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : application.status === "REJECTED"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              >
                {application.status === "APPROVED" && (
                  <CheckCircle className="mr-1 h-3 w-3" />
                )}
                {application.status === "PENDING" && (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {application.status === "REJECTED" && (
                  <X className="mr-1 h-3 w-3" />
                )}
                {application.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p>{`${application.user.firstName} ${application.user.lastName}`}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{application.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{application.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>
                    {new Date(application.user.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Origin Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">State of Origin</p>
                  <p>{application.stateOfOrigin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Local Government</p>
                  <p>{application.localGovernment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{application.address}</p>
                </div>
                {application.nationality && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p>{application.nationality}</p>
                  </div>
                )}
              </div>
            </div>

            {application.status === "REJECTED" && application.rejectionReason && (
              <div className="space-y-2">
                <h3 className="font-medium">Rejection Reason</h3>
                <p className="text-sm">{application.rejectionReason}</p>
              </div>
            )}

            {application.status === "APPROVED" && application.certificateNumber && (
              <div className="space-y-2">
                <h3 className="font-medium">Certificate Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate Number</p>
                    <p>{application.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Date</p>
                    <p>
                      {new Date(application.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {application.documents && application.documents.length > 0 ? (
              <div className="space-y-4">
                {application.documents.map((doc: any) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No documents uploaded for this application
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}