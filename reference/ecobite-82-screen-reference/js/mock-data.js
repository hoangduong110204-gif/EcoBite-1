/* ==========================================================================
   EcoBite · mock-data.js
   Dữ liệu giả lập cho prototype. Không có backend, không có dữ liệu thật.
   Mọi thông tin ngân hàng / thẻ / mã đơn đều là BẢN DEMO.
   ========================================================================== */

const CONFIG = {
  appName: 'EcoBite',
  city: 'Bắc Ninh',
  currency: 'đ',
  fulfillment: 'SELF_PICKUP',   // KHÔNG có giao hàng trong mô hình sản phẩm
  deliveryEnabled: false,
  impactPerBag: { foodKg: 1.2, co2Kg: 2.5, waterL: 340 },
  isDemo: true,
};

const USER = {
  id: 'usr_001',
  name: 'Nguyễn Hoàng Dương',
  phone: '0912 345 678',
  email: 'duong.nguyen@email.com',
  area: 'Phường Suối Hoa, TP. Bắc Ninh',
  memberSince: '2026-08',
  walletBalance: 128000,
  savedRestaurants: ['res_01', 'res_05', 'res_02', 'res_06'],
  impact: { bagsSaved: 9, foodKg: 10.8, co2Kg: 22.5, moneySaved: 312000 },
};

const CATEGORIES = [
  { id: 'cat_all',     name: 'Tất cả',      count: 12 },
  { id: 'cat_rice',    name: 'Cơm',         count: 7 },
  { id: 'cat_noodle',  name: 'Mì',          count: 5 },
  { id: 'cat_healthy', name: 'Healthy',     count: 4 },
  { id: 'cat_dessert', name: 'Tráng miệng', count: 6 },
  { id: 'cat_drink',   name: 'Đồ uống',     count: 3 },
  { id: 'cat_cake',    name: 'Bánh',        count: 4 },
  { id: 'cat_vegan',   name: 'Chay',        count: 2 },
];

const RESTAURANTS = [
  { id: 'res_01', name: 'Bếp Nhà Lá',    category: 'cat_rice',    rating: 4.8, reviews: 214,
    distanceKm: 1.2, walkMinutes: 15, address: 'Số 24 Nguyễn Văn Cừ, P. Ninh Xá, TP. Bắc Ninh',
    phone: '0912 345 678', pickupWindowToday: '18:00 – 20:00', bagsLeft: 5, art: 'rice' },
  { id: 'res_02', name: 'Sushi House',   category: 'cat_rice',    rating: 4.7, reviews: 168,
    distanceKm: 1.5, walkMinutes: 18, address: 'Số 12 Lý Thái Tổ, P. Suối Hoa, TP. Bắc Ninh',
    phone: '0912 345 002', pickupWindowToday: '17:30 – 19:30', bagsLeft: 0, art: 'sushi' },
  { id: 'res_03', name: 'Bún Bò Cay',    category: 'cat_noodle',  rating: 4.7, reviews: 96,
    distanceKm: 0.8, walkMinutes: 10, address: 'Số 3 Ngô Gia Tự, P. Tiền An, TP. Bắc Ninh',
    phone: '0912 345 003', pickupWindowToday: '17:30 – 19:00', bagsLeft: 3, art: 'noodle' },
  { id: 'res_04', name: 'Cơm Niêu Quê',  category: 'cat_rice',    rating: 4.6, reviews: 121,
    distanceKm: 2.1, walkMinutes: 26, address: 'Số 88 Trần Hưng Đạo, P. Đại Phúc, TP. Bắc Ninh',
    phone: '0912 345 004', pickupWindowToday: '19:00 – 20:30', bagsLeft: 4, art: 'clay' },
  { id: 'res_05', name: 'Salad Nhà Gấu', category: 'cat_healthy', rating: 4.9, reviews: 77,
    distanceKm: 1.8, walkMinutes: 22, address: 'Số 8 Lý Thái Tổ, P. Võ Cường, TP. Bắc Ninh',
    phone: '0912 345 005', pickupWindowToday: '17:00 – 18:30', bagsLeft: 2, art: 'salad' },
  { id: 'res_06', name: 'Chè Sen Bà Tâm', category: 'cat_dessert', rating: 4.5, reviews: 204,
    distanceKm: 0.9, walkMinutes: 11, address: 'Số 5 Hoàng Quốc Việt, P. Vũ Ninh, TP. Bắc Ninh',
    phone: '0912 345 006', pickupWindowToday: '19:30 – 20:30', bagsLeft: 3, art: 'dessert' },
];

