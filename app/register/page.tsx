"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createUser } from "@/app/actions/auth";

const personalInfoSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    sex: z.string().min(1, { message: "Please select your sex." }),
    dateOfBirth: z.date({ required_error: "Please select a date of birth." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const additionalInfoSchema = z.object({
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  stateOfOrigin: z
    .string()
    .min(1, { message: "Please select your state of origin." }),
  localGovernment: z
    .string()
    .min(1, { message: "Please select your local government." }),
  nationality: z.string().default("Nigeria"),
});

export default function RegisterPage() {
  const [step, setStep] = useState<"personal" | "additional">("personal");
  const router = useRouter();

  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      sex: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const additionalForm = useForm<z.infer<typeof additionalInfoSchema>>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      address: "",
      stateOfOrigin: "",
      localGovernment: "",
      nationality: "Nigeria",
    },
  });

  const onPersonalSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    console.log("Personal Info:", data);
    setStep("additional");
  };

  const onAdditionalSubmit = async (
    data: z.infer<typeof additionalInfoSchema>
  ) => {
    console.log("Additional Info:", data);

    const personalData = personalForm.getValues();

    try {
      const result = await createUser({
        ...personalData,
        ...data,
      });

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        console.error("Registration failed:", result.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">REGISTRATION</CardTitle>
          <CardDescription>
            Create your account to apply for a State of Origin Certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="personal"
                className={cn(
                  "data-[state=active]:bg-emerald-500 data-[state=active]:text-white",
                  step === "personal" ? "bg-emerald-500 text-white" : ""
                )}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-500">
                  1
                </span>
                Personal Information
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className={cn(
                  "data-[state=active]:bg-emerald-500 data-[state=active]:text-white",
                  step === "additional" ? "bg-emerald-500 text-white" : ""
                )}
                disabled={step === "personal"}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-500">
                  2
                </span>
                Additional Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <form
                onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...personalForm.register("lastName")}
                      placeholder="Enter last name"
                    />
                    {personalForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...personalForm.register("firstName")}
                      placeholder="Enter first name"
                    />
                    {personalForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      {...personalForm.register("middleName")}
                      placeholder="Enter middle name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select
                      onValueChange={(value) =>
                        personalForm.setValue("sex", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {personalForm.formState.errors.sex && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.sex.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !personalForm.getValues().dateOfBirth &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {personalForm.getValues().dateOfBirth ? (
                            format(personalForm.getValues().dateOfBirth, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={personalForm.getValues().dateOfBirth}
                          onSelect={(date) =>
                            date && personalForm.setValue("dateOfBirth", date)
                          }
                          initialFocus
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {personalForm.formState.errors.dateOfBirth && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...personalForm.register("phone")}
                      placeholder="Enter phone number"
                    />
                    {personalForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...personalForm.register("email")}
                    placeholder="Enter email address"
                  />
                  {personalForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {personalForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...personalForm.register("password")}
                      placeholder="Enter your password"
                    />
                    {personalForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...personalForm.register("confirmPassword")}
                      placeholder="Confirm password"
                    />
                    {personalForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {personalForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="additional">
              <form
                onSubmit={additionalForm.handleSubmit(onAdditionalSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...additionalForm.register("address")}
                    placeholder="Enter your address"
                  />
                  {additionalForm.formState.errors.address && (
                    <p className="text-sm text-red-500">
                      {additionalForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stateOfOrigin">State of Origin</Label>
                    <Select
                      onValueChange={(value) =>
                        additionalForm.setValue("stateOfOrigin", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="osun">Osun</SelectItem>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                        <SelectItem value="ogun">Ogun</SelectItem>
                        <SelectItem value="ekiti">Ekiti</SelectItem>
                        <SelectItem value="ondo">Ondo</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                    {additionalForm.formState.errors.stateOfOrigin && (
                      <p className="text-sm text-red-500">
                        {additionalForm.formState.errors.stateOfOrigin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localGovernment">Local Government</Label>
                    <Select
                      onValueChange={(value) =>
                        additionalForm.setValue("localGovernment", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select local government" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ife_central">Ife Central</SelectItem>
                        <SelectItem value="ife_east">Ife East</SelectItem>
                        <SelectItem value="ife_north">Ife North</SelectItem>
                        <SelectItem value="ife_south">Ife South</SelectItem>
                        <SelectItem value="ilesa_east">Ilesa East</SelectItem>
                        <SelectItem value="ilesa_west">Ilesa West</SelectItem>
                        {/* Add more local governments as needed */}
                      </SelectContent>
                    </Select>
                    {additionalForm.formState.errors.localGovernment && (
                      <p className="text-sm text-red-500">
                        {
                          additionalForm.formState.errors.localGovernment
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" value="Nigeria" disabled />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("personal")}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already signed up?{" "}
            <Link href="/login" className="text-emerald-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
