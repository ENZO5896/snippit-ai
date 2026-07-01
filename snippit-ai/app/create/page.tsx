import { BottomNav } from "../components/BottomNav";

const tools = [
  { name: "Caption Writer", description: "Generate caption drafts with tone and style." },
  { name: "Video Ideas", description: "Spark creator-led video concepts fast." },
  { name: "Hashtag Generator", description: "Find trending and relevant hashtag sets." },
  { name: "Script Writer", description: "Outline short scripts and creator talking points." },
];

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_32%),#070b19] px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Create</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Creator studio tools in one place.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Use these tools to turn ideas into captions, hashtags, scripts, thumbnails, and more.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <div key={tool.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-200 shadow-xl shadow-slate-950/10">
              <h2 className="text-lg font-semibold text-white">{tool.name}</h2>
              <p className="mt-3 text-slate-400">{tool.description}</p>
            </div>
          ))}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
