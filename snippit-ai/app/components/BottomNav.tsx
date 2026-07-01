"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: "🏠", href: "/" },
  { label: "Discover", icon: "🔍", href: "/discover" },
  { label: "Create", icon: "➕", href: "/create" },
  { label: "Library", icon: "📚", href: "/library" },
  { label: "Profile", icon: "👤", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.18)] sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 text-xs text-slate-300 sm:gap-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-[0] flex-1 flex-col items-center justify-center rounded-3xl px-2 py-2 transition ${
                active ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
