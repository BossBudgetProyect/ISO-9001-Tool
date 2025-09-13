"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock } from "lucide-react"

const isoStandards = [
  {
    value: "9001",
    title: "ISO 9001:2015",
    description: "Sistema de Gestión de Calidad",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    value: "27001",
    title: "ISO 27001:2022",
    description: "Sistema de Gestión de Seguridad de la Información",
    icon: Lock,
    color: "text-green-600",
  },
]

export function ISOSelector() {
  const [selectedISO, setSelectedISO] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    if (selectedISO) {
      router.push(`/company-form/${selectedISO}`)
    }
  }

  const selectedStandard = isoStandards.find((iso) => iso.value === selectedISO)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Seleccionar Norma ISO</CardTitle>
        <CardDescription className="text-center">
          Elige la norma ISO que deseas auditar en tu organización
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Norma ISO</label>
          <Select value={selectedISO} onValueChange={setSelectedISO}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una norma ISO" />
            </SelectTrigger>
            <SelectContent>
              {isoStandards.map((iso) => {
                const Icon = iso.icon
                return (
                  <SelectItem key={iso.value} value={iso.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${iso.color}`} />
                      <div>
                        <div className="font-medium">{iso.title}</div>
                        <div className="text-xs text-muted-foreground">{iso.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedStandard && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <selectedStandard.icon className={`h-6 w-6 ${selectedStandard.color} mt-1`} />
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedStandard.title}</h3>
                  <p className="text-sm text-blue-700 mt-1">{selectedStandard.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleContinue} disabled={!selectedISO} className="w-full" size="lg">
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
