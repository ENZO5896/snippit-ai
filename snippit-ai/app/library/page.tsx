import { BottomNav } from "../components/BottomNav";

const libraryItems = [
  { label: "Chats", value: "24" },
  { label: "Files", value: "13" },
  { label: "Images", value: "8" },
  { label: "Saved prompts", value: "17" },
];

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_32%),#070b19] px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Library</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">All your chats, files, and saved content.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Browse your stored AI responses, uploaded documents, generated visuals, and saved prompts.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {libraryItems.map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center text-slate-200 shadow-xl shadow-slate-950/10">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
