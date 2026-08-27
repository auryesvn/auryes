export function clampTimelineTime(value: number, duration: number) {
  if (!Number.isFinite(value) || !Number.isFinite(duration) || duration <= 0)
    return null;
  return Math.min(duration, Math.max(0, value));
}

export function timelineTimeFromPointer(
  clientX: number,
  left: number,
  width: number,
  duration: number,
) {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(left) ||
    !Number.isFinite(width) ||
    width <= 0
  )
    return null;
  return clampTimelineTime(((clientX - left) / width) * duration, duration);
}

export function timelineTimeFromKey(
  key: string,
  currentTime: number,
  duration: number,
) {
  const target =
    key === "ArrowLeft"
      ? currentTime - 5
      : key === "ArrowRight"
        ? currentTime + 5
        : key === "Home"
          ? 0
          : key === "End"
            ? duration
            : null;
  return target === null ? null : clampTimelineTime(target, duration);
}
