export function formatRoles(roles: string[]): string {
  if (!roles || roles.length === 0) return "Sin roles";
  return roles.join(", ");
}
