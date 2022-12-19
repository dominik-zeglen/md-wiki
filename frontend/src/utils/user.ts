export function getName(
  user: { username: string | null; displayName: string | null } | undefined,
  placeholder = "unknown"
): string {
  return user?.displayName ?? user?.username ?? placeholder;
}
