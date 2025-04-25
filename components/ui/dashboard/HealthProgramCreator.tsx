"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  CalendarIcon,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Goal,
  MapPin,
  Plus,
  Save,
  Target,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  // Basic Information
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  diseaseType: z.enum(["malaria", "tb", "hiv"], {
    required_error: "Please select a disease type",
  }),
  background: z.string().min(20, { message: "Background must be at least 20 characters" }),

  // Goals and Objectives
  goal: z.string().min(10, { message: "Goal must be at least 10 characters" }),
  objectives: z.array(z.string()).min(1, { message: "At least one objective is required" }),

  // Target Population
  targetGroup: z.string().min(5, { message: "Target group must be at least 5 characters" }),
  targetLocation: z.string().min(3, { message: "Target location must be at least 3 characters" }),
  estimatedReach: z.string().min(1, { message: "Estimated reach is required" }),

  // Strategy and Activities
  strategy: z.string().min(10, { message: "Strategy must be at least 10 characters" }),
  activities: z
    .array(
      z.object({
        name: z.string().min(3, { message: "Activity name is required" }),
        description: z.string().min(10, { message: "Activity description must be at least 10 characters" }),
      }),
    )
    .min(1, { message: "At least one activity is required" }),

  // Resources
  personnel: z.array(z.string()).min(1, { message: "At least one personnel type is required" }),
  equipment: z.array(z.string()).min(1, { message: "At least one equipment item is required" }),
  estimatedBudget: z.string().min(1, { message: "Estimated budget is required" }),

  // Partners
  partners: z.array(z.string()).min(1, { message: "At least one partner is required" }),

  // Timeline
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),

  // Monitoring and Evaluation
  indicators: z.array(z.string()).min(1, { message: "At least one indicator is required" }),
  evaluationMethod: z.string().min(10, { message: "Evaluation method must be at least 10 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export default function HealthProgramCreator() {
  const [activeTab, setActiveTab] = useState("basic")
  const [objectives, setObjectives] = useState<string[]>([])
  const [newObjective, setNewObjective] = useState("")
  const [activities, setActivities] = useState<{ name: string; description: string }[]>([])
  const [newActivity, setNewActivity] = useState({ name: "", description: "" })
  const [personnel, setPersonnel] = useState<string[]>([])
  const [newPersonnel, setNewPersonnel] = useState("")
  const [equipment, setEquipment] = useState<string[]>([])
  const [newEquipment, setNewEquipment] = useState("")
  const [partners, setPartners] = useState<string[]>([])
  const [newPartner, setNewPartner] = useState("")
  const [indicators, setIndicators] = useState<string[]>([])
  const [newIndicator, setNewIndicator] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      diseaseType: undefined,
      background: "",
      goal: "",
      objectives: [],
      targetGroup: "",
      targetLocation: "",
      estimatedReach: "",
      strategy: "",
      activities: [],
      personnel: [],
      equipment: [],
      estimatedBudget: "",
      partners: [],
      indicators: [],
      evaluationMethod: "",
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
    // Here you would typically save the program to your backend
    alert("Health program created successfully!")
  }

  const addObjective = () => {
    if (newObjective.trim() !== "") {
      const updatedObjectives = [...objectives, newObjective]
      setObjectives(updatedObjectives)
      form.setValue("objectives", updatedObjectives)
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index)
    setObjectives(updatedObjectives)
    form.setValue("objectives", updatedObjectives)
  }

  const addActivity = () => {
    if (newActivity.name.trim() !== "" && newActivity.description.trim() !== "") {
      const updatedActivities = [...activities, newActivity]
      setActivities(updatedActivities)
      form.setValue("activities", updatedActivities)
      setNewActivity({ name: "", description: "" })
    }
  }

  const removeActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index)
    setActivities(updatedActivities)
    form.setValue("activities", updatedActivities)
  }

  const addPersonnel = () => {
    if (newPersonnel.trim() !== "") {
      const updatedPersonnel = [...personnel, newPersonnel]
      setPersonnel(updatedPersonnel)
      form.setValue("personnel", updatedPersonnel)
      setNewPersonnel("")
    }
  }

  const removePersonnel = (index: number) => {
    const updatedPersonnel = personnel.filter((_, i) => i !== index)
    setPersonnel(updatedPersonnel)
    form.setValue("personnel", updatedPersonnel)
  }

  const addEquipment = () => {
    if (newEquipment.trim() !== "") {
      const updatedEquipment = [...equipment, newEquipment]
      setEquipment(updatedEquipment)
      form.setValue("equipment", updatedEquipment)
      setNewEquipment("")
    }
  }

  const removeEquipment = (index: number) => {
    const updatedEquipment = equipment.filter((_, i) => i !== index)
    setEquipment(updatedEquipment)
    form.setValue("equipment", updatedEquipment)
  }

  const addPartner = () => {
    if (newPartner.trim() !== "") {
      const updatedPartners = [...partners, newPartner]
      setPartners(updatedPartners)
      form.setValue("partners", updatedPartners)
      setNewPartner("")
    }
  }

  const removePartner = (index: number) => {
    const updatedPartners = partners.filter((_, i) => i !== index)
    setPartners(updatedPartners)
    form.setValue("partners", updatedPartners)
  }

  const addIndicator = () => {
    if (newIndicator.trim() !== "") {
      const updatedIndicators = [...indicators, newIndicator]
      setIndicators(updatedIndicators)
      form.setValue("indicators", updatedIndicators)
      setNewIndicator("")
    }
  }

  const removeIndicator = (index: number) => {
    const updatedIndicators = indicators.filter((_, i) => i !== index)
    setIndicators(updatedIndicators)
    form.setValue("indicators", updatedIndicators)
  }

  const nextTab = () => {
    const tabs = ["basic", "goals", "target", "strategy", "resources", "partners", "timeline", "evaluation", "review"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const previousTab = () => {
    const tabs = ["basic", "goals", "target", "strategy", "resources", "partners", "timeline", "evaluation", "review"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300">Create Health Program</CardTitle>
        <CardDescription>Create a comprehensive health program for malaria, tuberculosis, or HIV</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-9 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="target">Target</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Basic Information</h3>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Malaria-Free Zones: A Community Prevention Initiative" {...field} />
                      </FormControl>
                      <FormDescription>Create a clear, descriptive title for your health program</FormDescription>
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
                          <SelectItem value="malaria">Malaria</SelectItem>
                          <SelectItem value="tb">Tuberculosis (TB)</SelectItem>
                          <SelectItem value="hiv">HIV/AIDS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the primary disease focus for this program</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background & Justification</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the current situation, include statistics if available, and explain why this program is important..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide context and justification for the program, linking to national or international health
                        goals if applicable
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Goals and Objectives */}
              <TabsContent value="goals" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Goal className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Goals and Objectives</h3>
                </div>

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Reduce TB transmission by 20% in 2 years" {...field} />
                      </FormControl>
                      <FormDescription>Define the broad aim of your program</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectives"
                  render={() => (
                    <FormItem>
                      <FormLabel>Specific Objectives</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., Increase TB testing by 50% in urban clinics within 1 year"
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={addObjective} className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>Add specific, measurable objectives that support your goal</FormDescription>
                      <FormMessage />

                      <div className="mt-3 space-y-2">
                        {objectives.map((objective, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span>{objective}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeObjective(index)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Target Population */}
              <TabsContent value="target" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Target Population</h3>
                </div>

                <FormField
                  control={form.control}
                  name="targetGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Group</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pregnant women and children under 5" {...field} />
                      </FormControl>
                      <FormDescription>Specify the demographic group(s) your program will focus on</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rural communities in Northern Province" {...field} />
                      </FormControl>
                      <FormDescription>Specify the geographic area(s) your program will cover</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedReach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Reach</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5,000 individuals" {...field} />
                      </FormControl>
                      <FormDescription>Estimate how many people your program will reach</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Strategy and Activities */}
              <TabsContent value="strategy" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Strategy and Activities</h3>
                </div>

                <FormField
                  control={form.control}
                  name="strategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Strategy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A three-pronged approach focusing on awareness, testing, and treatment..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Describe your overall approach to achieving the program goals</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activities"
                  render={() => (
                    <FormItem>
                      <FormLabel>Program Activities</FormLabel>
                      <div className="space-y-3">
                        <div>
                          <FormLabel className="text-sm">Activity Name</FormLabel>
                          <Input
                            placeholder="e.g., Community Testing Days"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <FormLabel className="text-sm">Activity Description</FormLabel>
                          <Textarea
                            placeholder="e.g., Monthly testing events in community centers with trained health workers..."
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={addActivity} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Add Activity
                        </Button>
                      </div>
                      <FormDescription className="mt-2">
                        List the specific activities that will be implemented as part of your program
                      </FormDescription>
                      <FormMessage />

                      <div className="mt-4 space-y-3">
                        {activities.map((activity, index) => (
                          <div key={index} className="p-3 bg-muted rounded-md">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{activity.name}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(index)}
                                className="h-8 w-8 p-0"
                              >
                                &times;
                              </Button>
                            </div>
                            <p className="text-sm mt-1">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Resources Needed</h3>
                </div>

                <FormField
                  control={form.control}
                  name="personnel"
                  render={() => (
                    <FormItem>
                      <FormLabel>Personnel</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., Community Health Workers (5)"
                            value={newPersonnel}
                            onChange={(e) => setNewPersonnel(e.target.value)}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={addPersonnel} className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>List the types and numbers of personnel needed for the program</FormDescription>
                      <FormMessage />

                      <div className="mt-3 space-y-2">
                        {personnel.map((person, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span>{person}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePersonnel(index)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipment"
                  render={() => (
                    <FormItem>
                      <FormLabel>Equipment & Supplies</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., Rapid Test Kits (500)"
                            value={newEquipment}
                            onChange={(e) => setNewEquipment(e.target.value)}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={addEquipment} className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>List the equipment and supplies needed for the program</FormDescription>
                      <FormMessage />

                      <div className="mt-3 space-y-2">
                        {equipment.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span>{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEquipment(index)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $25,000" {...field} />
                      </FormControl>
                      <FormDescription>Provide an estimated total budget for the program</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Partners */}
              <TabsContent value="partners" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Partners & Stakeholders</h3>
                </div>

                <FormField
                  control={form.control}
                  name="partners"
                  render={() => (
                    <FormItem>
                      <FormLabel>Partners & Stakeholders</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., Ministry of Health, Local Hospital"
                            value={newPartner}
                            onChange={(e) => setNewPartner(e.target.value)}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={addPartner} className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        List organizations, institutions, or groups that will partner in this program
                      </FormDescription>
                      <FormMessage />

                      <div className="mt-3 space-y-2">
                        {partners.map((partner, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span>{partner}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePartner(index)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Timeline */}
              <TabsContent value="timeline" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Timeline</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
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
                                {field.value ? format(field.value, "PPP") : <span>Select start date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When will the program begin?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
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
                                {field.value ? format(field.value, "PPP") : <span>Select end date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When will the program end?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Monitoring and Evaluation */}
              <TabsContent value="evaluation" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Monitoring & Evaluation</h3>
                </div>

                <FormField
                  control={form.control}
                  name="indicators"
                  render={() => (
                    <FormItem>
                      <FormLabel>Key Performance Indicators</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., Number of people tested monthly"
                            value={newIndicator}
                            onChange={(e) => setNewIndicator(e.target.value)}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={addIndicator} className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>List measurable indicators that will be used to track progress</FormDescription>
                      <FormMessage />

                      <div className="mt-3 space-y-2">
                        {indicators.map((indicator, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span>{indicator}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIndicator(index)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evaluationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evaluation Method</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Monthly data collection through clinic reports, quarterly surveys of target population..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Describe how you will evaluate the success of the program</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextTab} className="bg-green-600 hover:bg-green-700">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Review */}
              <TabsContent value="review" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Review Program</h3>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Title:</span> {form.watch("title") || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Disease Type:</span>{" "}
                        {form.watch("diseaseType") ? form.watch("diseaseType").toUpperCase() : "Not specified"}
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium">Background:</span>
                        <p className="text-sm">{form.watch("background") || "Not specified"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Goals & Objectives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Goal:</span> {form.watch("goal") || "Not specified"}
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium">Objectives:</span>
                        {objectives.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm">
                            {objectives.map((objective, index) => (
                              <li key={index}>{objective}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">No objectives specified</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Target Population</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Target Group:</span>{" "}
                        {form.watch("targetGroup") || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {form.watch("targetLocation") || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Estimated Reach:</span>{" "}
                        {form.watch("estimatedReach") || "Not specified"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Strategy & Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <span className="font-medium">Strategy:</span>
                        <p className="text-sm">{form.watch("strategy") || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium">Duration:</span>
                        <p className="text-sm">
                          {form.watch("startDate") && form.watch("endDate")
                            ? `${format(form.watch("startDate"), "PPP")} to ${format(form.watch("endDate"), "PPP")}`
                            : "Dates not specified"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={previousTab}>
                    Previous
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" /> Save Program
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <div className="text-sm text-muted-foreground">
          <MapPin className="inline-block h-4 w-4 mr-1" /> Health Information System
        </div>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
        >
          Program Creator
        </Badge>
      </CardFooter>
    </Card>
  );
}
