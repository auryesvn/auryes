export function clampAudioTime(value: number, duration: number) {
  if (!Number.isFinite(value) || !Number.isFinite(duration) || duration <= 0)
    return null;
  return Math.min(duration, Math.max(0, value));
}

export function displayedAudioTime(currentTime: number, scrubTime: number | null) {
  return scrubTime ?? currentTime;
}

export function audioTimelineProgress(value: number, duration: number) {
  const time = clampAudioTime(value, duration);
  return time === null ? 0 : Math.min(100, Math.max(0, (time / duration) * 100));
}
