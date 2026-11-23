// En Next.js, "server-only" impide importar módulos de servidor desde el
// navegador. Vitest no usa la condición "react-server", así que en las pruebas
// se reemplaza por este módulo vacío.
export {};
