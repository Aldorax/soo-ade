"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { createUser } from "@/app/actions/auth"

const personalInfoFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  sex: z.string().min(1, { message: "Please select your sex." }),
  dateOfBirth: z.string(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const personalInfoDataSchema = personalInfoFormSchema.transform((data) => ({
  ...data,
  dateOfBirth: new Date(data.dateOfBirth)
}))

const additionalInfoSchema = z.object({
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  stateOfOrigin: z.string().min(1, { message: "Please select your state of origin." }),
  localGovernment: z.string().min(1, { message: "Please select your local government." }),
  nationality: z.string().default("Nigeria"),
})

const localGovernmentsByState = {
  nasarawa: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  kaduna: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  bauchi: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  niger: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Munya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
}

export default function RegisterPage() {
  const [step, setStep] = useState<"personal" | "additional">("personal")
  const [selectedState, setSelectedState] = useState<string>("")
  const router = useRouter()

  const personalForm = useForm<z.infer<typeof personalInfoFormSchema>>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      sex: "",
      dateOfBirth: new Date().toISOString().split('T')[0],
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const additionalForm = useForm<z.infer<typeof additionalInfoSchema>>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      address: "",
      stateOfOrigin: "",
      localGovernment: "",
      nationality: "Nigeria",
    },
  })

  const onPersonalSubmit = (data: z.infer<typeof personalInfoFormSchema>) => {
    const parsedData = personalInfoDataSchema.parse(data)
    console.log("Personal Info:", parsedData)
    setStep("additional")
  }

  const onAdditionalSubmit = async (data: z.infer<typeof additionalInfoSchema>) => {
    console.log("Additional Info:", data)
    const personalData = personalInfoDataSchema.parse(personalForm.getValues())
    try {
      const result = await createUser({
        ...personalData,
        ...data,
      })
      if (result.success) {
        router.push("/login?registered=true")
      } else {
        console.error("Registration failed:", result.error)
      }
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    additionalForm.setValue("stateOfOrigin", state)
    additionalForm.setValue("localGovernment", "")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">REGISTRATION</CardTitle>
          <CardDescription>Create your account to apply for a State of Origin Certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="personal" className={cn("data-[state=active]:bg-green-600 data-[state=active]:text-white", step === "personal" ? "bg-green-600 text-white" : "")}>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600">1</span>
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="additional" className={cn("data-[state=active]:bg-green-600 data-[state=active]:text-white", step === "additional" ? "bg-green-600 text-white" : "")} disabled={step === "personal"}>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600">2</span>
                Additional Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...personalForm.register("lastName")} placeholder="Enter last name" />
                    {personalForm.formState.errors.lastName && <p className="text-sm text-red-500">{personalForm.formState.errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...personalForm.register("firstName")} placeholder="Enter first name" />
                    {personalForm.formState.errors.firstName && <p className="text-sm text-red-500">{personalForm.formState.errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" {...personalForm.register("middleName")} placeholder="Enter middle name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select onValueChange={(value) => personalForm.setValue("sex", value)}>
                      <SelectTrigger><SelectValue placeholder="Select sex" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {personalForm.formState.errors.sex && <p className="text-sm text-red-500">{personalForm.formState.errors.sex.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input type="date" id="dateOfBirth" {...personalForm.register("dateOfBirth")} max={new Date().toISOString().split('T')[0]} min="1900-01-01" />
                    {personalForm.formState.errors.dateOfBirth && <p className="text-sm text-red-500">{personalForm.formState.errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...personalForm.register("phone")} placeholder="Enter phone number" />
                    {personalForm.formState.errors.phone && <p className="text-sm text-red-500">{personalForm.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...personalForm.register("email")} placeholder="Enter email address" />
                  {personalForm.formState.errors.email && <p className="text-sm text-red-500">{personalForm.formState.errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...personalForm.register("password")} placeholder="Enter your password" />
                    {personalForm.formState.errors.password && <p className="text-sm text-red-500">{personalForm.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" {...personalForm.register("confirmPassword")} placeholder="Confirm password" />
                    {personalForm.formState.errors.confirmPassword && <p className="text-sm text-red-500">{personalForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Next</Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="additional">
              <form onSubmit={additionalForm.handleSubmit(onAdditionalSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...additionalForm.register("address")} placeholder="Enter your address" />
                  {additionalForm.formState.errors.address && <p className="text-sm text-red-500">{additionalForm.formState.errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stateOfOrigin">State of Origin</Label>
                    <Select onValueChange={handleStateChange}>
                      <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nasarawa">Nasarawa</SelectItem>
                        <SelectItem value="kaduna">Kaduna</SelectItem>
                        <SelectItem value="bauchi">Bauchi</SelectItem>
                        <SelectItem value="niger">Niger</SelectItem>
                      </SelectContent>
                    </Select>
                    {additionalForm.formState.errors.stateOfOrigin && <p className="text-sm text-red-500">{additionalForm.formState.errors.stateOfOrigin.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localGovernment">Local Government</Label>
                    <Select onValueChange={(value) => additionalForm.setValue("localGovernment", value)} disabled={!selectedState}>
                      <SelectTrigger><SelectValue placeholder={selectedState ? "Select local government" : "Select state first"} /></SelectTrigger>
                      <SelectContent>
                        {selectedState && localGovernmentsByState[selectedState as keyof typeof localGovernmentsByState].map((lg) => (
                          <SelectItem key={lg} value={lg.toLowerCase().replace(/\s+/g, "_")}>{lg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {additionalForm.formState.errors.localGovernment && <p className="text-sm text-red-500">{additionalForm.formState.errors.localGovernment.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" value="Nigeria" disabled />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep("personal")}>Previous</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Submit</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already signed up?{" "}
            <Link href="/login" className="text-green-600 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}