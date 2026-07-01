"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";

const metrics = [
  { label: "Creators onboarded", value: "18.4K", accent: "text-fuchsia-400" },
  { label: "AI prompts generated", value: "74.2K", accent: "text-cyan-400" },
  { label: "Campaigns launched", value: "1.7K", accent: "text-emerald-400" },
];

const quickActions = [
  { title: "AI Chat", icon: "💬", href: "/" },
  { title: "Create", icon: "✨", href: "/create" },
  { title: "Trending", icon: "🔥", href: "/discover" },
  { title: "Library", icon: "📚", href: "/library" },
];

const toolCards = [
  { title: "Caption Writer", description: "Generate polished social captions and hooks.", badge: "Boost engagement" },
  { title: "Video Ideas", description: "Spin up creative short-form content prompts.", badge: "Save time" },
  { title: "Image Generator", description: "Turn ideas into visuals with AI-friendly creative notes.", badge: "Visual-first" },
  { title: "File Analysis", description: "Analyze uploads for captions, summaries, and trend signals.", badge: "Smart insights" },
];

const sampleChats = [
  "Help me write a caption for a launch video",
  "What should I post for a creator milestone?",
  "Summarize the latest creator economy trends",
];

type ChatMessage = { sender: "You" | "SNIPPIT"; text: string };

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    setError("");
    setChat((prev) => [...prev, { sender: "You", text: trimmed }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are SNIPPIT AI. Be helpful, conversational, and not too long. Match the user's tone.",
            },
            {
              role: "user",
              content: trimmed,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const aiText = await response.text();
      setChat((prev) => [...prev, { sender: "SNIPPIT", text: aiText || "Sorry, I could not generate a response." }]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setChat((prev) => [...prev, { sender: "SNIPPIT", text: "I couldn’t reach the assistant right now. Try again soon." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_32%),#070b19] text-slate-100 px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-7 shadow-[0_35px_120px_rgba(15,23,42,0.32)] backdrop-blur-xl">
            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full bg-slate-800/80 px-4 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                Modern creator AI platform
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  SNIPPIT-AI: AI workflows for creators, campaigns, and content intelligence.
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Launch creator ideas, generate captions, discover trends, and manage your AI workspace with a modern mobile-first dashboard built for fast decision making.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-900/85 p-5">
                    <p className={`text-sm font-medium ${metric.accent}`}>{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.25)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Live assistant</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Ask anything</h2>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                AI chat
              </span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="main-input" className="text-sm font-medium text-slate-200">
                  Start a new prompt
                </label>
                <input
                  id="main-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a caption, strategy question, or trend prompt..."
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Generating..." : "Send to SNIPPIT"}
              </button>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick examples</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {sampleChats.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setMessage(prompt)}
                      className="rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-900/95"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {toolCards.map((tool) => (
            <div key={tool.title} className="group rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-slate-900/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{tool.description}</p>
                </div>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {tool.badge}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/create"
                  className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  Open tool
                </Link>
                <Link
                  href="/library"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                >
                  View library
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Your creator command center</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Everything you need to plan, publish, and measure.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-900/95"
                >
                  {action.icon} {action.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.18)]">
            <h3 className="text-lg font-semibold text-white">Trend pulse</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Stay on top of creator trends, viral formats, and AI-powered topic ideas curated for your workflow.</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <p className="rounded-3xl bg-slate-950/80 p-4">Short-form storytelling with creator-first hooks.</p>
              <p className="rounded-3xl bg-slate-950/80 p-4">Data-backed caption structures for higher engagement.</p>
              <p className="rounded-3xl bg-slate-950/80 p-4">Repurpose your best-performing content into a 30-day plan.</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.18)]">
            <h3 className="text-lg font-semibold text-white">Recent activity</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="font-semibold text-white">Caption batch created</p>
                <p className="mt-2 text-slate-400">Your last caption draft was generated from an AI prompt.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="font-semibold text-white">Trend report</p>
                <p className="mt-2 text-slate-400">You reviewed the latest creator economy insights two hours ago.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.18)]">
            <h3 className="text-lg font-semibold text-white">Smart suggestions</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p className="rounded-3xl bg-slate-950/80 p-4">Optimize your next caption with personality and clarity filters.</p>
              <p className="rounded-3xl bg-slate-950/80 p-4">Generate follow-up topics from your latest post idea.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live chat</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Chat history</h2>
            </div>
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">AI assistant</span>
          </div>

          <div className="mt-5 space-y-4">
            {chat.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/90 p-6 text-sm text-slate-400">
                Your chat will appear here once you send a message.
              </div>
            ) : (
              chat.map((entry, index) => (
                <div
                  key={index}
                  className={`rounded-3xl p-4 ${
                    entry.sender === "You" ? "bg-slate-900/90 text-slate-100" : "bg-slate-800/80 text-slate-200"
                  }`}
                >
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
