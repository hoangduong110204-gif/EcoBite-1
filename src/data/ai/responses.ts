import type { AiConversationSummary, AiMockResponse } from '@/types/ai';

/** Follows the reference `AI_MOCK`. AI references core entities by id only. */
export const AI_GREETING = 'Chào Dương! Bạn muốn ăn gì hôm nay?';

export const aiQuickPrompts: string[] = [
  'Hôm nay ăn gì?',
  'Món cay, giá rẻ?',
  'Ăn healthy?',
  'Gợi ý cho tôi',
];

export const AI_DISCLAIMER =
  'AI trong bản này là GIAO DIỆN MÔ PHỎNG. Không gọi mô hình AI thật.';

export const AI_FALLBACK_RESPONSE: AiMockResponse = {
  keywords: [],
  text: 'Mình là trợ lý EcoBite (bản thử nghiệm). Bạn có thể hỏi mình về túi thực phẩm, quán gần bạn hoặc cách nhận hàng.',
};

export const aiMockResponses: AiMockResponse[] = [
  {
    keywords: ['cay', 'rẻ'],
    text: 'Dưới đây là một số món phù hợp với bạn:',
    suggestions: [
      {
        id: 'sg_bag_04',
        label: 'Túi bún bò cay',
        target: { type: 'food-bag', id: 'bag_04' },
        reasons: [
          'Có vị cay đậm, đúng khẩu vị bạn vừa nói',
          '45.000đ — nằm trong ngân sách dưới 50k',
          'Quán gần bạn nhất (0.8 km) và còn 3 túi',
          'Khung giờ nhận 17:30 – 19:00, bạn còn kịp',
        ],
      },
      {
        id: 'sg_bag_08',
        label: 'Túi cơm niêu cay',
        target: { type: 'food-bag', id: 'bag_08' },
        reasons: ['38.000đ — rẻ hơn', 'Cơm niêu có vị cay nhẹ'],
      },
    ],
  },
  {
    keywords: ['healthy', 'chay', 'salad'],
    text: 'Đây là lựa chọn healthy đang còn túi:',
    suggestions: [
      {
        id: 'sg_bag_05',
        label: 'Túi salad chiều',
        target: { type: 'food-bag', id: 'bag_05' },
        reasons: ['Salad tươi kèm ức gà', 'Quán có điểm đánh giá cao nhất (4.9)'],
      },
    ],
  },
  {
    keywords: ['gần', 'quán'],
    text: 'Đây là vài quán gần bạn đang có túi thực phẩm:',
    suggestions: [
      {
        id: 'sg_res_03',
        label: 'Bún Bò Cay',
        target: { type: 'restaurant', id: 'res_03' },
        reasons: ['Cách bạn 0.8 km'],
      },
      {
        id: 'sg_res_06',
        label: 'Chè Sen Bà Tâm',
        target: { type: 'restaurant', id: 'res_06' },
        reasons: ['Cách bạn 0.9 km'],
      },
    ],
  },
  {
    keywords: ['nhận', 'qr', 'pickup'],
    text: 'Sau khi thanh toán, bạn nhận mã QR nhận hàng. Đến quán và đưa mã này cho nhân viên để xác nhận.',
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
