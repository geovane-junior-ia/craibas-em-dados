/* ============================================
   CRAÍBAS EM DADOS · Script comum das páginas de eixo
   Tabs + header scroll + smooth scroll.
   ============================================ */

(function () {
  'use strict';

  /* Header behavior — mesma lógica da Home, isolada por página */
  const header = document.getElementById('header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
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
})();

/* ===== TAB HANDLER (global — chamado inline pelos protótipos) ===== */
function showTab(id, el) {
  const targetId = 'tab-' + id;
  const target = document.getElementById(targetId);
  if (!target) return;

  // Escopo local: o container que contém a aba clicada
  const scope = el ? el.closest('.eixo-page') || document : document;

  scope.querySelectorAll('.tab-content, .tc').forEach(t => t.classList.remove('active'));
  scope.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  target.classList.add('active');
  if (el) el.classList.add('active');
}
