import Link from "next/link";

import { loginNavigationLink, publicNavigationLinks } from "./navigation-links";
import { SiteLogo } from "./site-logo";

const footerLinkClassName =
  "rounded-sm text-sm text-zinc-600 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-zinc-400 dark:hover:text-white";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <SiteLogo />
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Casas, departamentos, terrenos y oficinas en venta y arriendo en
            Chile.
          </p>
        </div>

        <nav aria-label="Explorar propiedades">
          <h2 className="text-sm font-semibold">Explorar</h2>
          <ul className="mt-3 space-y-2">
            {publicNavigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClassName}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Cuenta">
          <h2 className="text-sm font-semibold">Cuenta</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={loginNavigationLink.href}
                className={footerLinkClassName}
              >
                {loginNavigationLink.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <p className="mx-auto w-full max-w-7xl px-4 py-4 text-xs text-zinc-500 sm:px-6 lg:px-8">
          © Portal Inmobiliario. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
