import { CompanyForm } from "@/components/forms/company-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { notFound } from "next/navigation"

const validISOs = ["9001", "27001"]

interface CompanyFormPageProps {
  params: {
    iso: string
  }
}

export default function CompanyFormPage({ params }: CompanyFormPageProps) {
  if (!validISOs.includes(params.iso)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <CompanyForm isoStandard={params.iso} />
      </main>
    </div>
  )
}
