import type { OnboardingArtKey } from '@/constants';

export type OnboardingIllustrationKey = OnboardingArtKey;

export interface OnboardingSlide {
  key: OnboardingIllustrationKey;
  /** Small green badge above the title. */
  tag: string;
  /** Title lines (rendered on separate lines). */
  title: [string, string];
  body: string;
}

/** Onboarding copy from reference screens 1.2, 1.3 and 1.4. */
export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    key: 'value',
    tag: 'Vì sao EcoBite',
    title: ['Ăn ngon hơn', 'Tiết kiệm hơn'],
    body: 'Món ngon từ nhà hàng quanh bạn, giảm giá tới 50% vào cuối ngày.',
  },
  {
    key: 'impact',
    tag: 'Vì môi trường',
    title: ['Mỗi bữa ăn', 'cứu một phần hành tinh'],
    body: 'Thức ăn còn tốt nhưng ế cuối ngày được bán lại thay vì bỏ đi.',
  },
  {
    key: 'ai',
    tag: 'Điểm khác biệt',
    title: ['Không biết ăn gì?', 'Để EcoBite AI lo'],
    body: 'Nói khẩu vị và ngân sách, AI gợi ý món kèm lý do rõ ràng.',
  },
];
