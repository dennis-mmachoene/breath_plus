export default function AppLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-28 rounded-full bg-surface-2" />
        <div className="h-9 w-72 rounded-xl bg-surface-2" />
        <div className="mt-8 h-40 w-full rounded-3xl bg-surface-2" />
        <div className="grid gap-4 pt-2 sm:grid-cols-3">
          <div className="h-32 rounded-3xl bg-surface-2" />
          <div className="h-32 rounded-3xl bg-surface-2" />
          <div className="h-32 rounded-3xl bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
