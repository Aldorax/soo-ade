"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateCertificateNumber } from "@/lib/utils";

export async function getAllApplications() {
  try {
    const applications = await db.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, applications };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}

export async function getApplicationById(id: string) {
  try {
    const application = await db.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            phone: true,
            sex: true,
            dateOfBirth: true,
          },
        },
        documents: true,
      },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    return { success: true, application };
  } catch (error) {
    console.error("Error fetching application:", error);
    return { success: false, error: "Failed to fetch application" };
  }
}

export async function approveApplication(id: string) {
  try {
    const application = await db.application.findUnique({
      where: { id },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    if (application.status !== "PENDING") {
      return { success: false, error: "Application is not in pending state" };
    }

    const certificateNumber = generateCertificateNumber();

    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: "admin", // In a real app, this would be the admin's ID
        certificateNumber,
      },
    });

    revalidatePath("/admin");
    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error("Error approving application:", error);
    return { success: false, error: "Failed to approve application" };
  }
}

export async function rejectApplication(id: string, reason: string) {
  try {
    const application = await db.application.findUnique({
      where: { id },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    if (application.status !== "PENDING") {
      return { success: false, error: "Application is not in pending state" };
    }

    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });

    revalidatePath("/admin");
    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error("Error rejecting application:", error);
    return { success: false, error: "Failed to reject application" };
  }
}
