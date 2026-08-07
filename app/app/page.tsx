export default function RegistryUnavailablePage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#090909] px-6 py-12 text-stone-100">
      <section
        className="w-full max-w-md text-center"
        aria-labelledby="page-title"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          Auryes Registry
        </p>
        <h1
          id="page-title"
          className="mt-6 text-3xl font-semibold tracking-[-0.035em]"
        >
          Admin access unavailable
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-400">
          This registry interface is not publicly available. dddd
        </p>
      </section>
    </main>
  );
}
