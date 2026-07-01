"use client";

import { useState } from "react";
import { BottomNav } from "./components/BottomNav";

const quickActions = [
  { title: "AI Chat", icon: "💬" },
  { title: "Create", icon: "✨" },
  { title: "Video Ideas", icon: "🎥" },
  { title: "Caption Writer", icon: "📝" },
  { title: "Trending", icon: "🔥" },
  { title: "AI Friends", icon: "🤖" },
  { title: "File Analysis", icon: "📄" },
  { title: "Image Generator", icon: "🖼️" },
];

const sampleChats = [
  "Launch plan for a new creator campaign",
  "Rewrite my bio for a professional tone",
  "Summarize this article about AI trends",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: "You" | "SNIPPIT"; text: string }[]>([]);

  function sendMessage() {
    if (!message.trim()) return;

    setChat((prev) => [
      ...prev,
      { sender: "You", text: message.trim() },
      {
        sender: "SNIPPIT",
        text: "This is your AI assistant. Ask anything, generate content, analyze files, or get creator ideas.",
      },
    ]);

    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_32%),#070b19] text-slate-100 px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="space-y-4 rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              Welcome back to SNIPPIT-AI
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your premium AI assistant for creators and productivity.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Focus on asking, writing, coding, learning, or planning. The creator and social tools are there when you need them.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <label htmlFor="main-input" className="text-sm font-medium text-slate-200">
                Ask SNIPPIT anything
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="main-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a caption, ask a question, or start a chat..."
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  onClick={sendMessage}
                  className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-violet-500/20 transition hover:brightness-110"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Tip: Use the quick action cards below to start a creator flow.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-4 text-sm text-slate-300 shadow-xl shadow-slate-950/20 sm:p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Fast actions</p>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Spotlight</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Creator AI mode</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Get creator prompts, caption ideas, and trend insights from one place.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/85 p-4 text-center text-xs text-slate-300">
                    <p className="font-semibold text-white">Premium</p>
                    <p className="mt-1">Faster responses</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/85 p-4 text-center text-xs text-slate-300">
                    <p className="font-semibold text-white">Mobile first</p>
                    <p className="mt-1">Responsive UI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <div key={action.title} className="group rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/95">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl">
                {action.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{action.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {action.title === "AI Chat" && "Start a new chat with the assistant."}
                {action.title === "Create" && "Launch creator tools and quick workflows."}
                {action.title === "Video Ideas" && "Generate trending video concepts."}
                {action.title === "Caption Writer" && "Write captions with tone and style."}
                {action.title === "Trending" && "Discover what is trending now."}
                {action.title === "AI Friends" && "Create and follow intelligent personas."}
                {action.title === "File Analysis" && "Upload and analyze your content files."}
                {action.title === "Image Generator" && "Transform ideas into visuals."}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent chats</h2>
              <p className="text-sm text-slate-400">Jump back into your latest conversations.</p>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              {sampleChats.length} saved
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {sampleChats.map((chatItem) => (
              <button key={chatItem} className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-left text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-slate-900/95">
                <p className="font-semibold text-white">{chatItem}</p>
                <span className="mt-2 block text-xs text-slate-500">Tap to continue</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_35px_120px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live chat</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Chat with SNIPPIT</h2>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">AI assistant</span>
          </div>

          <div className="mt-5 space-y-4">
            {chat.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/90 p-6 text-sm text-slate-400">
                Your chat will appear here once you send a message.
              </div>
            ) : (
              chat.map((entry, index) => (
                <div key={index} className={ounded-3xl p-4 }>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{entry.sender}</p>
                  <p className="mt-2 text-sm leading-6">{entry.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
