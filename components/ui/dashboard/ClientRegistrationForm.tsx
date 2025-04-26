"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Save, UserPlus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ToastAction } from "@/components/ui/toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  idNumber: z.string().optional(),

  // Contact Information
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" }),
  alternativeContact: z.string().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),

  // Additional Information
  occupation: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed", "other"], {
    required_error: "Marital status is required",
  }),
  emergencyContactName: z
    .string()
    .min(2, {
      message: "Emergency contact name must be at least 2 characters",
    }),
  emergencyContactNumber: z
    .string()
    .min(10, {
      message: "Emergency contact number must be at least 10 digits",
    }),
  emergencyContactRelation: z
    .string()
    .min(2, { message: "Relation must be at least 2 characters" }),

  // Medical Information
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),

  // Consent
  consentToContact: z.boolean().refine((value) => value === true, {
    message: "You must consent to be contacted",
  }),
  consentToShareData: z.boolean().refine((value) => value === true, {
    message: "You must consent to data sharing for treatment purposes",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ClientRegistrationForm() {
  const [step, setStep] = useState<
    "personal" | "contact" | "additional" | "medical" | "consent"
  >("personal");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      contactNumber: "",
      alternativeContact: "",
      email: "",
      address: "",
      occupation: "",
      maritalStatus: undefined,
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
      allergies: "",
      chronicConditions: "",
      currentMedications: "",
      consentToContact: false,
      consentToShareData: false,
    },
  });

  async function onSubmit(data: FormValues) {
    const response = await fetch("/api/register-client", {
      method: "POST",
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to register client:", error);
      return;
    }
  
    const result = await response.json();
    console.log(result.message);
    toast.success("Client registered successfully!");
  }
  
  const nextStep = () => {
    if (step === "personal") {
      const personalFields = ["firstName", "lastName", "dateOfBirth", "gender"];
      const isValid = personalFields.every((field) => {
        const result = form.trigger(field as any);
        return result;
      });

      if (isValid) {
        setStep("contact");
      }
    } else if (step === "contact") {
      const contactFields = ["contactNumber", "address"];
      const isValid = contactFields.every((field) => {
        const result = form.trigger(field as any);
        return result;
      });

      if (isValid) {
        setStep("additional");
      }
    } else if (step === "additional") {
      const additionalFields = [
        "maritalStatus",
        "emergencyContactName",
        "emergencyContactNumber",
        "emergencyContactRelation",
      ];
      const isValid = additionalFields.every((field) => {
        const result = form.trigger(field as any);
        return result;
      });

      if (isValid) {
        setStep("medical");
      }
    } else if (step === "medical") {
      setStep("consent");
    }
  };

  const prevStep = () => {
    if (step === "contact") {
      setStep("personal");
    } else if (step === "additional") {
      setStep("contact");
    } else if (step === "medical") {
      setStep("additional");
    } else if (step === "consent") {
      setStep("medical");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-green-600" />
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            Register New Client
          </CardTitle>
        </div>
        <CardDescription>
          Add a new client to the health information system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div
              className={`text-sm font-medium ${step === "personal" ? "text-green-600" : "text-muted-foreground"}`}
            >
              Personal
            </div>
            <div
              className={`text-sm font-medium ${step === "contact" ? "text-green-600" : "text-muted-foreground"}`}
            >
              Contact
            </div>
            <div
              className={`text-sm font-medium ${step === "additional" ? "text-green-600" : "text-muted-foreground"}`}
            >
              Additional
            </div>
            <div
              className={`text-sm font-medium ${step === "medical" ? "text-green-600" : "text-muted-foreground"}`}
            >
              Medical
            </div>
            <div
              className={`text-sm font-medium ${step === "consent" ? "text-green-600" : "text-muted-foreground"}`}
            >
              Consent
            </div>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{
                width:
                  step === "personal"
                    ? "20%"
                    : step === "contact"
                      ? "40%"
                      : step === "additional"
                        ? "60%"
                        : step === "medical"
                          ? "80%"
                          : "100%",
              }}
            ></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            {step === "personal" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Personal Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              maxDate={new Date()}
                              className="border rounded-md p-2 w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Other
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="National ID, passport, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Any official identification number if available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {step === "contact" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Contact Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alternativeContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternative Contact (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Alternative phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residential Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter full address"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {step === "additional" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Additional Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter occupation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <h4 className="font-medium mb-4">Emergency Contact</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Emergency contact name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Emergency contact number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship to Client</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Spouse, Parent, Child, Friend"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Medical Information */}
            {step === "medical" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Medical Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Known Allergies (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any known allergies or write 'None'"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="chronicConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chronic Conditions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any chronic conditions or write 'None'"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="currentMedications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medications (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any current medications or write 'None'"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Consent */}
            {step === "consent" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Consent</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="consentToContact"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Consent to Contact</FormLabel>
                            <FormDescription>
                              I consent to be contacted by health workers
                              regarding my health and treatment.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consentToShareData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Consent to Share Data</FormLabel>
                            <FormDescription>
                              I consent to my health information being shared
                              with healthcare providers for treatment purposes.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" /> Register Client
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Health Information System
        </p>
        <p className="text-sm text-muted-foreground">
          Client Registration Module
        </p>
      </CardFooter>
    </Card>
  );
}
