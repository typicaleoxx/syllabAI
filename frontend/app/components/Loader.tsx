export default function Loader() {
  return (
    <div className="p-8 animate-pulse">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-24 border border-gray-100">
            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div className="h-7 w-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-2.5 w-24 bg-gray-100 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
        <div className="w-64 bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
