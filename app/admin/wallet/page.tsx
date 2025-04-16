"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getAllTransactions, getWalletSummary } from "@/app/actions/payment"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export default function AdminWalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [walletSummary, setWalletSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard")
      } else {
        fetchData()
      }
    }
  }, [status, session, router])

  const fetchData = async () => {
    try {
      const [transactionsResult, summaryResult] = await Promise.all([getAllTransactions(), getWalletSummary()])

      if (transactionsResult.success && transactionsResult.transactions) {
        setTransactions(transactionsResult.transactions)
      }

      if (summaryResult.success) {
        setWalletSummary(summaryResult)
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Wallet" text="Manage payment transactions and revenue" />
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

  return (
    <DashboardShell>
      <DashboardHeader heading="Wallet" text="Manage payment transactions and revenue">
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletSummary ? formatCurrency(walletSummary.totalAmount) : "₦0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              From {walletSummary ? walletSummary.transactionCount : 0} successful transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter((t) => t.application?.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter((t) => t.application?.status === "APPROVED").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all payment transactions for State of Origin applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.reference}</TableCell>
                    <TableCell>
                      {transaction.user.firstName} {transaction.user.lastName}
                      <div className="text-xs text-gray-500">{transaction.user.email}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "SUCCESS"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : transaction.status === "FAILED"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {transaction.status === "SUCCESS" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {transaction.status === "PENDING" && <Clock className="mr-1 h-3 w-3" />}
                        {transaction.status === "FAILED" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.application ? (
                        <Badge
                          className={
                            transaction.application.status === "APPROVED"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.application.status === "REJECTED"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {transaction.application.status === "APPROVED" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {transaction.application.status === "PENDING" && <Clock className="mr-1 h-3 w-3" />}
                          {transaction.application.status === "REJECTED" && <AlertCircle className="mr-1 h-3 w-3" />}
                          {transaction.application.status}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">No application</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
