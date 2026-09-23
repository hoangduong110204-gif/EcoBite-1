/**
 * Pure form validation for the auth flow (reference screens 1.6, 1.7, 1.8).
 * Messages are Vietnamese UI copy; codes are stable for tests.
 */

export const AUTH_MESSAGES = {
  identifierInvalid: 'Nhập email hoặc số điện thoại hợp lệ',
  phoneInvalid: 'Số điện thoại chưa đúng (ví dụ 0912 345 678)',
  emailInvalid: 'Email chưa đúng định dạng',
  passwordWeak: 'Ít nhất 8 ký tự, có chữ và số',
  passwordRequired: 'Vui lòng nhập mật khẩu',
  termsRequired: 'Bạn cần đồng ý với Điều khoản và Chính sách bảo mật',
  nameRequired: 'Vui lòng nhập họ và tên',
  nameTooShort: 'Họ và tên cần ít nhất 2 ký tự',
  otpInvalid: 'Mã không đúng. Vui lòng thử lại.',
  otpIncomplete: 'Nhập đủ 4 số của mã xác thực',
  credentialsWrong: 'Email/số điện thoại hoặc mật khẩu không đúng',
  phoneTaken: 'Số điện thoại này đã có tài khoản',
  emailTaken: 'Email này đã có tài khoản',
  areaRequired: 'Chọn một khu vực để tiếp tục',
} as const;

/** Digits only, `+84`/`84` prefix turned into `0`: "0912 345 678" -> "0912345678". */
export const normalizePhone = (input: string): string => {
  const digits = input.replace(/[^\d+]/g, '').replace(/^\+?84/, '0');
  return digits.replace(/\D/g, '');
};

/** Vietnamese mobile number: 10 digits starting with 03, 05, 07, 08 or 09. */
export const isValidPhone = (input: string): boolean => /^0[35789]\d{8}$/.test(normalizePhone(input));

export const isValidEmail = (input: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());

/** Reference rule (1.7): at least 8 characters with letters and digits. */
export const isValidPassword = (input: string): boolean =>
  input.length >= 8 && /[A-Za-z]/.test(input) && /\d/.test(input);

export const isValidName = (input: string): boolean => input.trim().length >= 2;

export const isValidOtp = (input: string): boolean => /^\d{4}$/.test(input);

/** Login identifier is an email or a phone number. */
export const isValidIdentifier = (input: string): boolean => isValidEmail(input) || isValidPhone(input);
