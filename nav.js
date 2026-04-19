/**
 * Mobile navigation drawer, focus trap, Escape to close, inert background.
 */
(function () {
  'use strict';

  var mq = window.matchMedia('(min-width: 960px)');

  function init() {
    var header = document.querySelector('.header');
    var toggle = document.querySelector('.header__menu-toggle');
    var nav = document.getElementById('primary-navigation');
    var overlay = document.getElementById('header-nav-overlay');
    var main = document.getElementById('main');
    var footer = document.querySelector('body > footer');
    var logo = header.querySelector('.header__logo');

    if (!header || !toggle || !nav) return;

    var supportsInert = typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

    function focusableIn(el) {
      if (!el) return [];
      return Array.prototype.slice.call(
        el.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function setHeaderHeight() {
      var h = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', Math.round(h) + 'px');
    }

    function isDesktop() {
      return mq.matches;
    }

    function syncInertState() {
      var open = header.classList.contains('header--nav-open');
      if (supportsInert) {
        if (isDesktop()) {
          nav.inert = false;
          if (main) main.inert = false;
          if (footer) footer.inert = false;
        } else if (open) {
          nav.inert = false;
          if (main) main.inert = true;
          if (footer) footer.inert = true;
        } else {
          nav.inert = true;
          if (main) main.inert = false;
          if (footer) footer.inert = false;
        }
      }
      if (logo) {
        if (!isDesktop() && open) {
          logo.setAttribute('tabindex', '-1');
          logo.setAttribute('aria-hidden', 'true');
        } else {
          logo.removeAttribute('tabindex');
          logo.removeAttribute('aria-hidden');
        }
      }
    }

    function openMenu() {
      if (isDesktop()) return;
      header.classList.add('header--nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      nav.removeAttribute('aria-hidden');
      syncInertState();
      if (overlay) {
        overlay.removeAttribute('hidden');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.body.classList.add('nav-drawer-open');

      var links = focusableIn(nav);
      if (links.length) {
        window.setTimeout(function () {
          links[0].focus();
        }, 10);
      }
    }

    function closeMenu() {
      header.classList.remove('header--nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (!isDesktop()) {
        nav.setAttribute('aria-hidden', 'true');
      } else {
        nav.removeAttribute('aria-hidden');
      }
      syncInertState();
      if (overlay) {
        overlay.setAttribute('hidden', '');
        overlay.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('nav-drawer-open');
      toggle.focus();
    }

    function onToggleClick() {
      if (header.classList.contains('header--nav-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    toggle.addEventListener('click', onToggleClick);

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeMenu();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('header--nav-open')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!header.classList.contains('header--nav-open') || isDesktop()) return;
      if (e.key !== 'Tab') return;

      var links = focusableIn(nav);
      if (!links.length) return;

      var first = links[0];
      var lastLink = links[links.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          toggle.focus();
        } else if (document.activeElement === toggle) {
          e.preventDefault();
          lastLink.focus();
        }
      } else {
        if (document.activeElement === lastLink) {
          e.preventDefault();
          toggle.focus();
        } else if (document.activeElement === toggle) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    mq.addEventListener('change', function () {
      setHeaderHeight();
      if (isDesktop()) {
        header.classList.remove('header--nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        nav.removeAttribute('aria-hidden');
        syncInertState();
        if (overlay) {
          overlay.setAttribute('hidden', '');
          overlay.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('nav-drawer-open');
      } else {
        if (!header.classList.contains('header--nav-open')) {
          nav.setAttribute('aria-hidden', 'true');
        }
        syncInertState();
      }
    });

    if (!isDesktop()) {
      nav.setAttribute('aria-hidden', 'true');
    }
    syncInertState();

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    nav.addEventListener('click', function (e) {
      if (isDesktop()) return;
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    toggle.addEventListener('keydown', function (e) {
      if (!header.classList.contains('header--nav-open') || isDesktop()) return;
      if (e.key !== 'Tab' || e.shiftKey) return;
      var links = focusableIn(nav);
      if (links.length && document.activeElement === toggle) {
        e.preventDefault();
        links[0].focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
