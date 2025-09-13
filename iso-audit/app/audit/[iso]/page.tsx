import { AuditChecklist } from "@/components/audit/audit-checklist"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { notFound } from "next/navigation"

const validISOs = ["9001", "27001"]

interface AuditPageProps {
  params: {
    iso: string
  }
}

export default function AuditPage({ params }: AuditPageProps) {
  if (!validISOs.includes(params.iso)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <AuditChecklist isoStandard={params.iso} />
      </main>
    </div>
  )
}
