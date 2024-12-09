import { ErrorFallback } from "@/components/ErrorFallback";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { roundToNearest30Minutes } from "@/lib/times";
import { addDays, addHours, format } from "date-fns";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { FormValues } from "@/components/search/form";
import { AdditionalFilters } from "@/components/search/AdditionalFilters";
import { VehicleList } from "@/components/search/VehicleList";
import { TimeRangeFilters } from "@/components/search/TimeRangeFilters";
import { SlidersHorizontal, Car } from "lucide-react";

export function SearchPage() {
  const [initialStartDateAndTime] = useState(() =>
    roundToNearest30Minutes(addHours(new Date(), 1))
  );

  const [initialEndDateAndTime] = useState(() =>
    addDays(initialStartDateAndTime, 1)
  );

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: initialStartDateAndTime,
      startTime: format(initialStartDateAndTime, "HH:mm"),
      endDate: initialEndDateAndTime,
      endTime: format(initialEndDateAndTime, "HH:mm"),
      minPassengers: 1,
      classification: [],
      make: [],
      price: [10, 100],
      page: 1,
    },
  });

  const filters = (
    <ErrorBoundary fallback={<ErrorFallback message="Failed to load filters" />}>
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-[100px] rounded-lg shadow-md animate-pulse"
              />
            ))}
          </div>
        }
      >
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <AdditionalFilters />
        </div>
      </Suspense>
    </ErrorBoundary>
  );

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold tracking-tight text-primary">
                  Workoast Wheels
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-6">
          {/* Time Range Filters */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <TimeRangeFilters />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Filters */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    {filters}
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden lg:block sticky top-24">
                {filters}
              </div>
            </aside>

            {/* Vehicle List */}
            <main className="col-span-12 lg:col-span-9">
              <ErrorBoundary
                fallback={<ErrorFallback message="Failed to load vehicles" />}
              >
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton
                          key={i}
                          className="w-full h-[320px] rounded-xl shadow-md animate-pulse"
                        />
                      ))}
                    </div>
                  }
                >
                  <VehicleList />
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </Form>
  );
}
