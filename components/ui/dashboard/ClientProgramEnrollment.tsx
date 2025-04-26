"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Info,
  Save,
  UserPlus,
} from "lucide-react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ToastAction } from "@/components/ui/toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Sample health programs data
const healthPrograms = [
  {
    id: "1",
    title: "TB Prevention and Treatment",
    diseaseType: "tb",
    description: "Comprehensive TB prevention, testing, and treatment program",
  },
  {
    id: "2",
    title: "Malaria-Free Communities",
    diseaseType: "malaria",
    description: "Malaria prevention and treatment for high-risk communities",
  },
  {
    id: "3",
    title: "HIV Testing and Counseling",
    diseaseType: "hiv",
    description: "Confidential HIV testing, counseling, and treatment support",
  },
  {
    id: "4",
    title: "Maternal TB Screening",
    diseaseType: "tb",
    description: "TB screening and prevention for pregnant women",
  },
  {
    id: "5",
    title: "Youth HIV Awareness",
    diseaseType: "hiv",
    description: "HIV education and prevention program for youth",
  },
];

// Update Schema to use Range
const formSchema = z.object({
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
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .optional(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .optional(),
  programs: z
    .array(z.string())
    .min(1, { message: "Select at least one program" }),
  enrollmentDate: z
    .tuple([
      z.date({ required_error: "Start date is required" }),
      z.date({ required_error: "End date is required" }),
    ])
    .refine(([start, end]) => start && end && start <= end, {
      message: "Start date must be before end date",
    }),
  referralSource: z.string().optional(),
  notes: z.string().optional(),
  consentGiven: z.boolean().refine((value) => value === true, {
    message: "You must obtain client consent",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ClientProgramEnrollment() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      contactNumber: "",
      address: "",
      programs: [],
      referralSource: "",
      notes: "",
      consentGiven: false,
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast(
      <div>
        <strong>Client enrolled successfully</strong>
        <div>
          {data.firstName} {data.lastName} has been enrolled in{" "}
          {data.programs.length} program(s).
        </div>
      </div>,
      { action: <ToastAction altText="View Client">View</ToastAction> }
    );
  }

  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms((current) =>
      current.includes(programId)
        ? current.filter((id) => id !== programId)
        : [...current, programId]
    );

    const updatedPrograms = selectedPrograms.includes(programId)
      ? selectedPrograms.filter((id) => id !== programId)
      : [...selectedPrograms, programId];

    form.setValue("programs", updatedPrograms);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-green-600" />
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            Client Program Enrollment
          </CardTitle>
        </div>
        <CardDescription>
          Enroll a client into one or more health programs
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact + Address */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Programs */}
            <FormField
              control={form.control}
              name="programs"
              render={() => (
                <FormItem>
                  <FormLabel>Programs</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedPrograms.length > 0
                          ? `${selectedPrograms.length} selected`
                          : "Select programs"}
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search programs..." />
                        <CommandList>
                          <CommandEmpty>No programs found.</CommandEmpty>
                          <CommandGroup>
                            {healthPrograms.map((program) => (
                              <CommandItem
                                key={program.id}
                                onSelect={() => handleProgramSelect(program.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedPrograms.includes(program.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {program.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Enrollment Date Range */}
            <FormField
              control={form.control}
              name="enrollmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Date Range</FormLabel>
                  <FormControl>
                    <DatePicker
                      selectsRange
                      startDate={field.value?.[0]}
                      endDate={field.value?.[1]}
                      onChange={(dates) => field.onChange(dates)}
                      className="border rounded-md p-2 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" /> Enroll Client
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="bg-muted/50 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Health Information System
        </p>
        <p className="text-sm text-muted-foreground">
          Client Enrollment Module
        </p>
      </CardFooter>
    </Card>
  );
}
