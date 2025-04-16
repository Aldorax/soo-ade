import axios from "axios"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_27dd72402e24bf9647e335d0ce5b84f063496be5"
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_b4f49c6db7f0c65251645d25ab715f779bb8a3e5"
const BASE_URL = "https://api.paystack.co"

// Types for Paystack responses
interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    customer: {
      email: string
    }
    metadata: any
  }
}

// Initialize a transaction
export async function initializeTransaction(
  email: string,
  amount: number,
  reference: string,
  metadata: any = {},
): Promise<PaystackInitializeResponse> {
  try {
    const response = await axios.post(
      `${BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Paystack amount is in kobo (100 kobo = 1 Naira)
        reference,
        metadata,
        callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  } catch (error) {
    console.error("Paystack initialize error:", error)
    throw new Error("Failed to initialize payment")
  }
}

// Verify a transaction
export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
  try {
    const response = await axios.get(`${BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Paystack verify error:", error)
    throw new Error("Failed to verify payment")
  }
}

// Get transaction history
export async function getTransactionHistory() {
  try {
    const response = await axios.get(`${BASE_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Paystack transaction history error:", error)
    throw new Error("Failed to get transaction history")
  }
}

// Generate a unique reference
export function generateReference() {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  return `SOO-${timestamp}-${random}`
}
