import { BottomNav } from "../components/BottomNav";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_32%),#070b19] px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">SNIPPIT Creator</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Manage your profile, membership, AI preferences, and connected accounts.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plan</p>
              <p className="mt-2 text-lg font-semibold text-white">Premium</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-200 shadow-xl shadow-slate-950/10">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile details</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-slate-400">Display name</p>
                <p className="mt-1 text-base font-semibold text-white">SNIPPIT Creator</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Username</p>
                <p className="mt-1 text-base font-semibold text-white">@snippit.ai</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-200 shadow-xl shadow-slate-950/10">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stats</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                <p className="text-2xl font-semibold text-white">1.2k</p>
                <p className="mt-1 text-xs text-slate-500">Chats</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                <p className="text-2xl font-semibold text-white">420</p>
                <p className="mt-1 text-xs text-slate-500">Uploads</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
