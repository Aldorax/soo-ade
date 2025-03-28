"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  getAllApplications,
  approveApplication,
  rejectApplication,
} from "@/app/actions/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Search, X } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
      } else {
        fetchApplications();
      }
    }
  }, [status, session, router]);

  const fetchApplications = async () => {
    try {
      const result = await getAllApplications();
      if (result.success) {
        setApplications(result.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const result = await approveApplication(applicationId);
      if (result.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const result = await rejectApplication(applicationId, rejectionReason);
      if (result.success) {
        setRejectionReason("");
        setSelectedApplication(null);
        fetchApplications();
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.certificateNumber &&
        app.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (status === "loading" || loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Admin Dashboard"
          text="Manage State of Origin Certificate applications"
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
        heading="Admin Dashboard"
        text="Manage State of Origin Certificate applications"
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, ID or certificate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                View and manage all certificate applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{`${app.user.firstName} ${app.user.lastName}`}</TableCell>
                        <TableCell>{app.stateOfOrigin}</TableCell>
                        <TableCell>{app.localGovernment}</TableCell>
                        <TableCell>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.status === "APPROVED"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : app.status === "REJECTED"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {app.status === "APPROVED" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {app.status === "PENDING" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {app.status === "REJECTED" && (
                              <X className="mr-1 h-3 w-3" />
                            )}
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/applications/${app.id}`)
                              }
                            >
                              View
                            </Button>
                            {app.status === "PENDING" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(app.id)}
                                >
                                  Approve
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={() =>
                                        setSelectedApplication(app)
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Reject Application
                                      </DialogTitle>
                                      <DialogDescription>
                                        Please provide a reason for rejecting
                                        this application.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="reason">
                                          Reason for Rejection
                                        </Label>
                                        <Textarea
                                          id="reason"
                                          placeholder="Enter reason for rejection"
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setRejectionReason("");
                                          setSelectedApplication(null);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() =>
                                          handleReject(selectedApplication.id)
                                        }
                                      >
                                        Reject Application
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Applications awaiting review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(
                    (app) => app.status === "PENDING"
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No pending applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications
                      .filter((app) => app.status === "PENDING")
                      .map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{`${app.user.firstName} ${app.user.lastName}`}</TableCell>
                          <TableCell>{app.stateOfOrigin}</TableCell>
                          <TableCell>{app.localGovernment}</TableCell>
                          <TableCell>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/applications/${app.id}`)
                                }
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(app.id)}
                              >
                                Approve
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => setSelectedApplication(app)}
                                  >
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Reject Application
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this
                                      application.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">
                                        Reason for Rejection
                                      </Label>
                                      <Textarea
                                        id="reason"
                                        placeholder="Enter reason for rejection"
                                        value={rejectionReason}
                                        onChange={(e) =>
                                          setRejectionReason(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setRejectionReason("");
                                        setSelectedApplication(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() =>
                                        handleReject(selectedApplication.id)
                                      }
                                    >
                                      Reject Application
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                Applications that have been approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Certificate Number</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(
                    (app) => app.status === "APPROVED"
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No approved applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications
                      .filter((app) => app.status === "APPROVED")
                      .map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{`${app.user.firstName} ${app.user.lastName}`}</TableCell>
                          <TableCell>{app.certificateNumber}</TableCell>
                          <TableCell>{app.stateOfOrigin}</TableCell>
                          <TableCell>{app.localGovernment}</TableCell>
                          <TableCell>
                            {new Date(app.approvedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/applications/${app.id}`)
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                Applications that have been rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(
                    (app) => app.status === "REJECTED"
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No rejected applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications
                      .filter((app) => app.status === "REJECTED")
                      .map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{`${app.user.firstName} ${app.user.lastName}`}</TableCell>
                          <TableCell>{app.stateOfOrigin}</TableCell>
                          <TableCell>{app.localGovernment}</TableCell>
                          <TableCell>
                            {app.rejectionReason || "No reason provided"}
                          </TableCell>
                          <TableCell>
                            {new Date(app.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/applications/${app.id}`)
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
