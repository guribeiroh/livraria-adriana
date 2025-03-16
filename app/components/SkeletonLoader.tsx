export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="bg-primary-100 h-64 w-full"></div>
      <div className="card-body">
        <div className="h-5 bg-primary-100 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-primary-100 rounded w-1/2 mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-primary-100 rounded w-1/4"></div>
          <div className="h-4 bg-primary-100 rounded w-1/3"></div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-primary-100 rounded w-1/4"></div>
          <div className="h-8 bg-primary-100 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ width = 'w-full', height = 'h-4' }: { width?: string, height?: string }) {
  return <div className={`bg-primary-100 rounded-md ${width} ${height} animate-pulse`}></div>;
}

export function SkeletonImage({ aspectRatio = 'aspect-video' }: { aspectRatio?: string }) {
  return <div className={`bg-primary-100 rounded-md ${aspectRatio} w-full animate-pulse`}></div>;
}

export function SkeletonButton() {
  return <div className="h-10 bg-primary-100 rounded-md w-24 animate-pulse"></div>;
}

export function SkeletonCircle({ size = 'h-12 w-12' }: { size?: string }) {
  return <div className={`${size} bg-primary-100 rounded-full animate-pulse`}></div>;
}

export function SkeletonBanner() {
  return (
    <div className="w-full h-40 md:h-60 lg:h-80 bg-primary-100 rounded-lg animate-pulse"></div>
  );
}

export function SkeletonGrid({ columns = 3, rows = 2 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: columns * rows }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
} 