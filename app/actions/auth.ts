"use server"

import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { revalidatePath } from "next/cache"

type UserData = {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  password: string
  sex: string
  dateOfBirth: Date
  phone: string
  address: string
  stateOfOrigin: string
  localGovernment: string
  nationality: string
  nin: string
}

export async function createUser(data: UserData) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password)

    // Create the user with application in a transaction to ensure both succeed or fail together
    const user = await db.user.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
        application: {
          create: {
            stateOfOrigin: data.stateOfOrigin,
            localGovernment: data.localGovernment,
            address: data.address,
            nin: data.nin,
          },
        },
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: `Failed to create user: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function createApplication(userId: string, data: any) {
  try {
    const application = await db.application.create({
      data: {
        ...data,
        userId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, applicationId: application.id }
  } catch (error) {
    console.error("Error creating application:", error)
    return { success: false, error: "Failed to create application" }
  }
}

export async function uploadDocument(applicationId: string, name: string, url: string) {
  try {
    const document = await db.document.create({
      data: {
        name,
        url,
        applicationId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, documentId: document.id }
  } catch (error) {
    console.error("Error uploading document:", error)
    return { success: false, error: `Failed to upload document: ${error instanceof Error ? error.message : String(error)}` }
  }
}
