/**
 * Timeline: upcoming / today badges + countdown, and scroll-triggered reveal.
 */
(function () {
  'use strict';

  var items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  function parseIsoLocal(iso) {
    var p = iso.split('-');
    return new Date(Number(p[0], 10), Number(p[1], 10) - 1, Number(p[2], 10));
  }

  function todayMidnight() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  /**
   * @returns {{ kind: 'today' } | { kind: 'upcoming', dayDiff: number, hoursApprox: number } | null}
   */
  function classifyEvent(iso) {
    var eventDay = parseIsoLocal(iso);
    var today = todayMidnight();
    var te = eventDay.getTime();
    var tt = today.getTime();
    if (te < tt) return null;
    if (te === tt) return { kind: 'today' };
    var dayDiff = Math.round((te - tt) / 86400000);
    var msToStart = eventDay.getTime() - Date.now();
    var hoursApprox = Math.max(0, Math.ceil(msToStart / 3600000));
    return { kind: 'upcoming', dayDiff: dayDiff, hoursApprox: hoursApprox };
  }

  function initUpcomingAndToday() {
    items.forEach(function (item) {
      var iso = item.getAttribute('data-date');
      if (!iso) return;

      var info = classifyEvent(iso);
      if (!info) return;

      var card = item.querySelector('.timeline__card');
      var dateEl = card && card.querySelector('.timeline__date');
      if (!dateEl) return;

      var wrap = document.createElement('div');
      wrap.className = 'timeline__countdown-wrap';

      var badge = document.createElement('span');
      badge.className =
        info.kind === 'today' ? 'timeline__badge timeline__badge--today' : 'timeline__badge';

      var count = document.createElement('p');
      count.className = 'timeline__countdown';
      count.setAttribute('role', 'status');

      if (info.kind === 'today') {
        item.classList.add('timeline__item--today');
        badge.textContent = 'Today';
        count.textContent = 'This entry’s date is today.';
      } else {
        item.classList.add('timeline__item--upcoming');
        badge.textContent = 'Upcoming';
        var main =
          info.dayDiff === 1 ? 'Tomorrow' : 'In ' + info.dayDiff + ' days';
        count.appendChild(document.createTextNode(main));
        if (info.hoursApprox > 0 && info.hoursApprox < 168) {
          var detail = document.createElement('span');
          detail.className = 'timeline__countdown-detail';
          detail.textContent =
            '~' + info.hoursApprox + ' hour' + (info.hoursApprox === 1 ? '' : 's') + ' until this date';
          count.appendChild(document.createElement('br'));
          count.appendChild(detail);
        }
      }

      wrap.appendChild(badge);
      wrap.appendChild(count);
      dateEl.after(wrap);
    });
  }

  initUpcomingAndToday();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    items.forEach(function (el) {
      el.classList.add('timeline__item--visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline__item--visible');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
