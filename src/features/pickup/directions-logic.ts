/**
 * "Chỉ đường" (reference 6.4, 8.1, 8.2): a plain maps deep link built from the
 * restaurant's address. No map SDK, no GPS, no user location is read — the maps app
 * (or browser) does the routing. Returns the URL, or `null` when there is no address.
 */
export const getDirectionsUrl = (address: string | undefined | null): string | null => {
  const query = address?.trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
};
