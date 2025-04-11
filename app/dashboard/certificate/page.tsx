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

      <Tabs defaultValue="certificate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

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
