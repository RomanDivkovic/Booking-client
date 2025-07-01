import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Calendar Event Skeleton
export const EventSkeleton = () => (
  <div className="p-2 border rounded-lg mb-2">
    <div className="flex items-center space-x-2">
      <Skeleton className="w-3 h-3 rounded-full" />
      <Skeleton className="h-4 flex-1" />
    </div>
  </div>
);

// Todo Item Skeleton
export const TodoSkeleton = () => (
  <div className="flex items-center space-x-3 p-3 border rounded-lg mb-2">
    <Skeleton className="w-5 h-5 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="w-6 h-6 rounded" />
  </div>
);

// Group Card Skeleton
export const GroupCardSkeleton = () => (
  <Card className="h-48">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="w-9 h-9" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Calendar Day Skeleton
export const CalendarDaySkeleton = () => (
  <div className="min-h-[120px] p-2 border rounded-lg">
    <Skeleton className="h-4 w-6 mb-2" />
    <div className="space-y-1">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

// Profile Form Skeleton
export const ProfileFormSkeleton = () => (
  <div className="space-y-4">
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

// Sidebar Skeleton
export const SidebarSkeleton = () => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Header Skeleton
export const HeaderSkeleton = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  </header>
);

// Loading Spinner
export const LoadingSpinner = ({
  size = "default"
}: {
  size?: "small" | "default" | "large";
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
    />
  );
};

// Page Loading Skeleton
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
    <HeaderSkeleton />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);
