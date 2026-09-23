/** One-second tick of a countdown, never below zero. */
export const tickCountdown = (remainingSeconds: number): number => Math.max(0, remainingSeconds - 1);
