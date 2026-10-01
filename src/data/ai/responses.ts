import type { AiConversationSummary, AiMockResponse } from '@/types/ai';

/** Follows the reference `AI_MOCK`. AI references core entities by id only. */
export const AI_GREETING =
  'Chào Dương 👋\nHôm nay bạn đang thèm món gì?\n\nMình có thể tìm giúp bạn món ngon, giá hợp lý và gần chỗ bạn nè.';

export const aiQuickPrompts: string[] = [
  '🌶️ Đang thèm món cay',
  '💰 Tìm món dưới 50k',
  '🥗 Hôm nay ăn healthy',
];

export const AI_DISCLAIMER =
  'AI trong bản này là GIAO DIỆN MÔ PHỎNG. Không gọi mô hình AI thật.';

export const AI_FALLBACK_RESPONSE: AiMockResponse = {
  keywords: [],
  text: 'Mình chưa chắc hiểu ý bạn lắm 😅 Bạn thử nói cụ thể hơn xem — món gì, tầm giá nào, hay khu vực nào — mình tìm giúp liền nhé.',
};

export const aiMockResponses: AiMockResponse[] = [
  {
    keywords: ['cay', 'rẻ', '50k'],
    text: 'Được luôn 😄 Nếu bạn muốn dưới 50k thì mình ưu tiên túi này trước nhé. Vị cay khá đậm, 45k thôi mà quán đang được đánh giá khá tốt.',
    suggestions: [
      {
        id: 'sg_bag_04',
        label: 'Túi bún bò cay',
        target: { type: 'food-bag', id: 'bag_04' },
        reasons: ['Hợp với vị cay bạn đang tìm', 'Giá vừa đúng ngân sách', 'Món nước dễ ăn, khá phổ biến', 'Quán đang được đánh giá tốt'],
      },
      {
        id: 'sg_bag_08',
        label: 'Túi cơm niêu cay',
        target: { type: 'food-bag', id: 'bag_08' },
        reasons: ['Rẻ hơn một chút, 38k thôi', 'Vị cay nhẹ, ăn no bụng hơn'],
      },
    ],
  },
  {
    keywords: ['healthy', 'chay', 'salad'],
    text: 'Ăn healthy hôm nay đúng bài đấy 🥗 Mình nghĩ túi salad này hợp với bạn nè.',
    suggestions: [
      {
        id: 'sg_bag_05',
        label: 'Túi salad chiều',
        target: { type: 'food-bag', id: 'bag_05' },
        reasons: ['Salad tươi, kèm ức gà nhẹ bụng', 'Quán đang được đánh giá cao nhất'],
      },
    ],
  },
  {
    keywords: ['ngọt', 'tráng miệng', 'dessert'],
    text: 'Đang thèm ngọt đúng không 😄 Mình có túi tráng miệng nhẹ nhàng, dễ ăn cho bạn nè.',
    suggestions: [
      {
        id: 'sg_bag_06',
        label: 'Túi tráng miệng',
        target: { type: 'food-bag', id: 'bag_06' },
        reasons: ['Ngọt thanh, hợp lúc thèm đồ tráng miệng', 'Giá chỉ 25.000đ, khá nhẹ nhàng'],
      },
    ],
  },
  {
    keywords: ['gần', 'quán'],
    text: 'Gần bạn thì mình thấy hai quán này đang có túi ngon nè 👇',
    suggestions: [
      {
        id: 'sg_res_03',
        label: 'Bún Bò Cay',
        target: { type: 'restaurant', id: 'res_03' },
        reasons: ['Chỉ cách bạn 0.8 km thôi'],
      },
      {
        id: 'sg_res_06',
        label: 'Chè Sen Bà Tâm',
        target: { type: 'restaurant', id: 'res_06' },
        reasons: ['Cách bạn 0.9 km, tiện ghé'],
      },
    ],
  },
  {
    keywords: ['nhận', 'qr', 'pickup'],
    text: 'Sau khi thanh toán, bạn sẽ có mã QR nhận hàng riêng. Cứ đưa mã đó cho nhân viên ở quán là nhận được túi liền nhé 👌',
  },
];

/** Follows the conversation list of screen 11.5. */
export const aiConversationHistory: AiConversationSummary[] = [
  { id: 'cv_1', emoji: '🌶', title: 'Hôm nay tôi muốn ăn cay và rẻ', when: '17:28', suggestionCount: 3, group: 'today' },
  { id: 'cv_2', emoji: '🥗', title: 'Có món chay nào dưới 40k không?', when: '12:04', suggestionCount: 2, group: 'today' },
  { id: 'cv_3', emoji: '🍜', title: 'Ăn gì ấm bụng ngày mưa?', when: '10/09', suggestionCount: 4, group: 'earlier' },
  { id: 'cv_4', emoji: '💰', title: 'Túi nào rẻ nhất quanh đây?', when: '08/09', suggestionCount: 5, group: 'earlier' },
  { id: 'cv_5', emoji: '🍰', title: 'Có tráng miệng không ngọt lắm?', when: '06/09', suggestionCount: 2, group: 'earlier' },
];
