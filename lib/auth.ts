export function isAdmin(session: any) {
  return session?.user?.email === "mela@gmx.de";
}
