import { Linking } from 'react-native';

import { getDirectionsUrl } from './directions-logic';

/** Opens the directions link; resolves `false` when there is no address or the link cannot be opened. */
export async function openDirections(address: string | undefined | null): Promise<boolean> {
  const url = getDirectionsUrl(address);
  if (!url) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
