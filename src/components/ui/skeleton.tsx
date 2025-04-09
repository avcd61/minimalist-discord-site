import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-gradient-to-r from-transparent via-muted/40 to-transparent", className)}
      {...props}
    />
  )
}

// Компонент скелетона карточки проекта
function CardSkeleton() {
  return (
    <div className="relative rounded-lg p-4 h-48 border border-muted/20 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-muted/5" />
      
      <div className="flex flex-col h-full justify-between z-10 relative">
        {/* Заголовок и лого */}
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-2/3 h-5" />
        </div>
        
        {/* Описание */}
        <div className="space-y-2">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-5/6 h-3" />
          <Skeleton className="w-3/4 h-3" />
        </div>
        
        {/* Нижняя часть */}
        <div className="flex justify-between items-end mt-4">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Компонент скелетона профиля
function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg border border-muted/20">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  );
}

// Компонент скелетона текстового контента
function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-3 w-full" 
          style={{ 
            width: `${Math.max(50, 100 - i * (100 / lines))}%`,
            opacity: 1 - (i * 0.1)
          }} 
        />
      ))}
    </div>
  );
}

export { Skeleton, CardSkeleton, ProfileSkeleton, TextSkeleton }
