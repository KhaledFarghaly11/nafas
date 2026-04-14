export function withAlpha(color: string, alpha: number): string {
  const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const hex = color.replace('#', '');
  const a = Math.round(alpha * 255);
  const hexAlpha = a.toString(16).padStart(2, '0');
  return `#${hex}${hexAlpha}`;
}
