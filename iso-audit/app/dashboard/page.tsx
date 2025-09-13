import { ISOSelector } from "@/components/dashboard/iso-selector"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Sistema de Auditorías ISO</h1>
            <p className="text-muted-foreground">Selecciona la norma ISO que deseas auditar</p>
          </div>
          <ISOSelector />
        </div>
      </main>
    </div>
  )
}
