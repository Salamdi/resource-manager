export function format(n: string): string {
  const stripped = n.replace(/[^\d]/g, '');
  switch (stripped.length) {
    case 10:
      return `7${stripped}`;
    case 11:
      return stripped[0] === '8' ? `7${stripped.slice(1)}` : stripped;
    default:
      return stripped;
  }
}
