"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { verifyPayment } from "@/app/actions/payment"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function PaymentVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) {
      setVerifying(false)
      setError("No payment reference found")
      return
    }

    const verify = async () => {
      try {
        const result = await verifyPayment(reference)

        if (result.success) {
          setSuccess(true)
        } else {
          setError(result.error || "Payment verification failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setError("An error occurred during payment verification")
      } finally {
        setVerifying(false)
      }
    }

    verify()
  }, [reference])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Payment Verification</CardTitle>
          <CardDescription>Verifying your payment status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-gray-500">Verifying your payment...</p>
            </div>
          ) : success ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your payment has been successfully processed. Your application is now under review.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Verification Failed</AlertTitle>
              <AlertDescription>{error || "An error occurred during payment verification"}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className={success ? "bg-emerald-500 hover:bg-emerald-600" : ""}
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
