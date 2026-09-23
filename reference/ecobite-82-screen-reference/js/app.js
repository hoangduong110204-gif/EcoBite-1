/* ==========================================================================
   EcoBite · app.js
   Bộ điều khiển của vỏ prototype (index.html).
   Không có backend. Mọi hành vi thanh toán / nhà hàng đều là GIẢ LẬP.
   ========================================================================== */
(function () {
  var NAV = window.ECOBITE_NAV;
  var SCREENS = NAV.SCREENS, MVP = NAV.MVP_FLOW, money = NAV.money;

  var elSan   = document.getElementById('sanKhau');
  var elDs    = document.getElementById('danhSach');
  var elGhi   = document.getElementById('ghiChu');
  var elDemo  = document.getElementById('bangDemo');
  var elRay   = document.getElementById('rayMvp');
  var elThu   = document.getElementById('thietBi');

  var state = { ma: null, timer: null, orderStatus: 3, chiMvp: false };

  /* ---------------------------------------------------------- danh mục trái */
  function veDanhSach() {
    var out = '', nhomHienTai = 0;
    Object.keys(SCREENS).forEach(function (ma) {
      var s = SCREENS[ma];
      if (state.chiMvp && !s.mvp) return;
      if (s.group !== nhomHienTai) {
        nhomHienTai = s.group;
        out += '<h5>' + nhomHienTai + ' · ' + GROUP_VI[nhomHienTai - 1] + '</h5>';
      }
      out += '<a data-ma="' + ma + '"' + (ma === state.ma ? ' aria-current="true"' : '') + '>' +
             '<span class="ma">' + ma + '</span>' +
             '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
             s.name + '</span>' +
             (s.mvp ? '<span class="mv">' + s.mvp + '</span>' : '') + '</a>';
    });
    elDs.innerHTML = out;
  }

  var GROUP_VI = ['Chào mừng & Tài khoản', 'Vị trí', 'Trang chủ & Khám phá', 'Nhà hàng', 'Túi đồ ăn',
                  'Giỏ hàng & Đặt đơn', 'Thanh toán', 'Nhận hàng tại quán', 'Lịch sử đơn',
                  'Tài khoản', 'Trợ lý AI'];

  /* ---------------------------------------------------------- hiển thị màn */
  function go(ma) {
    if (!SCREENS[ma]) return;
    if (state.timer) { clearTimeout(state.timer); state.timer = null; }
    state.ma = ma;

    var tpl = document.querySelector('template[data-ma="' + ma + '"]');
    elSan.innerHTML = '';
    elSan.appendChild(tpl.content.cloneNode(true));

    NAV.wireScreen(ma, elSan, {
      timer: function (dich, ms) { state.timer = setTimeout(function () { go(dich); }, ms); },
      onQty: capNhatSoLuong,
    });

    veDanhSach();
    veGhiChu(ma);
    veDemo(ma);
    veRay(ma);
    if (location.hash.slice(1) !== ma) history.replaceState(null, '', '#' + ma);
    var muc = elDs.querySelector('[aria-current="true"]');
    if (muc && muc.scrollIntoView) muc.scrollIntoView({ block: 'nearest' });
  }

  /* ---------------------------------------------------------- ghi chú màn */
  function veGhiChu(ma) {
    var s = SCREENS[ma];
    elGhi.innerHTML =
      '<i>MÀN ' + ma + ' · ' + s.id + (s.mvp ? ' · MVP BƯỚC ' + s.mvp : '') + '</i>' +
      '<b>' + s.name + '</b>' +
      '<p>' + s.note + '</p>' +
      '<p style="color:#9BA89F;font-size:11px">Tệp: screens/group-' +
      String(s.group).padStart(2, '0') + '/' + s.id + '.html</p>';
  }

  /* ---------------------------------------------------------- đường ray MVP */
  function veRay(ma) {
    var i = -1;
    for (var k = 0; k < MVP.length; k++) if (MVP[k].ma === ma) { i = k; break; }
    var nhan = i >= 0
      ? '<b>Bước ' + MVP[i].step + '/24 · ' + MVP[i].en + '</b><i>Màn ' + ma + '</i>'
      : '<b>Ngoài luồng MVP</b><i>Màn ' + ma + ' · ' + SCREENS[ma].name + '</i>';
    var truoc = i > 0 ? MVP[i - 1].ma : (i === 0 ? null : MVP[0].ma);
    var sau = i >= 0 && i < MVP.length - 1 ? MVP[i + 1].ma : (i < 0 ? MVP[0].ma : null);
    elRay.innerHTML =
      '<div class="nhan">' + nhan + '</div>' +
      '<button data-ray="' + (truoc || '') + '"' + (truoc ? '' : ' disabled') + '>← Bước trước</button>' +
      '<button class="chinh-nut" data-ray="' + (sau || '') + '"' + (sau ? '' : ' disabled') + '>' +
      (i < 0 ? 'Vào luồng MVP →' : 'Bước sau →') + '</button>';
  }

  /* ---------------------------------------------------------- bảng giả lập */
  var DEMO = {
    '6.9': [['Bỏ qua thời gian chờ', '7.1']],
    '7.1': [['Ngân hàng báo có tiền → thành công', '7.3'],
            ['Giao dịch lỗi', '7.4'], ['Hết hạn giữ chỗ', '7.5']],
    '7.2': [['Ngân hàng báo có tiền → thành công', '7.3'],
            ['Giao dịch lỗi', '7.4'], ['Hết hạn giữ chỗ', '7.5']],
    '8.1': [['Quán báo túi đã sẵn sàng', '8.4']],
    '8.2': [['Quán bắt đầu chuẩn bị', '@3'], ['Quán báo túi đã sẵn sàng', '8.4'],
            ['Nhân viên quét mã QR', '8.6']],
    '8.3': [['Nhân viên quét mã QR', '8.6']],
    '8.5': [['Nhân viên quét mã QR', '8.6']],
  };
  var DEMO_TXT = {
    '7.1': 'Prototype không nối ngân hàng thật. Trong app thật, máy chủ nhận webhook từ ngân hàng rồi ứng dụng tự chuyển màn — không có nút “Tôi đã chuyển khoản”.',
    '7.2': 'Prototype không nối ngân hàng thật. Màn này tự chuyển sang Thanh toán thành công sau vài giây.',
    '8.2': 'Việc chuẩn bị đồ ăn nằm ở ứng dụng phía nhà hàng, ngoài phạm vi app khách. Các nút dưới đây giả lập thao tác của quán.',
    '8.3': 'Nhân viên quán quét mã này bằng ứng dụng phía nhà hàng. Nút dưới đây giả lập thao tác đó.',
    '8.5': 'Nhân viên quán quét mã này bằng ứng dụng phía nhà hàng. Nút dưới đây giả lập thao tác đó.',
  };

  function veDemo(ma) {
    var ds = DEMO[ma];
    if (!ds) { elDemo.hidden = true; return; }
    elDemo.hidden = false;
    elDemo.innerHTML = '<b>Bảng điều khiển demo</b>' +
      '<p>' + (DEMO_TXT[ma] || 'Các nút dưới đây chỉ dùng cho prototype, không có trong sản phẩm thật.') + '</p>' +
      ds.map(function (d, i) {
        return '<button class="' + (i ? 'phu' : '') + '" data-demo="' + d[1] + '">' + d[0] + '</button>';
      }).join('');
  }

  /* ---------------------------------------------------------- số lượng & tiền */
  function docStepper(root) {
    var ra = [];
    root.querySelectorAll('b').forEach(function (b) {
      var t = (b.textContent || '').trim();
      if (!/^\d+$/.test(t)) return;
      var p = b.previousElementSibling, n = b.nextElementSibling;
      if (!p || !n || p.tagName !== 'SPAN' || n.tagName !== 'SPAN') return;
      if (!p.querySelector('svg') || !n.querySelector('svg')) return;
      ra.push(parseInt(t, 10));
    });
    return ra;
  }

  function capNhatSoLuong(ma, idx, val, root) {
    var q = docStepper(root);
    if (ma === '5.6') {
      var ds = root.querySelectorAll('.nut');
      var nut = root.querySelector('.day .nut') || ds[ds.length - 1];
      if (nut) nut.textContent = 'Thêm ' + q[0] + ' túi · ' + money(q[0] * 43000);
    }
    if (ma === '6.1') {
      var q1 = q[0] || 0, q2 = q[1] || 0;
      var tam = q1 * 45000 + q2 * 25000;
      var tiet = q1 * 11000 + q2 * 5000;
      var day = root.querySelector('.day');
      if (!day) return;
      var dong = day.querySelectorAll('.tien');
      if (dong[0]) {
        dong[0].children[0].textContent = 'Tạm tính · ' + (q1 + q2) + ' túi';
        dong[0].children[1].textContent = money(tam);
      }
      if (dong[1]) dong[1].children[1].textContent = '−' + money(tiet);
      var nut2 = day.querySelector('.nut');
      if (nut2) nut2.textContent = 'Tiếp tục · ' + money(tam);
      var badge = root.querySelector('.tab .gio');
      if (badge) badge.textContent = q1 + q2;
    }
  }

  /* ---------------------------------------------------------- sự kiện */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-ma]') : null;
    if (a && elDs.contains(a)) { go(a.getAttribute('data-ma')); return; }

    var r = e.target.closest ? e.target.closest('[data-ray]') : null;
    if (r && r.getAttribute('data-ray')) { go(r.getAttribute('data-ray')); return; }

    var d = e.target.closest ? e.target.closest('[data-demo]') : null;
    if (d) {
      var v = d.getAttribute('data-demo');
      if (v.charAt(0) === '@') { state.orderStatus = parseInt(v.slice(1), 10); go(state.ma); }
      else go(v);
      return;
    }

    var g = e.target.closest ? e.target.closest('[data-go]') : null;
    if (g && elSan.contains(g)) { go(g.getAttribute('data-go')); return; }
  });

  document.querySelectorAll('[data-kichthuoc]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('[data-kichthuoc]').forEach(function (x) {
        x.setAttribute('aria-pressed', 'false');
      });
      b.setAttribute('aria-pressed', 'true');
      var wpx = parseInt(b.getAttribute('data-kichthuoc'), 10);
      var s = wpx / 390;
      elThu.style.setProperty('--s', s);
      elThu.style.width = (390 * s) + 'px';
      elThu.style.height = (844 * s) + 'px';
    });
  });

  var btGoiY = document.getElementById('btGoiY');
  btGoiY.addEventListener('click', function () {
    var on = document.body.classList.toggle('goi-y');
    btGoiY.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  var btMvp = document.getElementById('btChiMvp');
  btMvp.addEventListener('click', function () {
    state.chiMvp = !state.chiMvp;
    btMvp.setAttribute('aria-pressed', state.chiMvp ? 'true' : 'false');
    veDanhSach();
  });

  window.addEventListener('hashchange', function () {
    var ma = location.hash.slice(1);
    if (ma && ma !== state.ma && SCREENS[ma]) go(ma);
  });

  go(location.hash.slice(1) && SCREENS[location.hash.slice(1)] ? location.hash.slice(1) : '1.1');
  window.ECOBITE_APP = { go: go, state: state };
})();
