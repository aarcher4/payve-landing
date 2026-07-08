"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { bookDemoLabel, bookDemoUrl, navGroups, signInUrl } from "./config";

export default function SiteHeader() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur"
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-sm"
          onClick={() => setOpenGroup(null)}
        >
          <Image
            src="/brand/payve-logo.png"
            alt="Payve"
            width={109}
            height={50}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navGroups.map((group) =>
            group.items ? (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    openGroup === group.label
                      ? "bg-paper-2 text-ink-1"
                      : "text-ink-2 hover:text-ink-1"
                  }`}
                  aria-expanded={openGroup === group.label}
                  onClick={() =>
                    setOpenGroup(openGroup === group.label ? null : group.label)
                  }
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openGroup === group.label ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {openGroup === group.label && (
                  <div className="absolute left-0 top-full mt-1 w-80 rounded-lg border border-hairline bg-paper-elev p-2 shadow-elev-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-md px-3 py-2.5 transition-colors hover:bg-paper-2"
                        onClick={() => setOpenGroup(null)}
                      >
                        <span className="block text-sm font-semibold text-ink-1">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-xs leading-snug text-ink-3">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href ?? "/"}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink-1"
                onClick={() => setOpenGroup(null)}
              >
                {group.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={signInUrl}
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink-1"
          >
            Sign in
          </a>
          <a
            href={bookDemoUrl}
            className="rounded-md bg-sage-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
          >
            {bookDemoLabel}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-md p-2 text-ink-2 md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hairline bg-paper-elev px-4 pb-6 pt-2 md:hidden">
          {navGroups.map((group) => (
            <div key={group.label} className="border-b border-hairline py-3 last:border-b-0">
              {group.items ? (
                <>
                  <span className="t-eyebrow block px-1 pb-2">{group.label}</span>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-1 py-2 text-sm font-medium text-ink-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={group.href ?? "/"}
                  className="block rounded-md px-1 py-2 text-sm font-medium text-ink-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {group.label}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={bookDemoUrl}
              className="rounded-md bg-sage-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {bookDemoLabel}
            </a>
            <a
              href={signInUrl}
              className="rounded-md border border-hairline-2 px-4 py-2.5 text-center text-sm font-medium text-ink-1"
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
