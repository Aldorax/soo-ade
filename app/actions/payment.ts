"use server"

import { db } from "@/lib/db"
import { generateReference, initializeTransaction, verifyTransaction } from "@/lib/paystack"
import { revalidatePath } from "next/cache"

// Constants
const APPLICATION_FEE = 10000 // 10,000 Naira

// Initialize payment for an application
export async function initializePayment(userId: string, applicationId: string) {
  try {
    // Get user and application
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        application: true,
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.application) {
      return { success: false, error: "No application found for this user" }
    }

    // Check if payment is already made
    if (user.application.paymentStatus === "PAID") {
      return { success: false, error: "Payment has already been made for this application" }
    }

    // Generate a unique reference
    const reference = generateReference()

    // Create a pending transaction record
    const transaction = await db.transaction.create({
      data: {
        amount: APPLICATION_FEE,
        currency: "NGN",
        status: "PENDING",
        reference,
        userId,
        applicationId,
        metadata: JSON.stringify({
          applicationType: "STATE_OF_ORIGIN",
          applicationId,
        }),
      },
    })

    // Initialize payment with Paystack
    const paymentResponse = await initializeTransaction(user.email, APPLICATION_FEE, reference, {
      userId,
      applicationId,
    })

    return {
      success: true,
      transactionId: transaction.id,
      authorizationUrl: paymentResponse.data.authorization_url,
      reference,
    }
  } catch (error) {
    console.error("Error initializing payment:", error)
    return { success: false, error: "Failed to initialize payment" }
  }
}

// Verify payment
export async function verifyPayment(reference: string) {
  try {
    // Find the transaction
    const transaction = await db.transaction.findUnique({
      where: { reference },
      include: {
        application: true,
      },
    })

    if (!transaction) {
      return { success: false, error: "Transaction not found" }
    }

    // If already verified and successful, return success
    if (transaction.status === "SUCCESS") {
      return { success: true, transaction }
    }

    // Verify with Paystack
    const verificationResponse = await verifyTransaction(reference)

    // Update transaction status based on Paystack response
    if (verificationResponse.data.status === "success") {
      // Update transaction
      const updatedTransaction = await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          updatedAt: new Date(),
        },
      })

      // Update application payment status
      if (transaction.applicationId) {
        await db.application.update({
          where: { id: transaction.applicationId },
          data: {
            paymentStatus: "PAID",
          },
        })
      }

      revalidatePath("/dashboard")
      revalidatePath("/admin")

      return { success: true, transaction: updatedTransaction }
    } else {
      // Update transaction as failed
      const updatedTransaction = await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      })

      return { success: false, error: "Payment verification failed", transaction: updatedTransaction }
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return { success: false, error: "Failed to verify payment" }
  }
}

// Get all transactions (for admin)
export async function getAllTransactions() {
  try {
    const transactions = await db.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        application: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, transactions }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, error: "Failed to fetch transactions" }
  }
}

// Get wallet summary (for admin)
export async function getWalletSummary() {
  try {
    // Get total amount from successful transactions
    const successfulTransactions = await db.transaction.findMany({
      where: {
        status: "SUCCESS",
      },
    })

    const totalAmount = successfulTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const transactionCount = successfulTransactions.length

    // Get recent transactions
    const recentTransactions = await db.transaction.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return {
      success: true,
      totalAmount,
      transactionCount,
      recentTransactions,
    }
  } catch (error) {
    console.error("Error fetching wallet summary:", error)
    return { success: false, error: "Failed to fetch wallet summary" }
  }
}

// Get user transactions
export async function getUserTransactions(userId: string) {
  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, transactions }
  } catch (error) {
    console.error("Error fetching user transactions:", error)
    return { success: false, error: "Failed to fetch user transactions" }
  }
}
