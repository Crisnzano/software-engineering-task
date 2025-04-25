"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Check, ChevronsUpDown, Info, Save, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { ToastAction } from "@/components/ui/toast"

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
]

const formSchema = z.object({
  // Client Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits" }).optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }).optional(),

  // Program Enrollment
  programs: z.array(z.string()).min(1, { message: "Select at least one program" }),

  // Enrollment Details
  enrollmentDate: z.date({ required_error: "Enrollment date is required" }),
  referralSource: z.string().optional(),
  notes: z.string().optional(),
  consentGiven: z.boolean().refine((value) => value === true, {
    message: "You must obtain client consent",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ClientProgramEnrollment() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [open, setOpen] = useState(false)

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
  })

  function onSubmit(data: FormValues) {
    console.log(data)
    // Here you would typically save the enrollment to your backend
    toast(
        <div>
          <strong>Client enrolled successfully</strong>
          <div>
            {data.firstName} {data.lastName} has been enrolled in {data.programs.length} program(s).
          </div>
        </div>,
        {
          action: <ToastAction altText="View Client">View</ToastAction>,
        }
      )
  }

  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms((current) => {
      if (current.includes(programId)) {
        return current.filter((id) => id !== programId)
      } else {
        return [...current, programId]
      }
    })

    const updatedPrograms = selectedPrograms.includes(programId)
      ? selectedPrograms.filter((id) => id !== programId)
      : [...selectedPrograms, programId]

    form.setValue("programs", updatedPrograms)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-green-600" />
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            Client Program Enrollment
          </CardTitle>
        </div>
        <CardDescription>Enroll a client into one or more health programs</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Client Information</h3>
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

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
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

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
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
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Program Selection</h3>
              <FormField
                control={form.control}
                name="programs"
                render={() => (
                  <FormItem>
                    <FormLabel>Select Programs</FormLabel>
                    <FormDescription>Select one or more programs to enroll the client in</FormDescription>
                    <div className="mt-2">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {selectedPrograms.length > 0
                              ? `${selectedPrograms.length} program(s) selected`
                              : "Select programs..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search programs..." />
                            <CommandList>
                              <CommandEmpty>No program found.</CommandEmpty>
                              <CommandGroup>
                                {healthPrograms.map((program) => (
                                  <CommandItem
                                    key={program.id}
                                    value={program.title}
                                    onSelect={() => handleProgramSelect(program.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedPrograms.includes(program.id) ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>{program.title}</span>
                                      <span className="text-xs text-muted-foreground">{program.description}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedPrograms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPrograms.map((programId) => {
                    const program = healthPrograms.find((p) => p.id === programId)
                    if (!program) return null

                    return (
                      <Badge
                        key={program.id}
                        variant="outline"
                        className={cn(
                          "px-3 py-1",
                          program.diseaseType === "tb" &&
                            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
                          program.diseaseType === "malaria" &&
                            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
                          program.diseaseType === "hiv" &&
                            "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
                        )}
                      >
                        {program.title}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Enrollment Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="enrollmentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Enrollment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referralSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral Source</FormLabel>
                      <FormControl>
                        <Input placeholder="How was the client referred?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about this enrollment"
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentGiven"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4 p-4 border rounded-md bg-muted/30">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        <Info className="h-4 w-4 mr-1 text-amber-500" />
                        Client consent obtained
                      </FormLabel>
                      <FormDescription>
                        I confirm that the client has provided consent to be enrolled in the selected program(s)
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Enroll Client
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <p className="text-sm text-muted-foreground">Health Information System</p>
        <p className="text-sm text-muted-foreground">Client Enrollment Module</p>
      </CardFooter>
    </Card>
  )
}
