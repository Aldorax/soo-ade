"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getUserApplication } from "@/app/actions/application"
import { initializePayment } from "@/app/actions/payment"
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react"

export default function PaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchApplication()
    }
  }, [status, session, router])

  const fetchApplication = async () => {
    if (!session?.user?.id) return

    try {
      const result = await getUserApplication(session.user.id)
      if (result.success) {
        setApplication(result.application)
      }
    } catch (error) {
      console.error("Error fetching application:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!session?.user?.id || !application) return

    setPaymentLoading(true)
    setError(null)

    try {
      const result = await initializePayment(session.user.id, application.id)

      if (result.success && result.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = result.authorizationUrl
      } else {
        setError(result.error || "Failed to initialize payment")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError("An error occurred while processing your payment")
    } finally {
      setPaymentLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Payment" text="Pay for your State of Origin Certificate application" />
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
    )
  }

  if (!application) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Payment" text="Pay for your State of Origin Certificate application" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No application found. Please start an application before making a payment.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Payment" text="Pay for your State of Origin Certificate application" />

      <Card>
        <CardHeader>
          <CardTitle>Application Payment</CardTitle>
          <CardDescription>
            Complete your payment to proceed with your State of Origin Certificate application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {application.paymentStatus === "PAID" ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Payment Completed</AlertTitle>
              <AlertDescription>
                Your payment has been successfully processed. Your application is now under review.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Payment Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application ID:</span>
                    <span className="font-medium">{application.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Applicant:</span>
                    <span className="font-medium">{session?.user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">State of Origin:</span>
                    <span className="font-medium">{application.stateOfOrigin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Local Government:</span>
                    <span className="font-medium">{application.localGovernment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application Fee:</span>
                    <span className="font-medium">₦10,000.00</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <p className="text-gray-500 mb-4">
                  We accept payments via Paystack. You will be redirected to a secure payment page to complete your
                  transaction.
                </p>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span>Credit/Debit Card, Bank Transfer, USSD</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          {application.paymentStatus === "PAID" ? (
            <Button onClick={() => router.push("/dashboard")} className="bg-emerald-500 hover:bg-emerald-600">
              Return to Dashboard
            </Button>
          ) : (
            <div className="flex flex-col w-full space-y-2">
              <Button
                onClick={handlePayment}
                className="bg-emerald-500 hover:bg-emerald-600 w-full"
                disabled={paymentLoading}
              >
                {paymentLoading ? "Processing..." : "Pay ₦10,000.00"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By clicking the button above, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
