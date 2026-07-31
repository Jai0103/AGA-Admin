type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/86 p-8 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-blue">
        Coming next
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        This module is intentionally reserved for the next page-by-page build
        step. The app shell, routing, theme system, and navigation are ready for
        it.
      </p>
    </section>
  );
}
