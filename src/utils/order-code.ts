/** `EB-YYMM-NNN`, e.g. `EB-2409-017`. */
export const formatOrderCode = (date: Date, sequence: number): string => {
  const yy = String(date.getFullYear() % 100).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `EB-${yy}${mm}-${String(sequence).padStart(3, '0')}`;
};

/** Bank transfer note is the order code without dashes: `EB-2409-017` -> `EB2409017`. */
export const orderCodeToTransferNote = (orderCode: string): string => orderCode.replace(/-/g, '');
