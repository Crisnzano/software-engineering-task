import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Clock, Goal, MapPin, Target, Users } from "lucide-react"

interface HealthProgramProps {
  program: {
    title: string
    diseaseType: "malaria" | "tb" | "hiv"
    background: string
    goal: string
    objectives: string[]
    targetGroup: string
    targetLocation: string
    estimatedReach: string
    strategy: string
    activities: { name: string; description: string }[]
    personnel: string[]
    equipment: string[]
    estimatedBudget: string
    partners: string[]
    startDate: Date
    endDate: Date
    indicators: string[]
    evaluationMethod: string
  }
}

export default function HealthProgramPreview({ program }: HealthProgramProps) {
  const getDiseaseColor = (type: string) => {
    switch (type) {
      case "malaria":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300"
      case "tb":
        return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300"
      case "hiv":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300"
    }
  }

  const diseaseColor = getDiseaseColor(program.diseaseType)

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300">{program.title}</CardTitle>
            <CardDescription className="mt-1">
              {program.startDate && program.endDate && (
                <span className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  {format(program.startDate, "PPP")} - {format(program.endDate, "PPP")}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge className={diseaseColor}>
            {program.diseaseType === "tb" ? "Tuberculosis" : program.diseaseType === "hiv" ? "HIV/AIDS" : "Malaria"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Background</h3>
          <p className="text-muted-foreground">{program.background}</p>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Goal className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Goal</h3>
            </div>
            <p>{program.goal}</p>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Objectives</h4>
              <ul className="list-disc pl-5 space-y-1">
                {program.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Target</h3>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Group:</span> {program.targetGroup}
              </div>
              <div>
                <span className="font-medium">Location:</span> {program.targetLocation}
              </div>
              <div>
                <span className="font-medium">Estimated Reach:</span> {program.estimatedReach}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-3">Strategy</h3>
          <p className="mb-4">{program.strategy}</p>

          <h4 className="font-medium mb-2">Key Activities</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {program.activities.map((activity, index) => (
              <Card key={index} className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Resources</h3>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Personnel</h4>
                <ul className="list-disc pl-5">
                  {program.personnel.map((person, index) => (
                    <li key={index}>{person}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Equipment & Supplies</h4>
                <ul className="list-disc pl-5">
                  {program.equipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Budget</h4>
                <p>{program.estimatedBudget}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Partners</h3>
            </div>

            <ul className="list-disc pl-5">
              {program.partners.map((partner, index) => (
                <li key={index}>{partner}</li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Monitoring & Evaluation</h3>
              <div>
                <h4 className="font-medium mb-1">Key Indicators</h4>
                <ul className="list-disc pl-5">
                  {program.indicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-medium mb-1">Evaluation Method</h4>
                <p className="text-sm">{program.evaluationMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <div className="text-sm text-muted-foreground">
          <MapPin className="inline-block h-4 w-4 mr-1" /> {program.targetLocation}
        </div>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
        >
          Active Program
        </Badge>
      </CardFooter>
    </Card>
  )
}
