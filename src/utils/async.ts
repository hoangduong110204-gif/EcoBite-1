/** Simulated network latency for mock services. */
export const delay = (ms = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let counter = 0;
/** Simple unique id for mock entities (not for security purposes). */
export const createId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${(counter++).toString(36)}`;
