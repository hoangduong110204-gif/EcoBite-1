(function () {
  var NAV = window.ECOBITE_NAV;
  var ma = document.body.getAttribute('data-ma');
  var root = document.getElementById('manHinh');
  function di(dich) {
    var s = NAV.SCREENS[dich];
    if (!s) return;
    location.href = '../group-' + String(s.group).padStart(2, '0') + '/' + s.id + '.html';
  }
  NAV.wireScreen(ma, root, {
    timer: function (d, ms) { setTimeout(function () { di(d); }, ms); },
    onQty: function () {},
  });
  document.addEventListener('click', function (e) {
    var g = e.target.closest ? e.target.closest('[data-go]') : null;
    if (g && root.contains(g)) di(g.getAttribute('data-go'));
  });
})();
