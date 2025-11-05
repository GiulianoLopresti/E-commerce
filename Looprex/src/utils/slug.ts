export function toSlug(s: string) {
  return s
    .normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "") // quita tildes
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "");
}