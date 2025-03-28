"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { verifyCertificate, verifyWithOTP } from "@/app/actions/verification";

export default function VerifyPage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await verifyCertificate(certificateNumber);

      if (result.success) {
        setVerificationResult(result.application);
      } else {
        setError(result.error || "Certificate not found");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real application, this would send an OTP to the user's email
      // For this example, we'll just set a flag
      setOtpSent(true);
      setLoading(false);
    } catch (error) {
      setError("Failed to send OTP");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // For this example, we'll accept "0000" as the valid OTP
      const result = await verifyWithOTP(email, otp);

      if (result.success) {
        setVerificationResult(result.application);
      } else {
        setError(result.error || "Invalid OTP");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Verify Certificate of Origin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Verify by Certificate Number</CardTitle>
              <CardDescription>
                Enter the certificate number to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input
                    id="certificateNumber"
                    placeholder="Enter certificate number"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Certificate"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verify with Email OTP</CardTitle>
              <CardDescription>
                Enter your email to receive an OTP for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="Enter the OTP sent to your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      For demo purposes, use "0000" as the OTP
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert className="mt-8 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verificationResult && (
          <Card className="mt-8">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Certificate Verified</CardTitle>
              </div>
              <CardDescription>
                This certificate is authentic and was issued by the State
                Government
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Certificate Number</p>
                  <p className="text-sm text-gray-500">
                    {verificationResult.certificateNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-gray-500">
                    {`${verificationResult.user.firstName} ${verificationResult.user.lastName}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">State of Origin</p>
                  <p className="text-sm text-gray-500">
                    {verificationResult.stateOfOrigin}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Local Government</p>
                  <p className="text-sm text-gray-500">
                    {verificationResult.localGovernment}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Issue Date</p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      verificationResult.approvedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-gray-500">Valid</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <p className="text-xs text-gray-500">
                This information is provided by the State Government Certificate
                of Origin Portal.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
