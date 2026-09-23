/* ==========================================================================
   EcoBite · navigation.js
   Bảng định tuyến giữa 82 màn + hàm nối sự kiện cho một màn đang hiển thị.
   Chạy được cả trong vỏ prototype (index.html) và trong từng file màn riêng.
   ========================================================================== */

const SCREENS = {
 "1.1": {
  "id": "01-01-splash",
  "file": "screens/group-01/01-01-splash.html",
  "group": 1,
  "name": "Màn khởi động",
  "note": "Hiện 1,5 giây trong lúc app kiểm tra phiên đăng nhập, rồi tự chuyển.",
  "mvp": 1
 },
 "1.2": {
  "id": "01-02-onboarding-value",
  "file": "screens/group-01/01-02-onboarding-value.html",
  "group": 1,
  "name": "Giới thiệu 1 — Ăn ngon, giá tốt",
  "note": "Bước đầu của chuỗi 3 màn giới thiệu. Nút “Bỏ qua” nhảy thẳng tới 1.5.",
  "mvp": 2
 },
 "1.3": {
  "id": "01-03-onboarding-impact",
  "file": "screens/group-01/01-03-onboarding-impact.html",
  "group": 1,
  "name": "Giới thiệu 2 — Giảm lãng phí",
  "note": "Bước 2. Nói về giá trị môi trường — phần lõi của đề tài nghiên cứu.",
  "mvp": 0
 },
 "1.4": {
  "id": "01-04-onboarding-ai",
  "file": "screens/group-01/01-04-onboarding-ai.html",
  "group": 1,
  "name": "Giới thiệu 3 — Trợ lý AI",
  "note": "Bước 3, giới thiệu quả cầu AI. Nút chuyển thành “Bắt đầu” và đi tới 1.5.",
  "mvp": 0
 },
 "1.5": {
  "id": "01-05-welcome",
  "file": "screens/group-01/01-05-welcome.html",
  "group": 1,
  "name": "Chào mừng — chọn cách vào",
  "note": "Ngã ba tài khoản. Có đăng nhập nhanh bằng Google / Apple, và lối “Xem trước không cần tài khoản”.",
  "mvp": 0
 },
 "1.6": {
  "id": "01-06-login",
  "file": "screens/group-01/01-06-login.html",
  "group": 1,
  "name": "Đăng nhập",
  "note": "LƯU Ý LUỒNG: đăng nhập thành công phải vào thẳng Trang chủ, không được nhảy sang màn đăng ký.",
  "mvp": 3
 },
 "1.7": {
  "id": "01-07-register",
  "file": "screens/group-01/01-07-register.html",
  "group": 1,
  "name": "Đăng ký",
  "note": "Tạo tài khoản mới. Bắt buộc tick điều khoản trước khi nút bật sáng.",
  "mvp": 0
 },
 "1.8": {
  "id": "01-08-otp-verification",
  "file": "screens/group-01/01-08-otp-verification.html",
  "group": 1,
  "name": "Xác thực OTP",
  "note": "Dùng chung cho đăng ký và quên mật khẩu. Đếm ngược 60 giây rồi mới cho gửi lại.",
  "mvp": 0
 },
 "1.9": {
  "id": "01-09-reset-password",
  "file": "screens/group-01/01-09-reset-password.html",
  "group": 1,
  "name": "Quên mật khẩu → Đặt lại",
  "note": "Hai bước gộp một luồng: nhập email để nhận mã (1.8), rồi quay lại đây đặt mật khẩu mới.",
  "mvp": 0
 },
 "2.1": {
  "id": "02-01-location-permission",
  "file": "screens/group-02/02-01-location-permission.html",
  "group": 2,
  "name": "Xin quyền vị trí",
  "note": "Giải thích TRƯỚC khi bật hộp thoại hệ thống. Vị trí chỉ để tìm quán gần, không dùng cho giao hàng.",
  "mvp": 4
 },
 "2.2": {
  "id": "02-02-select-location",
  "file": "screens/group-02/02-02-select-location.html",
  "group": 2,
  "name": "Chọn khu vực",
  "note": "Triển khai thí điểm ở Bắc Ninh trước. Huyện chưa có quán hiển thị mờ và ghi “Sắp mở”.",
  "mvp": 5
 },
 "2.3": {
  "id": "02-03-current-location",
  "file": "screens/group-02/02-03-current-location.html",
  "group": 2,
  "name": "Vị trí hiện tại",
  "note": "Xác nhận khu vực đã bắt được. Ghi rõ vị trí chỉ để tìm quán gần — không phải địa chỉ giao hàng.",
  "mvp": 0
 },
 "2.4": {
  "id": "02-04-search-location",
  "file": "screens/group-02/02-04-search-location.html",
  "group": 2,
  "name": "Tìm khu vực",
  "note": "Bàn phím đang mở, gợi ý lọc theo chữ vừa gõ. Có mục “Gần đây” cho lần sau.",
  "mvp": 0
 },
 "3.1": {
  "id": "03-01-home",
  "file": "screens/group-03/03-01-home.html",
  "group": 3,
  "name": "Trang chủ",
  "note": "Màn bạn đã duyệt. Quả cầu AI kéo thả được, cuộn xem đủ 6 nhà hàng.",
  "mvp": 6
 },
 "3.2": {
  "id": "03-02-all-categories",
  "file": "screens/group-03/03-02-all-categories.html",
  "group": 3,
  "name": "Tất cả danh mục",
  "note": "Mở từ nút “Tất cả” ở trang chủ. Hiện số quán đang có túi trong từng danh mục.",
  "mvp": 0
 },
 "3.3": {
  "id": "03-03-category-results",
  "file": "screens/group-03/03-03-category-results.html",
  "group": 3,
  "name": "Kết quả theo danh mục",
  "note": "Vào từ 3.2 hoặc từ hàng danh mục ở trang chủ. Giữ nguyên thanh lọc + sắp xếp.",
  "mvp": 0
 },
 "3.4": {
  "id": "03-04-search",
  "file": "screens/group-03/03-04-search.html",
  "group": 3,
  "name": "Tìm kiếm — trước khi gõ",
  "note": "Mở từ ô tìm kiếm trang chủ. Gợi ý lịch sử và từ khoá đang được tìm nhiều.",
  "mvp": 0
 },
 "3.5": {
  "id": "03-05-search-results",
  "file": "screens/group-03/03-05-search-results.html",
  "group": 3,
  "name": "Kết quả tìm kiếm",
  "note": "Có cả nhà hàng và túi khớp từ khoá. Nếu không có kết quả sẽ chuyển sang trạng thái rỗng kèm gợi ý AI.",
  "mvp": 7
 },
 "3.6": {
  "id": "03-06-filter",
  "file": "screens/group-03/03-06-filter.html",
  "group": 3,
  "name": "Bộ lọc",
  "note": "Tấm trượt từ dưới lên, nền sau mờ đi. Nút “Đặt lại” xoá mọi lựa chọn.",
  "mvp": 0
 },
 "3.7": {
  "id": "03-07-sort",
  "file": "screens/group-03/03-07-sort.html",
  "group": 3,
  "name": "Sắp xếp",
  "note": "Tấm trượt ngắn, chọn một trong năm cách. Chọn xong đóng ngay và danh sách tự xếp lại.",
  "mvp": 0
 },
 "3.8": {
  "id": "03-08-restaurant-map",
  "file": "screens/group-03/03-08-restaurant-map.html",
  "group": 3,
  "name": "Bản đồ nhà hàng",
  "note": "Xem quán theo vị trí thay vì danh sách. Ghim màu cam là túi sắp hết giờ nhận.",
  "mvp": 0
 },
 "3.9": {
  "id": "03-09-notifications",
  "file": "screens/group-03/03-09-notifications.html",
  "group": 3,
  "name": "Thông báo",
  "note": "Ba loại: đơn hàng, túi mới gần bạn, và thành tích. Chưa đọc có chấm xanh bên phải.",
  "mvp": 0
 },
 "3.10": {
  "id": "03-10-saved-restaurants",
  "file": "screens/group-03/03-10-saved-restaurants.html",
  "group": 3,
  "name": "Nhà hàng đã lưu",
  "note": "Mở từ tab Tài khoản. Nếu chưa lưu quán nào thì hiện trạng thái rỗng kèm nút về trang chủ.",
  "mvp": 0
 },
 "4.1": {
  "id": "04-01-restaurant-detail",
  "file": "screens/group-04/04-01-restaurant-detail.html",
  "group": 4,
  "name": "Chi tiết nhà hàng",
  "note": "Ảnh bìa lớn, thông tin quán, rồi tới danh sách túi. Nút tim để lưu quán.",
  "mvp": 8
 },
 "4.2": {
  "id": "04-02-restaurant-bags",
  "file": "screens/group-04/04-02-restaurant-bags.html",
  "group": 4,
  "name": "Menu túi của quán",
  "note": "Danh sách đầy đủ, chia theo khung giờ nhận. Túi hết hiển thị mờ và không bấm được.",
  "mvp": 0
 },
 "4.3": {
  "id": "04-03-restaurant-reviews",
  "file": "screens/group-04/04-03-restaurant-reviews.html",
  "group": 4,
  "name": "Đánh giá nhà hàng",
  "note": "Chỉ khách đã nhận hàng mới đánh giá được, nên mỗi nhận xét kèm tên túi đã mua.",
  "mvp": 0
 },
 "4.4": {
  "id": "04-04-restaurant-info",
  "file": "screens/group-04/04-04-restaurant-info.html",
  "group": 4,
  "name": "Thông tin nhà hàng",
  "note": "Địa chỉ, khung giờ nhận theo ngày, và các cam kết của quán. Không có thông tin giao hàng.",
  "mvp": 0
 },
 "4.5": {
  "id": "04-05-photo-gallery",
  "file": "screens/group-04/04-05-photo-gallery.html",
  "group": 4,
  "name": "Thư viện ảnh",
  "note": "Ảnh quán và ảnh túi thật do quán đăng, cộng ảnh khách chụp khi nhận hàng.",
  "mvp": 0
 },
 "4.6": {
  "id": "04-06-directions",
  "file": "screens/group-04/04-06-directions.html",
  "group": 4,
  "name": "Chỉ đường tới quán",
  "note": "Mở từ nút Chỉ đường. Có nút chuyển sang Google Maps nếu khách muốn dẫn đường từng bước.",
  "mvp": 0
 },
 "4.7": {
  "id": "04-07-report-restaurant",
  "file": "screens/group-04/04-07-report-restaurant.html",
  "group": 4,
  "name": "Báo cáo nhà hàng",
  "note": "Lối thoát khi có sự cố: túi không đúng mô tả, quán đóng cửa, đồ ăn có vấn đề.",
  "mvp": 0
 },
 "5.1": {
  "id": "05-01-food-bag-detail",
  "file": "screens/group-05/05-01-food-bag-detail.html",
  "group": 5,
  "name": "Chi tiết túi",
  "note": "Màn quyết định mua. Đếm ngược thời gian còn lại và số túi còn để tạo lý do đặt sớm.",
  "mvp": 9
 },
 "5.2": {
  "id": "05-02-bag-contents",
  "file": "screens/group-05/05-02-bag-contents.html",
  "group": 5,
  "name": "Túi hôm nay gồm gì",
  "note": "Quán cập nhật trước 16:00 mỗi ngày. Nếu chưa cập nhật thì hiện dòng “Bất ngờ cuối ngày”.",
  "mvp": 0
 },
 "5.3": {
  "id": "05-03-select-pickup-time",
  "file": "screens/group-05/05-03-select-pickup-time.html",
  "group": 5,
  "name": "Chọn khung giờ nhận",
  "note": "Chọn ngay khi thêm túi vào giỏ, để quán biết lúc nào phải đóng gói xong.",
  "mvp": 13
 },
 "5.4": {
  "id": "05-04-allergens",
  "file": "screens/group-05/05-04-allergens.html",
  "group": 5,
  "name": "Nguyên liệu & dị ứng",
  "note": "Bắt buộc với mọi túi. Quán tự khai báo, EcoBite hiển thị nguyên văn kèm miễn trừ.",
  "mvp": 0
 },
 "5.5": {
  "id": "05-05-bag-impact",
  "file": "screens/group-05/05-05-bag-impact.html",
  "group": 5,
  "name": "Tác động của túi này",
  "note": "Biến con số môi trường thành thứ dễ hình dung — phần ăn điểm khi chấm đề tài.",
  "mvp": 0
 },
 "5.6": {
  "id": "05-06-add-to-cart",
  "file": "screens/group-05/05-06-add-to-cart.html",
  "group": 5,
  "name": "Chọn số lượng",
  "note": "Tấm trượt khi bấm “Thêm vào giỏ”. Không cho vượt quá số túi quán còn.",
  "mvp": 10
 },
 "5.7": {
  "id": "05-07-bag-unavailable",
  "file": "screens/group-05/05-07-bag-unavailable.html",
  "group": 5,
  "name": "Túi đã hết / ngoài giờ",
  "note": "Ngõ cụt duy nhất trong luồng mua — phải luôn có lối đi tiếp, không để người dùng mắc kẹt.",
  "mvp": 0
 },
 "6.1": {
  "id": "06-01-cart",
  "file": "screens/group-06/06-01-cart.html",
  "group": 6,
  "name": "Giỏ hàng",
  "note": "Túi từ nhiều quán được gom theo quán, vì mỗi quán là một điểm lấy hàng riêng.",
  "mvp": 11
 },
 "6.2": {
  "id": "06-02-cart-empty",
  "file": "screens/group-06/06-02-cart-empty.html",
  "group": 6,
  "name": "Giỏ hàng trống",
  "note": "Không để màn trắng — luôn có lối quay lại trang chủ và lối hỏi AI.",
  "mvp": 0
 },
 "6.3": {
  "id": "06-03-remove-item",
  "file": "screens/group-06/06-03-remove-item.html",
  "group": 6,
  "name": "Xoá túi khỏi giỏ",
  "note": "Hộp xác nhận khi giảm số lượng về 0 hoặc vuốt sang trái để xoá.",
  "mvp": 0
 },
 "6.4": {
  "id": "06-04-checkout",
  "file": "screens/group-06/06-04-checkout.html",
  "group": 6,
  "name": "Xác nhận đơn — nhận tại quán",
  "note": "Màn thay cho Checkout cũ. KHÔNG có địa chỉ giao, KHÔNG có phí giao — chỉ có điểm lấy.",
  "mvp": 12
 },
 "6.5": {
  "id": "06-05-promo-code",
  "file": "screens/group-06/06-05-promo-code.html",
  "group": 6,
  "name": "Mã giảm giá",
  "note": "Danh sách mã đang có, mã không đủ điều kiện hiển thị mờ kèm lý do.",
  "mvp": 0
 },
 "6.6": {
  "id": "06-06-change-pickup-time",
  "file": "screens/group-06/06-06-change-pickup-time.html",
  "group": 6,
  "name": "Đổi giờ tới lấy",
  "note": "Đổi tên từ “Chọn giờ giao hàng”. Đổi giờ ở đây phải báo lại cho quán, nên có cảnh báo.",
  "mvp": 0
 },
 "6.7": {
  "id": "06-07-order-summary",
  "file": "screens/group-06/06-07-order-summary.html",
  "group": 6,
  "name": "Tóm tắt đơn hàng",
  "note": "Bản xem lại cuối cùng: địa chỉ QUÁN + khung giờ nhận, không có dòng phí giao hàng.",
  "mvp": 14
 },
 "6.8": {
  "id": "06-08-payment-method",
  "file": "screens/group-06/06-08-payment-method.html",
  "group": 6,
  "name": "Chọn cách thanh toán",
  "note": "Chuyển khoản QR là cách chính. Tiền mặt tại quán để dự phòng khi mạng lỗi.",
  "mvp": 0
 },
 "6.9": {
  "id": "06-09-creating-order",
  "file": "screens/group-06/06-09-creating-order.html",
  "group": 6,
  "name": "Đang tạo đơn",
  "note": "Màn chuyển tiếp 1–2 giây trong lúc server giữ chỗ túi và sinh mã đơn.",
  "mvp": 0
 },
 "7.1": {
  "id": "07-01-qr-payment",
  "file": "screens/group-07/07-01-qr-payment.html",
  "group": 7,
  "name": "QR chuyển khoản",
  "note": "QR NÀY KHÁCH QUÉT bằng app ngân hàng. Mọi số tài khoản là số giả lập cho bản demo.",
  "mvp": 15
 },
 "7.2": {
  "id": "07-02-waiting-payment",
  "file": "screens/group-07/07-02-waiting-payment.html",
  "group": 7,
  "name": "Đang chờ nhận tiền",
  "note": "Thay cho nút “Tôi đã chuyển khoản”. App tự hỏi server 3 giây một lần cho tới khi ngân hàng báo có.",
  "mvp": 0
 },
 "7.3": {
  "id": "07-03-payment-success",
  "file": "screens/group-07/07-03-payment-success.html",
  "group": 7,
  "name": "Thanh toán thành công",
  "note": "Tự hiện khi server xác nhận. Nút chính dẫn thẳng sang MÃ QR NHẬN HÀNG (8.3), không phải theo dõi giao hàng.",
  "mvp": 16
 },
 "7.4": {
  "id": "07-04-payment-failed",
  "file": "screens/group-07/07-04-payment-failed.html",
  "group": 7,
  "name": "Thanh toán thất bại",
  "note": "Giữ nguyên đơn và túi trong 5 phút để khách thử lại, thay vì bắt đặt lại từ đầu.",
  "mvp": 0
 },
 "7.5": {
  "id": "07-05-payment-expired",
  "file": "screens/group-07/07-05-payment-expired.html",
  "group": 7,
  "name": "Hết hạn giữ chỗ",
  "note": "Khi quá thời gian giữ túi mà chưa có tiền về. Túi được trả lại cho khách khác.",
  "mvp": 0
 },
 "7.6": {
  "id": "07-06-wallet-cards",
  "file": "screens/group-07/07-06-wallet-cards.html",
  "group": 7,
  "name": "Ví & thẻ đã lưu",
  "note": "Toàn bộ số thẻ trên màn là số giả lập, chỉ hiện 4 số cuối. App không lưu số thẻ thật.",
  "mvp": 0
 },
 "7.7": {
  "id": "07-07-invoice",
  "file": "screens/group-07/07-07-invoice.html",
  "group": 7,
  "name": "Hoá đơn điện tử",
  "note": "Mở từ chi tiết đơn. Xuất được PDF để dùng cho việc thanh toán công tác phí.",
  "mvp": 0
 },
 "8.1": {
  "id": "08-01-pickup-instructions",
  "file": "screens/group-08/08-01-pickup-instructions.html",
  "group": 8,
  "name": "Đặt hàng thành công",
  "note": "Màn đầu sau khi trả tiền. Nhấn mạnh việc PHẢI TỚI QUÁN, kèm đếm ngược tới hạn nhận.",
  "mvp": 18
 },
 "8.2": {
  "id": "08-02-pickup-order-status",
  "file": "screens/group-08/08-02-pickup-order-status.html",
  "group": 8,
  "name": "Trạng thái đơn nhận tại quán",
  "note": "Đổi tên từ Order Tracking. Sáu bước, KHÔNG có bước nào liên quan tới tài xế.",
  "mvp": 0
 },
 "8.3": {
  "id": "08-03-pickup-qr-code",
  "file": "screens/group-08/08-03-pickup-qr-code.html",
  "group": 8,
  "name": "Mã QR nhận hàng",
  "note": "QR NÀY NHÂN VIÊN QUÁN QUÉT — ngược chiều với QR thanh toán ở 7.1. Nội dung là mã đơn, không phải mã ngân hàng.",
  "mvp": 17
 },
 "8.4": {
  "id": "08-04-order-ready",
  "file": "screens/group-08/08-04-order-ready.html",
  "group": 8,
  "name": "Thông báo sẵn sàng nhận",
  "note": "Đẩy tới điện thoại lúc quán bấm “Đã chuẩn bị xong”. Chạm vào là mở thẳng màn QR 8.3.",
  "mvp": 19
 },
 "8.5": {
  "id": "08-05-arriving-at-restaurant",
  "file": "screens/group-08/08-05-arriving-at-restaurant.html",
  "group": 8,
  "name": "Đang trên đường tới quán",
  "note": "Bản chỉ đường gắn với đơn: có đếm ngược hạn nhận và nút mở QR ngay trên bản đồ.",
  "mvp": 20
 },
 "8.6": {
  "id": "08-06-qr-verified",
  "file": "screens/group-08/08-06-qr-verified.html",
  "group": 8,
  "name": "QR đã được xác nhận",
  "note": "Hiện ngay trên máy khách sau khi nhân viên quét thành công. Bước 5 của chuỗi trạng thái.",
  "mvp": 21
 },
 "8.7": {
  "id": "08-07-order-completed",
  "file": "screens/group-08/08-07-order-completed.html",
  "group": 8,
  "name": "Đã nhận hàng tại quán",
  "note": "Bước cuối. Cộng thành tích môi trường và mời đánh giá — chỉ ở đây mới mở được 9.7.",
  "mvp": 22
 },
 "8.8": {
  "id": "08-08-cancel-order",
  "file": "screens/group-08/08-08-cancel-order.html",
  "group": 8,
  "name": "Huỷ đơn",
  "note": "Chỉ huỷ được trước khi quán bấm “Đang chuẩn bị”. Sau đó phải liên hệ hỗ trợ.",
  "mvp": 0
 },
 "9.1": {
  "id": "09-01-order-history",
  "file": "screens/group-09/09-01-order-history.html",
  "group": 9,
  "name": "Danh sách đơn hàng",
  "note": "Tab Đơn hàng ở thanh dưới. Ba thẻ: Đang xử lý, Đã xong, Đã huỷ.",
  "mvp": 23
 },
 "9.2": {
  "id": "09-02-orders-active",
  "file": "screens/group-09/09-02-orders-active.html",
  "group": 9,
  "name": "Đơn đang xử lý",
  "note": "Lọc chỉ đơn chưa nhận. Mỗi thẻ có lối tắt tới QR và chỉ đường.",
  "mvp": 0
 },
 "9.3": {
  "id": "09-03-orders-completed",
  "file": "screens/group-09/09-03-orders-completed.html",
  "group": 9,
  "name": "Đơn đã hoàn tất",
  "note": "Có tổng thành tích của cả nhóm đơn — nối với màn 10.3.",
  "mvp": 0
 },
 "9.4": {
  "id": "09-04-orders-cancelled",
  "file": "screens/group-09/09-04-orders-cancelled.html",
  "group": 9,
  "name": "Đơn đã huỷ",
  "note": "Ghi rõ ai huỷ và tiền đã hoàn chưa — tránh tranh cãi khi demo.",
  "mvp": 0
 },
 "9.5": {
  "id": "09-05-order-detail",
  "file": "screens/group-09/09-05-order-detail.html",
  "group": 9,
  "name": "Chi tiết đơn cũ",
  "note": "Mở từ bất kỳ thẻ đơn nào. Có nút đặt lại và nút tải hoá đơn.",
  "mvp": 24
 },
 "9.6": {
  "id": "09-06-reorder",
  "file": "screens/group-09/09-06-reorder.html",
  "group": 9,
  "name": "Đặt lại nhanh",
  "note": "Kiểm tra túi còn hàng không rồi mới cho vào giỏ — không cho đặt lại thứ đã hết.",
  "mvp": 0
 },
 "9.7": {
  "id": "09-07-write-review",
  "file": "screens/group-09/09-07-write-review.html",
  "group": 9,
  "name": "Viết đánh giá",
  "note": "Chỉ mở được sau khi trạng thái là “Đã nhận hàng”. Đây là điều kiện chống đánh giá ảo.",
  "mvp": 0
 },
 "10.1": {
  "id": "10-01-profile",
  "file": "screens/group-10/10-01-profile.html",
  "group": 10,
  "name": "Hồ sơ",
  "note": "Trang gốc của tab Tài khoản. Thẻ thành tích đặt trên cùng vì đó là điểm nhấn của đề tài.",
  "mvp": 0
 },
 "10.2": {
  "id": "10-02-edit-profile",
  "file": "screens/group-10/10-02-edit-profile.html",
  "group": 10,
  "name": "Sửa thông tin cá nhân",
  "note": "Đổi số điện thoại phải xác thực lại OTP — nối về màn 1.8.",
  "mvp": 0
 },
 "10.3": {
  "id": "10-03-my-impact",
  "file": "screens/group-10/10-03-my-impact.html",
  "group": 10,
  "name": "Thành tích của bạn",
  "note": "Đổi tên từ “Tác động của bạn” theo góp ý. Đây là phần dễ ghi điểm nhất khi thuyết trình.",
  "mvp": 0
 },
 "10.4": {
  "id": "10-04-notification-settings",
  "file": "screens/group-10/10-04-notification-settings.html",
  "group": 10,
  "name": "Cài đặt thông báo",
  "note": "Tách riêng thông báo đơn hàng (nên luôn bật) và thông báo khuyến mãi.",
  "mvp": 0
 },
 "10.5": {
  "id": "10-05-settings",
  "file": "screens/group-10/10-05-settings.html",
  "group": 10,
  "name": "Cài đặt chung",
  "note": "Ngôn ngữ, giao diện sáng tối, quyền vị trí và xoá dữ liệu.",
  "mvp": 0
 },
 "10.6": {
  "id": "10-06-help",
  "file": "screens/group-10/10-06-help.html",
  "group": 10,
  "name": "Trợ giúp",
  "note": "Câu hỏi đầu tiên phải là “có giao hàng không” — vì đó là hiểu lầm phổ biến nhất về mô hình này.",
  "mvp": 0
 },
 "10.7": {
  "id": "10-07-contact-support",
  "file": "screens/group-10/10-07-contact-support.html",
  "group": 10,
  "name": "Liên hệ hỗ trợ",
  "note": "Gắn sẵn mã đơn đang gặp vấn đề để khách không phải gõ lại.",
  "mvp": 0
 },
 "10.8": {
  "id": "10-08-terms-privacy",
  "file": "screens/group-10/10-08-terms-privacy.html",
  "group": 10,
  "name": "Điều khoản & bảo mật",
  "note": "Nói rõ EcoBite là bên trung gian, không phải bên nấu ăn — quan trọng về mặt pháp lý.",
  "mvp": 0
 },
 "10.9": {
  "id": "10-09-logout",
  "file": "screens/group-10/10-09-logout.html",
  "group": 10,
  "name": "Đăng xuất",
  "note": "Hộp xác nhận, nhắc rõ đơn đang xử lý vẫn còn để khách không hoảng.",
  "mvp": 0
 },
 "11.1": {
  "id": "11-01-ai-orb",
  "file": "screens/group-11/11-01-ai-orb.html",
  "group": 11,
  "name": "Quả cầu AI nổi trên màn",
  "note": "Nổi trên mọi màn, kéo thả tới bất kỳ đâu. Ba gợi ý nhanh bung ra khi chạm giữ.",
  "mvp": 0
 },
 "11.2": {
  "id": "11-02-ai-welcome",
  "file": "screens/group-11/11-02-ai-welcome.html",
  "group": 11,
  "name": "Mở trợ lý AI",
  "note": "Chạm quả cầu là mở. Bốn câu gợi ý để người dùng không phải nghĩ nên hỏi gì.",
  "mvp": 0
 },
 "11.3": {
  "id": "11-03-ai-typing",
  "file": "screens/group-11/11-03-ai-typing.html",
  "group": 11,
  "name": "Đang nhập câu hỏi",
  "note": "Bàn phím mở, câu hỏi gõ bằng lời thường. Không cần từ khoá đặc biệt.",
  "mvp": 0
 },
 "11.4": {
  "id": "11-04-ai-suggestions",
  "file": "screens/group-11/11-04-ai-suggestions.html",
  "group": 11,
  "name": "AI trả lời kèm lý do",
  "note": "Điểm khác biệt của đề tài: mỗi gợi ý phải nói RÕ VÌ SAO, không chỉ liệt kê món.",
  "mvp": 0
 },
 "11.5": {
  "id": "11-05-ai-history",
  "file": "screens/group-11/11-05-ai-history.html",
  "group": 11,
  "name": "Lịch sử hội thoại AI",
  "note": "Xem lại các lần hỏi trước. Có nút xoá toàn bộ để tôn trọng quyền riêng tư.",
  "mvp": 0
 }
};
const ROUTES  = {
 "1.1": {
  "auto": [
   "1.2",
   1800
  ]
 },
 "1.2": {
  "next": "1.3",
  "txt": [
   [
    "Bỏ qua",
    "1.5"
   ]
  ]
 },
 "1.3": {
  "next": "1.4",
  "txt": [
   [
    "Bỏ qua",
    "1.5"
   ]
  ]
 },
 "1.4": {
  "next": "1.5",
  "txt": [
   [
    "Bỏ qua",
    "1.5"
   ]
  ]
 },
 "1.5": {
  "txt": [
   [
    "Đăng nhập",
    "1.6"
   ],
   [
    "Tạo tài khoản mới",
    "1.7"
   ],
   [
    "Xem trước không cần tài khoản",
    "3.1"
   ]
  ]
 },
 "1.6": {
  "back": "1.5",
  "next": "2.1",
  "txt": [
   [
    "Đăng ký ngay",
    "1.7"
   ],
   [
    "Quên mật khẩu?",
    "1.9"
   ]
  ]
 },
 "1.7": {
  "back": "1.5",
  "next": "1.8",
  "txt": [
   [
    "Đăng nhập",
    "1.6"
   ]
  ]
 },
 "1.8": {
  "back": "1.7",
  "next": "2.1"
 },
 "1.9": {
  "back": "1.6",
  "next": "1.6"
 },
 "2.1": {
  "next": "2.2",
  "txt": [
   [
    "Để sau, tôi tự chọn khu vực",
    "2.2"
   ]
  ]
 },
 "2.2": {
  "back": "2.1",
  "txt": [
   [
    "Dùng vị trí hiện tại",
    "2.3"
   ],
   [
    "Tìm quận, huyện",
    "2.4"
   ],
   [
    "Thành phố Bắc Ninh",
    "3.1"
   ],
   [
    "Thị xã Từ Sơn",
    "3.1"
   ]
  ]
 },
 "2.3": {
  "back": "2.2",
  "next": "3.1",
  "txt": [
   [
    "Đổi",
    "2.2"
   ]
  ]
 },
 "2.4": {
  "back": "2.2",
  "txt": [
   [
    "Từ Sơn",
    "3.1"
   ],
   [
    "Suối Hoa",
    "3.1"
   ]
  ]
 },
 "3.1": {
  "tabs": 1,
  "sel": [
   [
    ".nh",
    "4.1"
   ]
  ],
  "txt": [
   [
    "Tìm kiếm món ăn",
    "3.4"
   ],
   [
    "Xem tất cả",
    "3.2"
   ],
   [
    "Bắc Ninh",
    "2.2"
   ]
  ],
  "ai": 1
 },
 "3.2": {
  "back": "3.1",
  "tabs": 1,
  "txt": [
   [
    "Cơm",
    "3.3"
   ],
   [
    "Healthy",
    "3.3"
   ],
   [
    "Mì",
    "3.3"
   ]
  ],
  "ai": 1
 },
 "3.3": {
  "back": "3.2",
  "tabs": 1,
  "sel": [
   [
    ".ngang",
    "4.1"
   ]
  ],
  "txt": [
   [
    "Bộ lọc",
    "3.6"
   ],
   [
    "Gần nhất",
    "3.7"
   ]
  ],
  "ai": 1
 },
 "3.4": {
  "back": "3.1",
  "txt": [
   [
    "bún bò",
    "3.5"
   ],
   [
    "cơm văn phòng",
    "3.5"
   ],
   [
    "sắp hết giờ",
    "3.5"
   ]
  ]
 },
 "3.5": {
  "back": "3.4",
  "tabs": 1,
  "sel": [
   [
    ".ngang",
    "4.1"
   ]
  ],
  "txt": [
   [
    "Bộ lọc",
    "3.6"
   ],
   [
    "Phù hợp nhất",
    "3.7"
   ],
   [
    "Nhờ AI gợi ý món tương tự",
    "11.2"
   ]
  ]
 },
 "3.6": {
  "next": "3.5",
  "txt": [
   [
    "Đặt lại",
    "3.6"
   ]
  ]
 },
 "3.7": {
  "txt": [
   [
    "Phù hợp nhất",
    "3.5"
   ],
   [
    "Gần tôi nhất",
    "3.5"
   ],
   [
    "Giá thấp nhất",
    "3.5"
   ],
   [
    "Sắp hết giờ nhận",
    "3.5"
   ]
  ]
 },
 "3.8": {
  "back": "3.1",
  "sel": [
   [
    ".ngang",
    "4.1"
   ]
  ],
  "txt": [
   [
    "Xem dạng danh sách",
    "3.3"
   ]
  ]
 },
 "3.9": {
  "back": "3.1",
  "tabs": 1,
  "txt": [
   [
    "Túi của bạn đã sẵn sàng",
    "8.2"
   ],
   [
    "Bạn vừa cứu được 12 kg CO",
    "10.3"
   ]
  ]
 },
 "3.10": {
  "back": "10.1",
  "tabs": 1,
  "sel": [
   [
    ".ngang",
    "4.1"
   ]
  ],
  "ai": 1
 },
 "4.1": {
  "back": "3.1",
  "next": "4.2",
  "sel": [
   [
    ".ngang",
    "5.1"
   ]
  ],
  "txt": [
   [
    "Chỉ đường",
    "4.6"
   ],
   [
    "214 đánh giá",
    "4.3"
   ],
   [
    "Số 24 Nguyễn Văn Cừ",
    "4.4"
   ]
  ]
 },
 "4.2": {
  "back": "4.1",
  "sel": [
   [
    ".ngang",
    "5.1"
   ]
  ]
 },
 "4.3": {
  "back": "4.1"
 },
 "4.4": {
  "back": "4.1",
  "txt": [
   [
    "Chỉ đường",
    "4.6"
   ],
   [
    "Gọi quán",
    "4.4"
   ]
  ]
 },
 "4.5": {
  "back": "4.1"
 },
 "4.6": {
  "back": "4.1",
  "txt": [
   [
    "Mở Google Maps",
    "4.6"
   ]
  ]
 },
 "4.7": {
  "back": "4.1",
  "next": "4.1"
 },
 "5.1": {
  "back": "4.1",
  "next": "5.6",
  "txt": [
   [
    "Nguyên liệu & dị ứng",
    "5.4"
   ],
   [
    "Trong túi thường có",
    "5.2"
   ],
   [
    "kg CO",
    "5.5"
   ],
   [
    "Tới quán lấy 18:00",
    "5.3"
   ]
  ]
 },
 "5.2": {
  "back": "5.1",
  "next": "5.6"
 },
 "5.3": {
  "back": "6.4",
  "next": "6.7"
 },
 "5.4": {
  "back": "5.1"
 },
 "5.5": {
  "back": "5.1",
  "next": "5.6"
 },
 "5.6": {
  "next": "6.1",
  "qty": 1
 },
 "5.7": {
  "back": "4.1",
  "next": "11.2",
  "sel": [
   [
    ".ngang",
    "4.1"
   ]
  ]
 },
 "6.1": {
  "back": "3.1",
  "next": "6.4",
  "tabs": 1,
  "qty": 1,
  "txt": [
   [
    "Túi tráng miệng",
    "6.3"
   ]
  ]
 },
 "6.2": {
  "tabs": 1,
  "txt": [
   [
    "Khám phá nhà hàng gần bạn",
    "3.1"
   ],
   [
    "Hỏi AI xem nên ăn gì",
    "11.2"
   ]
  ]
 },
 "6.3": {
  "txt": [
   [
    "Xoá túi",
    "6.1"
   ],
   [
    "Giữ lại",
    "6.1"
   ]
  ]
 },
 "6.4": {
  "back": "6.1",
  "next": "6.8",
  "txt": [
   [
    "Thêm mã giảm giá",
    "6.5"
   ],
   [
    "Đổi",
    "5.3"
   ],
   [
    "Chỉ đường",
    "4.6"
   ]
  ]
 },
 "6.5": {
  "back": "6.4",
  "next": "6.4"
 },
 "6.6": {
  "back": "6.4",
  "next": "6.4"
 },
 "6.7": {
  "back": "6.4",
  "next": "6.9"
 },
 "6.8": {
  "back": "6.4",
  "next": "6.7"
 },
 "6.9": {
  "auto": [
   "7.1",
   1900
  ]
 },
 "7.1": {
  "back": "6.7",
  "auto": [
   "7.2",
   4200
  ],
  "pay": 1
 },
 "7.2": {
  "auto": [
   "7.3",
   5200
  ],
  "pay": 1,
  "txt": [
   [
    "Tôi cần trợ giúp",
    "10.7"
   ]
  ]
 },
 "7.3": {
  "next": "8.3",
  "txt": [
   [
    "Về trang chủ",
    "3.1"
   ]
  ]
 },
 "7.4": {
  "next": "7.1",
  "txt": [
   [
    "Đổi cách thanh toán",
    "6.8"
   ],
   [
    "Huỷ đơn",
    "8.8"
   ]
  ]
 },
 "7.5": {
  "next": "5.1",
  "txt": [
   [
    "Xem quán khác gần đây",
    "3.1"
   ]
  ]
 },
 "7.6": {
  "back": "10.1"
 },
 "7.7": {
  "back": "9.5"
 },
 "8.1": {
  "next": "8.2",
  "txt": [
   [
    "Mở mã nhận hàng",
    "8.3"
   ],
   [
    "Theo dõi trạng thái đơn",
    "8.2"
   ],
   [
    "Chỉ đường",
    "8.5"
   ]
  ]
 },
 "8.2": {
  "back": "9.1",
  "next": "8.3",
  "shop": 1,
  "txt": [
   [
    "Chỉ đường",
    "8.5"
   ]
  ]
 },
 "8.3": {
  "back": "8.2",
  "txt": [
   [
    "Máy quán hỏng",
    "10.7"
   ]
  ]
 },
 "8.4": {
  "tap": "8.3"
 },
 "8.5": {
  "back": "8.2",
  "next": "8.3",
  "shop": 1
 },
 "8.6": {
  "next": "8.7",
  "txt": [
   [
    "Có vấn đề với túi này",
    "4.7"
   ]
  ]
 },
 "8.7": {
  "next": "3.1",
  "tabs": 1,
  "txt": [
   [
    "Chạm để đánh giá",
    "9.7"
   ],
   [
    "Đặt lại túi này ngày mai",
    "9.6"
   ]
  ]
 },
 "8.8": {
  "back": "8.2",
  "next": "9.4",
  "txt": [
   [
    "Giữ đơn hàng",
    "8.2"
   ]
  ]
 },
 "9.1": {
  "tabs": 1,
  "sel": [
   [
    ".the-c",
    "9.5"
   ]
  ],
  "ai": 1,
  "txt": [
   [
    "Mở QR",
    "8.3"
   ],
   [
    "Đang xử lý",
    "9.2"
   ],
   [
    "Đã xong",
    "9.3"
   ],
   [
    "Đã huỷ",
    "9.4"
   ]
  ]
 },
 "9.2": {
  "back": "9.1",
  "tabs": 1,
  "txt": [
   [
    "Mã nhận hàng",
    "8.3"
   ],
   [
    "Chỉ đường",
    "8.5"
   ]
  ]
 },
 "9.3": {
  "back": "9.1",
  "tabs": 1,
  "sel": [
   [
    ".the-c",
    "9.5"
   ]
  ]
 },
 "9.4": {
  "back": "9.1",
  "tabs": 1
 },
 "9.5": {
  "back": "9.1",
  "next": "9.6",
  "txt": [
   [
    "Xem hoá đơn điện tử",
    "7.7"
   ],
   [
    "Báo cáo vấn đề với đơn",
    "4.7"
   ],
   [
    "Salad Nhà Gấu",
    "4.1"
   ]
  ]
 },
 "9.6": {
  "next": "6.1"
 },
 "9.7": {
  "back": "9.5",
  "next": "9.5"
 },
 "10.1": {
  "tabs": 1,
  "ai": 1,
  "txt": [
   [
    "Thành tích của bạn",
    "10.3"
   ],
   [
    "Đơn hàng của tôi",
    "9.1"
   ],
   [
    "Nhà hàng đã lưu",
    "3.10"
   ],
   [
    "Ví & thẻ thanh toán",
    "7.6"
   ],
   [
    "Mã giảm giá của tôi",
    "6.5"
   ],
   [
    "Thông báo",
    "10.4"
   ],
   [
    "Cài đặt chung",
    "10.5"
   ],
   [
    "Trợ giúp",
    "10.6"
   ],
   [
    "Điều khoản & bảo mật",
    "10.8"
   ],
   [
    "Đăng xuất",
    "10.9"
   ],
   [
    "Sửa",
    "10.2"
   ]
  ]
 },
 "10.2": {
  "back": "10.1",
  "next": "10.1"
 },
 "10.3": {
  "back": "10.1",
  "tabs": 1
 },
 "10.4": {
  "back": "10.1"
 },
 "10.5": {
  "back": "10.1"
 },
 "10.6": {
  "back": "10.1",
  "txt": [
   [
    "Liên hệ hỗ trợ",
    "10.7"
   ]
  ]
 },
 "10.7": {
  "back": "10.6",
  "next": "10.6"
 },
 "10.8": {
  "back": "10.1"
 },
 "10.9": {
  "txt": [
   [
    "Đăng xuất",
    "1.5"
   ],
   [
    "Ở lại",
    "10.1"
   ]
  ]
 },
 "11.1": {
  "tabs": 1,
  "ai": 1,
  "txt": [
   [
    "Hôm nay ăn gì?",
    "11.2"
   ],
   [
    "Món cay, giá rẻ?",
    "11.3"
   ],
   [
    "Ăn healthy?",
    "11.2"
   ]
  ]
 },
 "11.2": {
  "txt": [
   [
    "Hôm nay ăn gì?",
    "11.3"
   ],
   [
    "Món cay, giá rẻ?",
    "11.3"
   ],
   [
    "Ăn healthy?",
    "11.3"
   ],
   [
    "Gợi ý cho tôi",
    "11.3"
   ],
   [
    "Hỏi gì cũng được",
    "11.5"
   ]
  ]
 },
 "11.3": {
  "txt": [
   [
    "Gửi",
    "11.4"
   ],
   [
    "EcoBite AI",
    "11.5"
   ]
  ]
 },
 "11.4": {
  "txt": [
   [
    "Xem chi tiết món",
    "5.1"
   ],
   [
    "Túi cơm niêu cay",
    "5.1"
   ],
   [
    "Rẻ hơn nữa?",
    "11.4"
   ]
  ]
 },
 "11.5": {
  "back": "11.4",
  "txt": [
   [
    "Hội thoại mới",
    "11.2"
   ],
   [
    "Hôm nay tôi muốn ăn cay và rẻ",
    "11.4"
   ]
  ]
 }
};
const MVP_FLOW = [
 {
  "step": 1,
  "ma": "1.1",
  "en": "Splash"
 },
 {
  "step": 2,
  "ma": "1.2",
  "en": "Onboarding"
 },
 {
  "step": 3,
  "ma": "1.6",
  "en": "Login / Register"
 },
 {
  "step": 4,
  "ma": "2.1",
  "en": "Location Permission"
 },
 {
  "step": 5,
  "ma": "2.2",
  "en": "Select Location"
 },
 {
  "step": 6,
  "ma": "3.1",
  "en": "Home"
 },
 {
  "step": 7,
  "ma": "3.5",
  "en": "Search / Browse Restaurants"
 },
 {
  "step": 8,
  "ma": "4.1",
  "en": "Restaurant Detail"
 },
 {
  "step": 9,
  "ma": "5.1",
  "en": "Food Bag Detail"
 },
 {
  "step": 10,
  "ma": "5.6",
  "en": "Add to Cart"
 },
 {
  "step": 11,
  "ma": "6.1",
  "en": "Cart"
 },
 {
  "step": 12,
  "ma": "6.4",
  "en": "Checkout"
 },
 {
  "step": 13,
  "ma": "5.3",
  "en": "Select Pickup Time"
 },
 {
  "step": 14,
  "ma": "6.7",
  "en": "Order Summary"
 },
 {
  "step": 15,
  "ma": "7.1",
  "en": "QR Payment"
 },
 {
  "step": 16,
  "ma": "7.3",
  "en": "Payment Success"
 },
 {
  "step": 17,
  "ma": "8.3",
  "en": "Pickup QR Code"
 },
 {
  "step": 18,
  "ma": "8.1",
  "en": "Pickup Instructions"
 },
 {
  "step": 19,
  "ma": "8.4",
  "en": "Order Ready"
 },
 {
  "step": 20,
  "ma": "8.5",
  "en": "Customer Arrives at Restaurant"
 },
 {
  "step": 21,
  "ma": "8.6",
  "en": "QR Verified"
 },
 {
  "step": 22,
  "ma": "8.7",
  "en": "Order Completed"
 },
 {
  "step": 23,
  "ma": "9.1",
  "en": "Order History"
 },
 {
  "step": 24,
  "ma": "9.5",
  "en": "Order Detail"
 }
];