const FOOD_BAGS = [
  { id: 'bag_01', restaurantId: 'res_01', name: 'Túi cơm chiều',
    summary: 'Cơm + 2 món mặn + canh', originalPrice: 56000, price: 45000, left: 3,
    pickupWindow: '18:00 – 20:00', art: 'rice',
    contents: ['Cơm trắng hoặc cơm gạo lứt', '2 món mặn thay đổi theo ngày',
               '1 món rau xào hoặc luộc', '1 phần canh', 'Kèm hộp giấy phân huỷ được'],
    allergens: { peanut: true, seafood: true, gluten: 'maybe', dairy: false, egg: false, spicy: false } },
  { id: 'bag_02', restaurantId: 'res_01', name: 'Túi chay thanh đạm',
    summary: 'Cơm gạo lứt + 3 món chay', originalPrice: 48000, price: 38000, left: 1,
    pickupWindow: '18:00 – 20:00', art: 'salad',
    contents: ['Cơm gạo lứt', '3 món chay theo ngày', 'Canh rau củ'],
    allergens: { peanut: true, seafood: false, gluten: 'maybe', dairy: false, egg: false, spicy: false } },
  { id: 'bag_03', restaurantId: 'res_01', name: 'Túi bất ngờ cuối ngày',
    summary: 'Món còn lại trong bếp', originalPrice: 45000, price: 29000, left: 1,
    pickupWindow: '20:00 – 21:00', art: 'clay', lastCall: true,
    contents: ['Các món bếp còn lại trong ngày'],
    allergens: { peanut: true, seafood: true, gluten: 'maybe', dairy: false, egg: false, spicy: false } },
  { id: 'bag_04', restaurantId: 'res_03', name: 'Túi bún bò cay',
    summary: 'Bún bò + rau sống', originalPrice: 55000, price: 45000, left: 3,
    pickupWindow: '17:30 – 19:00', art: 'noodle',
    contents: ['Bún bò', 'Rau sống', 'Nước dùng đóng riêng'],
    allergens: { peanut: false, seafood: true, gluten: true, dairy: false, egg: false, spicy: true } },
  { id: 'bag_05', restaurantId: 'res_05', name: 'Túi salad chiều',
    summary: 'Salad + ức gà + sốt', originalPrice: 65000, price: 52000, left: 2,
    pickupWindow: '17:00 – 18:30', art: 'salad',
    contents: ['Salad rau củ', 'Ức gà áp chảo', 'Sốt mè rang'],
    allergens: { peanut: true, seafood: false, gluten: false, dairy: true, egg: true, spicy: false } },
  { id: 'bag_06', restaurantId: 'res_06', name: 'Túi tráng miệng',
    summary: 'Chè sen + hoa quả', originalPrice: 30000, price: 25000, left: 3,
    pickupWindow: '19:30 – 20:30', art: 'dessert',
    contents: ['Chè hạt sen', 'Hoa quả theo mùa'],
    allergens: { peanut: false, seafood: false, gluten: false, dairy: true, egg: false, spicy: false } },
];

const PICKUP_SLOTS = [
  { id: 'slot_1', label: '18:00 – 18:30', left: 3 },
  { id: 'slot_2', label: '18:30 – 19:00', left: 2, selected: true },
  { id: 'slot_3', label: '19:00 – 19:30', left: 0 },
  { id: 'slot_4', label: '19:30 – 20:00', left: 5 },
];

const PROMOS = [
  { code: 'ECOBITE10K', label: 'Giảm 10.000đ', minTotal: 80000, amount: 10000, expires: '20/09', usable: true },
  { code: 'CHAY15',     label: 'Giảm 15% tối đa 20.000đ', minTotal: 0, percent: 15, cap: 20000,
    expires: '30/09', usable: true, onlyVegan: true },
  { code: 'ECOBITE30K', label: 'Giảm 30.000đ', minTotal: 150000, amount: 30000, expires: '25/09', usable: false },
];

