"use server";

import { db } from "@/lib/db";

export async function verifyCertificate(certificateNumber: string) {
  try {
    const application = await db.application.findFirst({
      where: {
        certificateNumber,
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!application) {
      return { success: false, error: "Certificate not found or not valid" };
    }

    return { success: true, application };
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return { success: false, error: "Failed to verify certificate" };
  }
}

export async function verifyWithOTP(email: string, otp: string) {
  try {
    // For demo purposes, we'll accept "0000" as the valid OTP
    if (otp !== "0000") {
      return { success: false, error: "Invalid OTP" };
    }

    const user = await db.user.findUnique({
      where: { email },
      include: {
        application: true,
      },
    });

    if (!user || !user.application) {
      return { success: false, error: "No application found for this email" };
    }

    if (user.application.status !== "APPROVED") {
      return { success: false, error: "Application is not approved" };
    }

    const application = await db.application.findUnique({
      where: { id: user.application.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { success: true, application };
  } catch (error) {
    console.error("Error verifying with OTP:", error);
    return { success: false, error: "Failed to verify with OTP" };
  }
}
