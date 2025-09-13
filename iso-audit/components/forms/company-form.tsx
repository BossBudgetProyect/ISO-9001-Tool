"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, ClipboardCheck, Building2, Shield, Lock } from "lucide-react"

interface CompanyFormProps {
  isoStandard: string
}

const isoInfo = {
  "9001": {
    title: "ISO 9001:2015",
    description: "Sistema de Gestión de Calidad",
    icon: Shield,
    color: "text-blue-600",
  },
  "27001": {
    title: "ISO 27001:2022",
    description: "Sistema de Gestión de Seguridad de la Información",
    icon: Lock,
    color: "text-green-600",
  },
}

const companyTypes = [
  "Micro empresa (1-10 empleados)",
  "Pequeña empresa (11-50 empleados)",
  "Mediana empresa (51-200 empleados)",
  "Gran empresa (200+ empleados)",
]

const economicSectors = [
  "Agricultura, ganadería, silvicultura y pesca",
  "Industrias extractivas",
  "Industria manufacturera",
  "Suministro de energía eléctrica, gas, vapor y aire acondicionado",
  "Suministro de agua, actividades de saneamiento, gestión de residuos",
  "Construcción",
  "Comercio al por mayor y al por menor",
  "Transporte y almacenamiento",
  "Hostelería",
  "Información y comunicaciones",
  "Actividades financieras y de seguros",
  "Actividades inmobiliarias",
  "Actividades profesionales, científicas y técnicas",
  "Actividades administrativas y servicios auxiliares",
  "Administración pública y defensa",
  "Educación",
  "Actividades sanitarias y de servicios sociales",
  "Actividades artísticas, recreativas y de entretenimiento",
  "Otros servicios",
  "Actividades de los hogares como empleadores",
  "Actividades de organizaciones y organismos extraterritoriales",
]

export function CompanyForm({ isoStandard }: CompanyFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    razonSocial: "",
    nit: "",
    representanteLegal: "",
    sectorEconomico: "",
    tipoEmpresa: "",
    direccion: "",
    telefono: "",
    numeroEmpleados: "",
    email: "",
    web: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const currentISO = isoInfo[isoStandard as keyof typeof isoInfo]
  const Icon = currentISO?.icon || Building2

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setError("")
    setIsLoading(true)

    const requiredFields = [
      "razonSocial",
      "nit",
      "representanteLegal",
      "sectorEconomico",
      "tipoEmpresa",
      "direccion",
      "telefono",
      "numeroEmpleados",
      "email",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      setError("Por favor completa todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    // Simulate save
    setTimeout(() => {
      localStorage.setItem(`companyData_${isoStandard}`, JSON.stringify(formData))
      setIsLoading(false)
      alert("Datos guardados correctamente")
    }, 1000)
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleAudit = async () => {
    setError("")
    setIsLoading(true)

    const requiredFields = [
      "razonSocial",
      "nit",
      "representanteLegal",
      "sectorEconomico",
      "tipoEmpresa",
      "direccion",
      "telefono",
      "numeroEmpleados",
      "email",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      setError("Por favor completa todos los campos obligatorios antes de continuar con la auditoría")
      setIsLoading(false)
      return
    }

    // Save and proceed to audit
    setTimeout(() => {
      localStorage.setItem(`companyData_${isoStandard}`, JSON.stringify(formData))
      router.push(`/audit/${isoStandard}`)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon className={`h-8 w-8 ${currentISO?.color}`} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentISO?.title}</h1>
            <p className="text-muted-foreground">{currentISO?.description}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Datos de la Empresa
          </CardTitle>
          <CardDescription>Completa la información de tu organización para proceder con la auditoría</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

              <div className="space-y-2">
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  value={formData.razonSocial}
                  onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                  placeholder="Nombre completo de la empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nit">NIT *</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) => handleInputChange("nit", e.target.value)}
                  placeholder="123456789-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representanteLegal">Representante Legal *</Label>
                <Input
                  id="representanteLegal"
                  value={formData.representanteLegal}
                  onChange={(e) => handleInputChange("representanteLegal", e.target.value)}
                  placeholder="Nombre completo del representante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectorEconomico">Sector Económico *</Label>
                <Select
                  value={formData.sectorEconomico}
                  onValueChange={(value) => handleInputChange("sectorEconomico", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el sector económico" />
                  </SelectTrigger>
                  <SelectContent>
                    {economicSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEmpresa">Tipo de Empresa *</Label>
                <Select value={formData.tipoEmpresa} onValueChange={(value) => handleInputChange("tipoEmpresa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Dirección completa de la empresa"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroEmpleados">Número de Empleados *</Label>
                <Input
                  id="numeroEmpleados"
                  type="number"
                  value={formData.numeroEmpleados}
                  onChange={(e) => handleInputChange("numeroEmpleados", e.target.value)}
                  placeholder="150"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="web">Sitio Web</Label>
                <Input
                  id="web"
                  value={formData.web}
                  onChange={(e) => handleInputChange("web", e.target.value)}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Redes Sociales (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange("facebook", e.target.value)}
                  placeholder="@empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="@empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={formData.tiktok}
                  onChange={(e) => handleInputChange("tiktok", e.target.value)}
                  placeholder="@empresa"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>

            <Button variant="secondary" onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>

            <Button onClick={handleAudit} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Procesando...
                </div>
              ) : (
                <>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Auditar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