/* Trạng thái đơn — 6 bước, KHÔNG có bước nào liên quan tới giao hàng */
const ORDER_STATUS = [
  { key: 'PLACED',       label: 'Đã đặt hàng',         actor: 'Khách' },
  { key: 'PAID',         label: 'Đã thanh toán',       actor: 'Hệ thống (webhook ngân hàng)' },
  { key: 'PREPARING',    label: 'Quán đang chuẩn bị',  actor: 'Nhà hàng' },
  { key: 'READY',        label: 'Sẵn sàng nhận hàng',  actor: 'Nhà hàng' },
  { key: 'QR_VERIFIED',  label: 'QR đã được xác nhận', actor: 'Nhân viên quán quét mã' },
  { key: 'COMPLETED',    label: 'Đã nhận hàng',        actor: 'Khách' },
];

/* BẢN DEMO — số tài khoản hoàn toàn giả lập, không phải tài khoản có thật */
const DEMO_PAYMENT = {
  bank: 'Vietcombank (demo)',
  accountName: 'CTY TNHH ECOBITE',
  accountNumber: '0000 1234 5678',
  transferNote: 'EB2409017',
  isDemo: true,
};

const ORDERS = [
  { id: 'EB-2409-017', restaurantId: 'res_01', bagId: 'bag_01', qty: 2,
    subtotal: 90000, discount: 14000, deliveryFee: null, total: 76000,
    pickupSlot: '18:30 – 19:00', date: '2026-09-14', status: 'READY',
    paymentMethod: 'Chuyển khoản QR', ownBox: true },
  { id: 'EB-2409-014', restaurantId: 'res_05', bagId: 'bag_05', qty: 1,
    subtotal: 65000, discount: 13000, deliveryFee: null, total: 52000,
    pickupSlot: '18:00 – 18:30', date: '2026-09-12', status: 'COMPLETED',
    paymentMethod: 'Chuyển khoản QR', pickedUpAt: '18:10' },
  { id: 'EB-2409-009', restaurantId: 'res_06', bagId: 'bag_06', qty: 2,
    subtotal: 60000, discount: 10000, deliveryFee: null, total: 50000,
    pickupSlot: '19:30 – 20:00', date: '2026-09-09', status: 'COMPLETED',
    paymentMethod: 'Ví EcoBite', pickedUpAt: '19:22' },
  { id: 'EB-2409-011', restaurantId: 'res_02', bagId: null, qty: 1,
    subtotal: 60000, discount: 0, deliveryFee: null, total: 60000,
    pickupSlot: '17:30 – 18:00', date: '2026-09-10', status: 'CANCELLED',
    cancelReason: 'Không tới kịp giờ', refunded: 60000 },
];

const AI_MOCK = {
  greeting: 'Chào Dương! Bạn muốn ăn gì hôm nay?',
  quickPrompts: ['Hôm nay ăn gì?', 'Món cay, giá rẻ?', 'Ăn healthy?', 'Gợi ý cho tôi'],
  sampleQuestion: 'Hôm nay tôi muốn ăn cay và rẻ',
  sampleAnswer: {
    bagId: 'bag_04',
    reasons: ['Có vị cay đậm, đúng khẩu vị bạn vừa nói',
              '45.000đ — nằm trong ngân sách dưới 50k',
              'Quán gần bạn nhất (0.8 km) và còn 3 túi',
              'Khung giờ nhận 17:30 – 19:00, bạn còn kịp'],
  },
  note: 'AI trong bản này là GIAO DIỆN MÔ PHỎNG. Không gọi mô hình AI thật.',
};

if (typeof window !== 'undefined') {
  window.ECOBITE_MOCK = { CONFIG, USER, CATEGORIES, RESTAURANTS, FOOD_BAGS, PICKUP_SLOTS,
                          PROMOS, ORDER_STATUS, DEMO_PAYMENT, ORDERS, AI_MOCK };
}
