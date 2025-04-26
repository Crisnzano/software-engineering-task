"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  diseaseType: z.enum(["tb", "malaria", "hiv"], {
    required_error: "Please select a disease type",
  }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  goal: z.string().min(5, { message: "Goal must be at least 5 characters" }),
  targetAudience: z.string().min(3, { message: "Target audience must be at least 3 characters" }),
  activities: z.array(z.string()).min(1, { message: "At least one activity is required" }).max(3),
  partners: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function HealthProgramCreator() {
  const [activities, setActivities] = useState<string[]>([""])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      diseaseType: undefined,
      description: "",
      goal: "",
      targetAudience: "",
      activities: [""],
      partners: "",
    },
  })

  async function onSubmit(data: FormValues) {
    const response = await fetch("/api/health-program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      alert("Health program created successfully!");
      form.reset();
      setActivities([""]);
    } else {
      const result = await response.json();
      alert(result.message || "There was an error creating the health program.");
    }
  }
  

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...activities]
    newActivities[index] = value
    setActivities(newActivities)
    form.setValue(
      "activities",
      newActivities.filter((activity) => activity.trim() !== ""),
    )
  }

  const addActivity = () => {
    if (activities.length < 3) {
      setActivities([...activities, ""])
    }
  }

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      const newActivities = activities.filter((_, i) => i !== index)
      setActivities(newActivities)
      form.setValue(
        "activities",
        newActivities.filter((activity) => activity.trim() !== ""),
      )
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">Create Health Program</CardTitle>
        <CardDescription>Create a new health program for TB, malaria, or HIV</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diseaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disease Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select disease type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tb">Tuberculosis (TB)</SelectItem>
                      <SelectItem value="malaria">Malaria</SelectItem>
                      <SelectItem value="hiv">HIV/AIDS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the program" className="resize-none h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is the main goal of this program?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Reduce TB transmission by 20% in 2 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is this for?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Youth, Pregnant Women" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activities"
              render={() => (
                <FormItem>
                  <FormLabel>List up to 3 main activities</FormLabel>
                  <FormDescription>What will you do in this program?</FormDescription>
                  <div className="space-y-2">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder={`Activity ${index + 1}`}
                            value={activity}
                            onChange={(e) => handleActivityChange(index, e.target.value)}
                          />
                        </FormControl>
                        {activities.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeActivity(index)}
                            className="h-8 w-8 shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {activities.length < 3 && (
                    <Button type="button" variant="outline" size="sm" onClick={addActivity} className="mt-2">
                      <Plus className="mr-1 h-4 w-4" /> Add Activity
                    </Button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partners"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Organizations (if any)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ministry of Health, Local Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Submit Program
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-center">
        <p className="text-sm text-muted-foreground">Health Information System</p>
      </CardFooter>
    </Card>
  )
}