const TAB_TARGETS = ['3.1', '9.1', '6.1', '10.1'];   // Trang chủ · Đơn hàng · Giỏ · Tài khoản

function screenPath(ma, fromShell) {
  const s = SCREENS[ma];
  if (!s) return null;
  return fromShell ? s.file : '../group-' + String(s.group).padStart(2, '0') + '/' +
         s.id.split('-').slice(0).join('-') + '.html';
}

function money(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

/* --- tìm phần tử sâu nhất chứa đoạn chữ, rồi leo lên khối bấm được --- */
function deepestWithText(root, needle) {
  const all = root.querySelectorAll('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const t = el.textContent;
    if (!t || t.indexOf(needle) === -1) continue;
    let childHas = false;
    for (let j = 0; j < el.children.length; j++) {
      const c = el.children[j];
      if (c.textContent && c.textContent.indexOf(needle) !== -1) { childHas = true; break; }
    }
    if (!childHas) return el;
  }
  return null;
}

const CLICK_BLOCKS = '.dong,.the-c,.the-p,.vien-n,.ngang,.nh,.chip,.nut,button,.nhap,.tab div';

function liftToBlock(el, root) {
  let cur = el;
  for (let i = 0; i < 5 && cur && cur !== root; i++) {
    if (cur.matches && cur.matches(CLICK_BLOCKS)) return cur;
    cur = cur.parentElement;
  }
  return el;
}

function mark(el, target) {
  if (!el || !target) return;
  el.classList.add('bam');
  el.setAttribute('data-go', target);
}

/* --- nối toàn bộ tương tác cho một màn --- */
function wireScreen(ma, root, api) {
  const r = ROUTES[ma] || {};

  const back = root.querySelector('.nav .lui');
  if (back && r.back) mark(back, r.back);

  let primary = root.querySelector('.day .nut');
  if (!primary) {
    const btns = root.querySelectorAll('.nut');
    if (btns.length === 1) primary = btns[0];
  }
  if (primary && r.next) mark(primary, r.next);

  if (r.tabs) {
    const tabs = root.querySelectorAll('.tab > div');
    for (let i = 0; i < tabs.length && i < TAB_TARGETS.length; i++) mark(tabs[i], TAB_TARGETS[i]);
  }

  if (r.ai) {
    const orb = root.querySelector('.cau');
    if (orb) mark(orb, '11.2');
  }

  (r.sel || []).forEach(function (pair) {
    root.querySelectorAll(pair[0]).forEach(function (el) {
      if (!el.getAttribute('data-go')) mark(el, pair[1]);
    });
  });

  (r.txt || []).forEach(function (pair) {
    const hit = deepestWithText(root, pair[0]);
    if (hit) mark(liftToBlock(hit, root), pair[1]);
  });

  if (r.tap) {
    root.classList.add('bam');
    root.setAttribute('data-go', r.tap);
  }

  if (r.qty) wireQuantity(ma, root, api);

  if (r.auto && api.timer) api.timer(r.auto[0], r.auto[1]);
}

/* --- bộ tăng giảm số lượng --- */
function wireQuantity(ma, root, api) {
  const steppers = [];
  root.querySelectorAll('b').forEach(function (b) {
    if (!/^\d+$/.test((b.textContent || '').trim())) return;
    const prev = b.previousElementSibling, next = b.nextElementSibling;
    if (!prev || !next) return;
    if (prev.tagName !== 'SPAN' || next.tagName !== 'SPAN') return;
    if (!prev.querySelector('svg') || !next.querySelector('svg')) return;
    steppers.push({ minus: prev, num: b, plus: next });
  });

  steppers.forEach(function (s, idx) {
    s.minus.classList.add('bam');
    s.plus.classList.add('bam');
    s.minus.addEventListener('click', function (e) {
      e.stopPropagation();
      const v = Math.max(1, parseInt(s.num.textContent, 10) - 1);
      s.num.textContent = v; api.onQty && api.onQty(ma, idx, v, root);
    });
    s.plus.addEventListener('click', function (e) {
      e.stopPropagation();
      const v = Math.min(5, parseInt(s.num.textContent, 10) + 1);
      s.num.textContent = v; api.onQty && api.onQty(ma, idx, v, root);
    });
  });
}

if (typeof window !== 'undefined') {
  window.ECOBITE_NAV = { SCREENS, ROUTES, MVP_FLOW, TAB_TARGETS, wireScreen, money, screenPath };
}
