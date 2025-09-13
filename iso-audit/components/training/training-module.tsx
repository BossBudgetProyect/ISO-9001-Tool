"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, Target, Users, Lightbulb, Eye } from "lucide-react"
import { iso9001Requirements } from "@/lib/iso-requirements/iso-9001"
import { iso27001Requirements } from "@/lib/iso-requirements/iso-27001"
import { trainingContent } from "@/lib/training-content"

interface TrainingModuleProps {
  isoStandard: string
  requirementId: string
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

export function TrainingModule({ isoStandard, requirementId }: TrainingModuleProps) {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)

  const currentISO = isoInfo[isoStandard as keyof typeof isoInfo]
  const requirement = currentISO?.requirements.find((req) => req.id === requirementId)
  const training = trainingContent[requirementId as keyof typeof trainingContent]

  const handleBack = () => {
    router.push(`/audit/${isoStandard}`)
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simulate Excel file generation and download
    setTimeout(() => {
      // Create a simple CSV content as Excel substitute
      const csvContent = generateExcelContent(requirement, training)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `${requirement?.section}_${requirement?.title.replace(/\s+/g, "_")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsDownloading(false)
    }, 1500)
  }

  const generateExcelContent = (req: any, training: any) => {
    if (!req || !training) return ""

    return `Sección,${req.section}
Título,"${req.title}"
Descripción,"${req.description}"

CONTENIDO DE CAPACITACIÓN

Objetivo,"${training.objective}"

Conceptos Clave:
${training.keyConcepts.map((concept: string, index: number) => `${index + 1},"${concept}"`).join("\n")}

Pasos de Implementación:
${training.implementationSteps.map((step: string, index: number) => `${index + 1},"${step}"`).join("\n")}

Mejores Prácticas:
${training.bestPractices.map((practice: string, index: number) => `${index + 1},"${practice}"`).join("\n")}

Documentos Requeridos:
${training.requiredDocuments.map((doc: string, index: number) => `${index + 1},"${doc}"`).join("\n")}

Indicadores de Cumplimiento:
${training.complianceIndicators.map((indicator: string, index: number) => `${index + 1},"${indicator}"`).join("\n")}
`
  }

  const generateExcelTableData = (req: any, training: any) => {
    if (!req || !training) return []

    const tableData = [
      { categoria: "Información General", campo: "Sección", valor: req.section },
      { categoria: "Información General", campo: "Título", valor: req.title },
      { categoria: "Información General", campo: "Descripción", valor: req.description },
      { categoria: "Capacitación", campo: "Objetivo", valor: training.objective },
    ]

    // Agregar conceptos clave
    training.keyConcepts.forEach((concept: string, index: number) => {
      tableData.push({
        categoria: "Conceptos Clave",
        campo: `Concepto ${index + 1}`,
        valor: concept,
      })
    })

    // Agregar pasos de implementación
    training.implementationSteps.forEach((step: string, index: number) => {
      tableData.push({
        categoria: "Implementación",
        campo: `Paso ${index + 1}`,
        valor: step,
      })
    })

    // Agregar mejores prácticas
    training.bestPractices.forEach((practice: string, index: number) => {
      tableData.push({
        categoria: "Mejores Prácticas",
        campo: `Práctica ${index + 1}`,
        valor: practice,
      })
    })

    // Agregar documentos requeridos
    training.requiredDocuments.forEach((doc: string, index: number) => {
      tableData.push({
        categoria: "Documentos",
        campo: `Documento ${index + 1}`,
        valor: doc,
      })
    })

    // Agregar indicadores de cumplimiento
    training.complianceIndicators.forEach((indicator: string, index: number) => {
      tableData.push({
        categoria: "Indicadores",
        campo: `Indicador ${index + 1}`,
        valor: indicator,
      })
    })

    return tableData
  }

  if (!requirement || !training) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <AlertDescription>Contenido de capacitación no encontrado para este requisito.</AlertDescription>
            </Alert>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const excelTableData = generateExcelTableData(requirement, training)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{requirement.section}</Badge>
                <Badge variant="outline">{currentISO?.title}</Badge>
              </div>
              <CardTitle className="text-2xl">{requirement.title}</CardTitle>
              <CardDescription className="mt-2">{requirement.description}</CardDescription>
            </div>
            <Button onClick={handleDownload} disabled={isDownloading} className="shrink-0">
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generando...
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Excel
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Training Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="implementation">Implementación</TabsTrigger>
          <TabsTrigger value="practices">Mejores Prácticas</TabsTrigger>
          <TabsTrigger value="documents">Documentación</TabsTrigger>
          <TabsTrigger value="excel-preview">Vista Excel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Objetivo del Requisito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{training.objective}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Conceptos Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {training.keyConcepts.map((concept: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Pasos de Implementación
              </CardTitle>
              <CardDescription>
                Sigue estos pasos para implementar correctamente este requisito en tu organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {training.implementationSteps.map((step: string, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Cumplimiento</CardTitle>
              <CardDescription>
                Utiliza estos indicadores para evaluar si el requisito se está cumpliendo adecuadamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {training.complianceIndicators.map((indicator: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-sm">{indicator}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mejores Prácticas</CardTitle>
              <CardDescription>Recomendaciones basadas en experiencias exitosas de implementación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {training.bestPractices.map((practice: string, index: number) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-green-800">{practice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                Documentos Requeridos
              </CardTitle>
              <CardDescription>
                Lista de documentos que debes crear o mantener para cumplir con este requisito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {training.requiredDocuments.map((document: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-orange-600 shrink-0" />
                    <span className="text-orange-800">{document}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Puedes descargar una plantilla en Excel con toda esta información haciendo clic en el botón "Descargar
              Excel" en la parte superior.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="excel-preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Vista Previa del Excel
              </CardTitle>
              <CardDescription>Visualiza el contenido que se incluirá en el archivo Excel descargable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Categoría</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Campo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {excelTableData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">{row.categoria}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-r">{row.campo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{row.valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">Información sobre el Excel</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Esta tabla muestra exactamente el contenido que se incluirá en el archivo Excel. El archivo
                      descargado contendrá toda esta información estructurada para facilitar su uso en tu organización.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar a Auditoría
            </Button>

            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generando Excel...
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla Excel
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
