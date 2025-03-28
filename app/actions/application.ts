"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUserApplication(userId: string) {
  try {
    const application = await db.application.findUnique({
      where: { userId },
      include: {
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

export async function createUserApplication(userId: string, data: any) {
  try {
    const existingApplication = await db.application.findUnique({
      where: { userId },
    });

    if (existingApplication) {
      return { success: false, error: "User already has an application" };
    }

    const application = await db.application.create({
      data: {
        ...data,
        userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, applicationId: application.id };
  } catch (error) {
    console.error("Error creating application:", error);
    return { success: false, error: "Failed to create application" };
  }
}

export async function updateUserApplication(id: string, data: any) {
  try {
    const application = await db.application.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard");
    return { success: true, application };
  } catch (error) {
    console.error("Error updating application:", error);
    return { success: false, error: "Failed to update application" };
  }
}
