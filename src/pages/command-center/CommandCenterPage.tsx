export default function CommandCenterPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          AeroPulse
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight">
          Airport Operations Control Center
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Mission Control initializing. Operational modules will become
          available as airport systems come online.
        </p>
      </div>
    </div>
  );
}