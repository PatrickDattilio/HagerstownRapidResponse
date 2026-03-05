/**
 * Hagerstown Rapid Response - Landing Page Scripts
 * Handles status bar updates and smooth interactions
 */

(function () {
  'use strict';

  // Simulated last alert time - in production, this would come from an API
  const LAST_ALERT_HOURS = 2;
  const LAST_ALERT_MINUTES = 15;

  function initStatusBar() {
    const lastAlertEl = document.getElementById('lastAlertTime');
    if (!lastAlertEl) return;

    // Display relative time
    const formatTimeAgo = () => {
      const totalMinutes = LAST_ALERT_HOURS * 60 + LAST_ALERT_MINUTES;
      if (totalMinutes < 60) {
        return `${totalMinutes} min`;
      }
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      if (mins === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${hours} hr ${mins} min`;
    };

    lastAlertEl.textContent = formatTimeAgo();
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStatusBar();
      initSmoothScroll();
    });
  } else {
    initStatusBar();
    initSmoothScroll();
  }
})();
