import Link from "next/link";

export function SiteLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white"
      >
        PI
      </span>
      <span>Portal Inmobiliario</span>
    </Link>
  );
}
