export default function PortalLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 sm:w-64 mb-3"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-64 sm:w-96"></div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1 sm:w-32"></div>
          <div className="h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex-1 sm:w-32"></div>
        </div>
      </div>

      {/* Stats/Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
              <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 mb-3"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full sm:w-64"></div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-50 dark:border-slate-800/50 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-32 sm:w-48 mb-2"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-20 sm:w-32"></div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-8">
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-24"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-24"></div>
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
