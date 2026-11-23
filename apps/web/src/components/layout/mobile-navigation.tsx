"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/class-names";

import type { NavigationLink } from "./navigation-links";

type MobileNavigationProps = {
  links: readonly NavigationLink[];
  loginLink: NavigationLink;
};

export function MobileNavigation({ links, loginLink }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuIdentifier = useId();

  function closeMenu() {
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  return (
    <div className="md:hidden" onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuIdentifier}
        onClick={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
        className="inline-flex size-10 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <span className="sr-only">{isOpen ? "Cerrar menú" : "Abrir menú"}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="size-6"
        >
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        id={menuIdentifier}
        aria-label="Navegación principal móvil"
        className={cn(
          "absolute inset-x-0 top-full z-40 border-b border-zinc-200 bg-background shadow-lg dark:border-zinc-800",
          !isOpen && "hidden",
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <Link
              href={loginLink.href}
              onClick={closeMenu}
              className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-base font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              {loginLink.label}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
