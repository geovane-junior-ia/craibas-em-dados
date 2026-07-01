/* ============================================
   CRAÍBAS EM DADOS — Sistema de conteúdo restrito
   Fase 1: cadeado simbólico com senha hardcoded (client-side).
   ⚠️ NÃO oferece segurança criptográfica real — apenas fricção visual.
   Fase 2 (futura): substituir por AES-GCM + Web Crypto API.
   ============================================ */

(function () {
  'use strict';

  // Senha da apresentação (Fase 1)
  // ⚠️ Client-side — visível em View Source. Substituir por cripto real na Fase 2.
  const SENHA = 'planurbi2026';
  const STORAGE_KEY = 'craibas-modo-restrito';

  /* ===== Estado inicial ===== */
  function isModoRestritoAtivo() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'ativo';
    } catch (e) { return false; }
  }

  function ativarModoRestrito() {
    document.body.classList.add('modo-restrito');
    try { sessionStorage.setItem(STORAGE_KEY, 'ativo'); } catch (e) {}
    // Atualiza texto do toggle
    document.querySelectorAll('.restrito-toggle .toggle-label').forEach(el => {
      el.textContent = 'Modo técnico ativo';
    });
    document.querySelectorAll('.restrito-toggle i.toggle-icon').forEach(el => {
      el.className = 'toggle-icon fas fa-lock-open';
    });
  }

  function desativarModoRestrito() {
    document.body.classList.remove('modo-restrito');
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    document.querySelectorAll('.restrito-toggle .toggle-label').forEach(el => {
      el.textContent = 'Modo técnico';
    });
    document.querySelectorAll('.restrito-toggle i.toggle-icon').forEach(el => {
      el.className = 'toggle-icon fas fa-lock';
    });
  }

  /* ===== Modal de senha ===== */
  function injetarModal() {
    if (document.getElementById('senha-modal-overlay')) return;
    const html = `
      <div class="senha-modal-overlay" id="senha-modal-overlay" role="dialog" aria-modal="true">
        <div class="senha-modal">
          <div class="senha-modal-icon"><i class="fas fa-lock"></i></div>
          <h2>Acesso ao conteúdo técnico</h2>
          <p>Alguns conteúdos deste painel — como análises detalhadas sobre mineração, endereços de equipamentos sensíveis e recortes por microterritório — estão reservados para acesso técnico da equipe PlanUrbi e da gestão municipal.</p>
          <input type="password" class="senha-input" id="senha-input" placeholder="Digite a senha de acesso" autocomplete="current-password"/>
          <div class="senha-error-msg" id="senha-error"></div>
          <div class="senha-modal-actions">
            <button class="senha-btn senha-btn-cancel" id="senha-cancel">Cancelar</button>
            <button class="senha-btn senha-btn-primary" id="senha-submit">Desbloquear</button>
          </div>
          <div class="senha-modal-nota">
            🔒 Fase 1 — apresentação. Sistema de senha simples, sem criptografia. Na versão final, o acesso será via login autenticado.
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    const overlay = document.getElementById('senha-modal-overlay');
    const input = document.getElementById('senha-input');
    const errorMsg = document.getElementById('senha-error');
    const btnSubmit = document.getElementById('senha-submit');
    const btnCancel = document.getElementById('senha-cancel');

    function fechar() {
      overlay.classList.remove('open');
      input.value = '';
      input.classList.remove('erro');
      errorMsg.textContent = '';
    }

    function tentarDesbloquear() {
      const val = input.value.trim();
      if (val === SENHA) {
        ativarModoRestrito();
        fechar();
      } else {
        input.classList.add('erro');
        errorMsg.textContent = 'Senha incorreta. Tente novamente.';
        input.focus();
        input.select();
        setTimeout(() => input.classList.remove('erro'), 400);
      }
    }

    btnSubmit.addEventListener('click', tentarDesbloquear);
    btnCancel.addEventListener('click', fechar);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fechar();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); tentarDesbloquear(); }
      if (e.key === 'Escape') fechar();
    });
  }

  function abrirModal() {
    const overlay = document.getElementById('senha-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    setTimeout(() => {
      const input = document.getElementById('senha-input');
      if (input) input.focus();
    }, 100);
  }

  /* ===== Injeta toggle no header ===== */
  function injetarToggle() {
    const nav = document.querySelector('.nav-main');
    if (!nav || nav.querySelector('.restrito-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'restrito-toggle';
    btn.setAttribute('aria-label', 'Alternar modo técnico restrito');
    btn.innerHTML = `<i class="toggle-icon fas fa-lock"></i><span class="toggle-label">Modo técnico</span>`;
    btn.addEventListener('click', () => {
      if (document.body.classList.contains('modo-restrito')) {
        desativarModoRestrito();
      } else {
        abrirModal();
      }
    });
    nav.appendChild(btn);
  }

  /* ===== Transforma .conteudo-restrito em placeholders clicáveis ===== */
  function envelopar() {
    document.querySelectorAll('.conteudo-restrito').forEach((bloco) => {
      // Se já tem placeholder irmão, pula
      if (bloco.previousElementSibling &&
          bloco.previousElementSibling.classList.contains('restrito-locked')) return;

      const titulo = bloco.dataset.tituloRestrito || 'Conteúdo técnico restrito';
      const desc = bloco.dataset.descRestrito || 'Análise detalhada disponível apenas para acesso técnico. Ative o modo técnico no cabeçalho para revelar.';

      const placeholder = document.createElement('div');
      placeholder.className = 'restrito-locked';
      placeholder.innerHTML = `
        <div class="restrito-locked-icon"><i class="fas fa-lock"></i></div>
        <div class="restrito-locked-title">${titulo}</div>
        <div class="restrito-locked-desc">${desc}</div>
        <span class="restrito-locked-cta"><i class="fas fa-key"></i> Ativar modo técnico</span>
      `;
      placeholder.addEventListener('click', abrirModal);
      bloco.parentNode.insertBefore(placeholder, bloco);
    });
  }

  /* ===== Bootstrap ===== */
  function init() {
    injetarToggle();
    injetarModal();
    envelopar();
    if (isModoRestritoAtivo()) ativarModoRestrito();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
