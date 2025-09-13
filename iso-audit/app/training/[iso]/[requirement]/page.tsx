import { TrainingModule } from "@/components/training/training-module"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { notFound } from "next/navigation"

const validISOs = ["9001", "27001"]

interface TrainingPageProps {
  params: {
    iso: string
    requirement: string
  }
}

export default function TrainingPage({ params }: TrainingPageProps) {
  if (!validISOs.includes(params.iso)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <TrainingModule isoStandard={params.iso} requirementId={params.requirement} />
      </main>
    </div>
  )
}
