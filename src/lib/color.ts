export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255);
  const hexAlpha = a.toString(16).padStart(2, '0');
  return `${hex}${hexAlpha}`;
}
