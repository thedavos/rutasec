export function isCatalogNavActive(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/resources/");
}
