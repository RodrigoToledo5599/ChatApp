export default function FriendsContainerLoadingSkeleton(){
    return (
        <>
        <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-zinc-800 rounded" />
                      <div className="h-3 w-48 bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl" />
                </div>
              ))}
        </div>
        </>
    )
}