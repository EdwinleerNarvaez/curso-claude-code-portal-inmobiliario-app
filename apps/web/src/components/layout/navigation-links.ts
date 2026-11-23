export type NavigationLink = {
  label: string;
  href: string;
};

export const publicNavigationLinks: readonly NavigationLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Propiedades", href: "/properties" },
  { label: "Comprar", href: "/properties?operation=SALE" },
  { label: "Arrendar", href: "/properties?operation=RENT" },
];

export const loginNavigationLink: NavigationLink = {
  label: "Ingresar",
  href: "/login",
};
