export function boundedNumber(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(Number(value) || 0)));
}
export function timeParts(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0));
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}
export function fromTimeParts(parts, min, max) {
  return boundedNumber(parts[0] * 3600 + parts[1] * 60 + parts[2], min, max);
}
