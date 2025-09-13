"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, FileText, CheckCircle, XCircle, MinusCircle, BookOpen } from "lucide-react"
import { iso9001Requirements } from "@/lib/iso-requirements/iso-9001"
import { iso27001Requirements } from "@/lib/iso-requirements/iso-27001"

interface AuditChecklistProps {
  isoStandard: string
}

type ComplianceStatus = "cumple" | "no_cumple" | "na" | ""

interface RequirementStatus {
  status: ComplianceStatus
  observations: string
}

const isoInfo = {
  "9001": {
    title: "ISO 9001:2015",
    description: "Sistema de Gestión de Calidad",
    requirements: iso9001Requirements,
  },
  "27001": {
    title: "ISO 27001:2022",
    description: "Sistema de Gestión de Seguridad de la Información",
    requirements: iso27001Requirements,
  },
}

const statusOptions = [
  { value: "cumple", label: "Cumple", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  { value: "no_cumple", label: "No Cumple", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
  { value: "na", label: "N/A", icon: MinusCircle, color: "text-gray-600", bgColor: "bg-gray-100" },
]

export function AuditChecklist({ isoStandard }: AuditChecklistProps) {
  const router = useRouter()
  const [companyData, setCompanyData] = useState<any>(null)
  const [auditData, setAuditData] = useState<Record<string, RequirementStatus>>({})
  const [isLoading, setIsLoading] = useState(false)

  const currentISO = isoInfo[isoStandard as keyof typeof isoInfo]

  useEffect(() => {
    // Load company data
    const savedCompanyData = localStorage.getItem(`companyData_${isoStandard}`)
    if (savedCompanyData) {
      setCompanyData(JSON.parse(savedCompanyData))
    }

    // Load existing audit data
    const savedAuditData = localStorage.getItem(`auditData_${isoStandard}`)
    if (savedAuditData) {
      setAuditData(JSON.parse(savedAuditData))
    }
  }, [isoStandard])

  const updateRequirementStatus = (requirementId: string, field: keyof RequirementStatus, value: string) => {
    setAuditData((prev) => ({
      ...prev,
      [requirementId]: {
        ...prev[requirementId],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem(`auditData_${isoStandard}`, JSON.stringify(auditData))
      setIsLoading(false)
      alert("Progreso de auditoría guardado correctamente")
    }, 1000)
  }

  const handleBack = () => {
    router.push(`/company-form/${isoStandard}`)
  }

  const handleTraining = (requirementId: string) => {
    router.push(`/training/${isoStandard}/${requirementId}`)
  }

  // Calculate progress
  const totalRequirements = currentISO?.requirements.length || 0
  const completedRequirements = Object.values(auditData).filter((item) => item.status !== "").length
  const progressPercentage = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0

  if (!currentISO) {
    return <div>Norma ISO no encontrada</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentISO.title} - Auditoría</CardTitle>
              <CardDescription>{currentISO.description}</CardDescription>
              {companyData && (
                <div className="mt-2">
                  <Badge variant="outline">{companyData.razonSocial}</Badge>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progreso</div>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Requirements Checklist */}
      <div className="space-y-4">
        {currentISO.requirements.map((requirement, index) => {
          const currentStatus = auditData[requirement.id] || { status: "", observations: "" }
          const selectedOption = statusOptions.find((option) => option.value === currentStatus.status)

          return (
            <Card key={requirement.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{requirement.section}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTraining(requirement.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Capacitación
                      </Button>
                    </div>
                    <CardTitle
                      className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleTraining(requirement.id)}
                    >
                      {requirement.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{requirement.description}</CardDescription>
                  </div>

                  {selectedOption && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${selectedOption.bgColor}`}>
                      <selectedOption.icon className={`h-4 w-4 ${selectedOption.color}`} />
                      <span className={`text-sm font-medium ${selectedOption.color}`}>{selectedOption.label}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Estado de Cumplimiento</label>
                  <div className="flex gap-2">
                    {statusOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = currentStatus.status === option.value

                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateRequirementStatus(requirement.id, "status", option.value)}
                          className={isSelected ? `${option.color} bg-opacity-10` : ""}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Observaciones</label>
                  <Textarea
                    value={currentStatus.observations}
                    onChange={(e) => updateRequirementStatus(requirement.id, "observations", e.target.value)}
                    placeholder="Escribe tus observaciones sobre este requisito..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>

            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Progreso
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Haz clic en el título de cualquier requisito para acceder a la capacitación y recursos de apoyo.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
