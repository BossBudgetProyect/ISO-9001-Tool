"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.position) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Simulate registration
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          position: formData.position,
          isAuthenticated: true,
        }),
      )
      router.push("/dashboard")
    }, 1000)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder="tu@empresa.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Cargo en la Empresa</Label>
        <Select value={formData.position} onValueChange={(value) => updateFormData("position", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gerente">Gerente</SelectItem>
            <SelectItem value="director">Director</SelectItem>
            <SelectItem value="coordinador">Coordinador</SelectItem>
            <SelectItem value="analista">Analista</SelectItem>
            <SelectItem value="consultor">Consultor</SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Creando cuenta...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Crear Cuenta
          </div>
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </form>
  )
}
