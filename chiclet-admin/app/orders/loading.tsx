import { AdminHeader } from "@/components/admin-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full sm:w-2/3" />
            <Skeleton className="h-10 w-full sm:w-1/3" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24 ml-auto" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
