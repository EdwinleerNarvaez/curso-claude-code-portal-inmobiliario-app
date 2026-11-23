import Link from "next/link";

import { MobileNavigation } from "./mobile-navigation";
import { loginNavigationLink, publicNavigationLinks } from "./navigation-links";
import { SiteLogo } from "./site-logo";

export function SiteHeader() {
  return (
    <header className="relative border-b border-zinc-200 bg-background dark:border-zinc-800">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {publicNavigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link
                href={loginNavigationLink.href}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                {loginNavigationLink.label}
              </Link>
            </li>
          </ul>
        </nav>

        <MobileNavigation
          links={publicNavigationLinks}
          loginLink={loginNavigationLink}
        />
      </div>
    </header>
  );
}
