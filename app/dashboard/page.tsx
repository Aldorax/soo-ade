"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Upload,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { getUserApplication } from "@/app/actions/application";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        fetchApplication();
      }
    }
  }, [status, session, router]);

  const fetchApplication = async () => {
    if (!session?.user?.id) return;

    try {
      const result = await getUserApplication(session.user.id);
      if (result.success) {
        setApplication(result.application);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Manage your State of Origin Certificate application"
        />
        <div className="grid gap-4">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <p>Loading...</p>
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
        heading="Dashboard"
        text="Manage your State of Origin Certificate application"
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>
                Current status of your State of Origin Certificate application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!application ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Application Found</AlertTitle>
                  <AlertDescription>
                    You haven't started your application process yet. Click the
                    button below to begin.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Application ID</p>
                      <p className="text-sm text-gray-500">{application.id}</p>
                    </div>
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
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {application.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">State of Origin</p>
                      <p className="text-sm text-gray-500">
                        {application.stateOfOrigin}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Local Government</p>
                      <p className="text-sm text-gray-500">
                        {application.localGovernment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submission Date</p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {application.status === "APPROVED" && (
                      <div>
                        <p className="text-sm font-medium">Approval Date</p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            application.approvedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {application.status === "REJECTED" && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Application Rejected</AlertTitle>
                      <AlertDescription>
                        {application.rejectionReason ||
                          "Your application has been rejected. Please contact support for more information."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {application.status === "APPROVED" && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Application Approved</AlertTitle>
                      <AlertDescription>
                        Your State of Origin Certificate has been approved. You
                        can now download your certificate.
                      </AlertDescription>
                    </Alert>
                  )}

                  {application.status === "PENDING" && (
                    <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Application Pending</AlertTitle>
                      <AlertDescription>
                        Your application is currently under review. This process
                        typically takes 2-3 business days.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!application ? (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => router.push("/dashboard/apply")}
                >
                  Start Application
                </Button>
              ) : application.status === "APPROVED" ? (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => router.push("/dashboard/certificate")}
                >
                  View Certificate
                </Button>
              ) : (
                <Button variant="outline" onClick={() => fetchApplication()}>
                  Refresh Status
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details associated with this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-gray-500">{session?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
                {application && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-gray-500">
                        {application.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Certificate Number</p>
                      <p className="text-sm text-gray-500">
                        {application.certificateNumber || "Not yet assigned"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
              <CardDescription>
                Upload and manage documents required for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!application ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to start an application before uploading documents.
                  </AlertDescription>
                </Alert>
              ) : application.documents && application.documents.length > 0 ? (
                <div className="space-y-4">
                  {application.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded on{" "}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No Documents Uploaded</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Upload the required documents to support your application
                  </p>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => router.push("/dashboard/documents")}
                    disabled={application.status !== "PENDING"}
                  >
                    Upload Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate</CardTitle>
              <CardDescription>
                View and download your State of Origin Certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!application || application.status !== "APPROVED" ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your certificate will be available once your application is
                    approved.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-6">
                  <div className="border rounded-md p-8 mb-4">
                    <h2 className="text-2xl font-bold mb-4">
                      Certificate of Origin
                    </h2>
                    <p className="mb-6">This is to certify that</p>
                    <p className="text-xl font-semibold mb-2">
                      {session?.user?.name}
                    </p>
                    <p className="mb-6">is a bonafide indigene of</p>
                    <p className="text-xl font-semibold mb-2">
                      {application.localGovernment}, {application.stateOfOrigin}{" "}
                      State
                    </p>
                    <p className="mb-6">
                      Certificate Number: {application.certificateNumber}
                    </p>
                    <div className="mt-8 pt-8 border-t">
                      <p className="font-semibold">Authorized Signature</p>
                      <p className="text-sm text-gray-500">
                        Issued on{" "}
                        {new Date(application.approvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Download Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
