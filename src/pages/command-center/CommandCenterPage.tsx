export default function CommandCenterPage() {
  return (
    <section className="flex h-full w-full items-center justify-center overflow-hidden px-8">
      <div className="text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.45em] text-muted-foreground">
          AeroPulse
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight">
          Airport Operations Control Center
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Airport systems initializing...
        </p>
      </div>
    </section>
  );
}