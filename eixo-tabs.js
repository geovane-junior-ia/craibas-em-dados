/* ============================================
   Script comum de eixo — tabs, header, back-to-top
   Sem Chart.js (páginas com gráfico têm seu próprio JS)
   ============================================ */

(function () {
  'use strict';

  /* Header scroll */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  /* Mobile nav */
  const navToggle = document.getElementById('nav-toggle');
  const navMain = document.getElementById('nav-main');
  if (navToggle && navMain) {
    navToggle.addEventListener('click', () => navMain.classList.toggle('open'));
    navMain.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMain.classList.remove('open'))
    );
  }

  /* Tabs */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.querySelector(`.tab-panel[data-tab="${target}"]`);
      if (panel) panel.classList.add('active');
      const tabsNav = document.querySelector('.tabs-nav-wrap');
      if (tabsNav) {
        window.scrollTo({
          top: tabsNav.offsetTop + tabsNav.offsetHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  /* Back to top */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
