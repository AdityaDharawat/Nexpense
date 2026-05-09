export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <header className="mb-16 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300">
            Expense Management SaaS
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Expense Tracker Pro
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Track expenses, submit receipts, control approval workflows, and monitor budgets from one polished dashboard.
          </p>
          <div className="mx-auto mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
              Open Dashboard
            </button>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:text-white"
            >
              Explore features
            </a>
          </div>
        </header>

        <section id="features" className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur-sm">
            <h2 className="mb-3 text-xl font-semibold text-white">Fast expense requests</h2>
            <p className="text-slate-300">
              Submit new claims with receipt upload, categorization, and instant validation built for teams.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur-sm">
            <h2 className="mb-3 text-xl font-semibold text-white">Approval workflows</h2>
            <p className="text-slate-300">
              Approve and reject expenses, add comments, and keep audit history visible for finance review.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur-sm">
            <h2 className="mb-3 text-xl font-semibold text-white">Live analytics</h2>
            <p className="text-slate-300">
              Track spending trends, budget summaries, and department activity with reusable charts.
            </p>
          </article>
        </section>

        <section className="mt-16 grid gap-6 rounded-3xl bg-slate-900/80 p-8 text-slate-100 shadow-2xl shadow-slate-950/30 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Your next steps</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Build the full product</h3>
            <p className="mt-4 text-slate-300">
              This project is now ready for the next phase: auth, dashboard pages, admin approval workflows, and the backend APIs.
            </p>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li>• Add sign-in / registration flows</li>
            <li>• Integrate expense creation and management</li>
            <li>• Implement backend auth and audit logging</li>
            <li>• Add charts and analytics pages</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
