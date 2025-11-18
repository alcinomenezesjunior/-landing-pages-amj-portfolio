/**
 * =================================================================
 * SCRIPT UNIFICADO v1.1 (Refatorado por Ajudante de Programação)
 * =================================================================
 * v1.1: Corrige um 'SyntaxError' (missing '}') na função initCountdown.
 */

// Espera que o HTML esteja pronto para executar o código
document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. SELETORES GLOBAIS E ESTADO
  // ========================================
  
  // Funções "Query Selector" (para facilitar)
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Variáveis de estado
  let formSubmitted = false;
  let exitPopupShown = false;
  
  // Elementos principais
  const leadForm = $('#leadForm');
  const stickyCta = $('#sticky-cta');
  
  // Popups
  const exitPopup = $('#exitPopupChatbot'); // Corrigido para corresponder ao HTML
  const successPopup = $('#successPopup');
  const agencyPopup = $('#exitPopupAgencia'); // Corrigido para corresponder ao HTML

  
  // ========================================
  // 2. FUNÇÕES AUXILIARES (Helpers)
  // ========================================

  const openPopup = (popupEl) => {
    if (!popupEl) return;
    popupEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closePopup = (popupEl) => {
    if (!popupEl) return;
    popupEl.style.display = 'none';
    document.body.style.overflow = '';
  };

  // ========================================
  // SISTEMA DE POPUPS EM CASCATA
  // ========================================

  // Estado global dos popups
  let popupsState = {
    chatbotShown: false,
    agenciaShown: false
  };

  // Função universal para fechar popup (exposta globalmente)
  let lastFocusedElement = null;

  // Função para trapear foco dentro do popup (acessibilidade)
  function trapFocus(popup) {
    const focusableElements = popup.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Foca no primeiro elemento
    firstElement.focus();

    // Handler para Tab/Shift+Tab
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    popup.addEventListener('keydown', handleTabKey);

    // Guardar para remover depois
    popup._focusTrapHandler = handleTabKey;
  }

  // Função para remover focus trap
  function removeFocusTrap(popup) {
    if (popup && popup._focusTrapHandler) {
      popup.removeEventListener('keydown', popup._focusTrapHandler);
      delete popup._focusTrapHandler;
    }
  }

  window.closePopup = function(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.classList.remove('active');
      popup.classList.remove('show');
      popup.style.display = 'none';
      document.body.style.overflow = '';

      // Remove focus trap e restaura foco
      removeFocusTrap(popup);
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }
  };

  // Função para mostrar popup chatbot (primeiro - resgate)
  function showChatbotPopup() {
    if (popupsState.chatbotShown) return;

    const popup = document.getElementById('exitPopupChatbot');
    if (popup) {
      // Guarda elemento com foco atual
      lastFocusedElement = document.activeElement;

      popup.classList.add('active');
      popup.classList.add('show');
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      popupsState.chatbotShown = true;
      sessionStorage.setItem('chatbotPopupShown', 'true');

      // Ativa focus trap
      trapFocus(popup);
    }
  }

  // Função para mostrar popup agência (segundo - se recusar chatbot)
  window.showAgencyPopup = function() {
    // Fecha popup chatbot
    window.closePopup('exitPopupChatbot');

    // Abre popup agência
    const popup = document.getElementById('exitPopupAgencia');
    if (popup) {
      // Guarda elemento com foco atual (se não houver lastFocused já)
      if (!lastFocusedElement) {
        lastFocusedElement = document.activeElement;
      }

      popup.classList.add('active');
      popup.classList.add('show');
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      popupsState.agenciaShown = true;

      // Ativa focus trap
      trapFocus(popup);
    }
  };

  // Função para scroll to planos
  window.scrollToPlans = function() {
    const planosSection = document.querySelector('#planos');
    if (planosSection) {
      planosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Exit intent detection - Movido para initExitPopupLazy() (lazy loading)
  let exitIntentTriggered = false;

  // Função para tracking de cliques no botão WhatsApp Demo
  window.trackWhatsAppDemo = (event) => {
    // Google Analytics tracking (se gtag existir)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        'event_category': 'Demo',
        'event_label': 'WhatsApp Bot Test',
        'value': 1
      });
    }

    // Console log para debug

    // Permitir navegação normal
    return true;
  };

  // Funções de info do dispositivo
  const getDeviceType = () => {
    const w = Math.min(window.screen.width, window.innerWidth);
    return w < 600 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  };
  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) return 'Chrome';
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Edg/i.test(ua)) return 'Edge';
    return 'Other';
  };
  const getOS = () => {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iOS/i.test(ua)) return 'iOS';
    return 'Other';
  };

  // ========================================
  // 3. MÓDULOS DE FUNCIONALIDADE
  // ========================================

  /**
   * Módulo: Sticky CTA (Mobile)
   * Mostra um CTA fixo no fundo após o utilizador fazer scroll.
   */
  function initStickyCta() {
    if (!stickyCta || window.innerWidth > 768) {
      return;
    }
    
    let shown = false;
    window.addEventListener('scroll', () => {
      if (!shown && window.scrollY > 800) {
        stickyCta.style.display = 'block';
        shown = true;
      }
    }, { passive: true }); // Adiciona 'passive' para melhor performance de scroll
  }
  
  /**
   * Módulo: Contador Regressivo
   * Inicia o contador da oferta "Black November".
   */
  function initCountdown() {
    const timerWrap = $('.timer');
    if (!timerWrap) return;
    
    const dd = $('#dd'), hh = $('#hh'), mm = $('#mm'), ss = $('#ss');
    if (!dd || !hh || !mm || !ss) return;

    const getTargetDate = () => {
      const deadlineStr = timerWrap.getAttribute('data-deadline'); // "2025-11-30T23:59:59"
      const tz = timerWrap.getAttribute('data-tz') || 'Europe/Lisbon'; // "Europe/Lisbon"

      if (!deadlineStr) {
        // Fallback: fim do mês atual em Lisboa
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
        return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      }
      
      try {
        const targetDate = new Date(deadlineStr); // Ex: 2025-11-30T23:59:59
        
        const nowInLisbon = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
        const localNow = new Date();
        const offsetDiff = (localNow.getTimezoneOffset() - nowInLisbon.getTimezoneOffset()) * 60000;
        
        return new Date(targetDate.getTime() + offsetDiff);

      } catch(e) {
        // Fallback em caso de data inválida
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
        return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      }
    };
    
    const target = getTargetDate();
    let timerId = null;

    function lockOfferUI() {
      const sec = $('#pioneiros');
      if (sec) {
        sec.classList.add('is-closed');
        const title = sec.querySelector('.h2');
        if (title) title.textContent = 'Oferta encerrada';
        (function(){ const _b = sec.querySelector('.btn'); if(_b) _b.style.display = 'none'; })();
      }
      [dd, hh, mm, ss].forEach(el => { if (el) el.textContent = '00'; });
    }

    function tick() {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: timerWrap.getAttribute('data-tz') || 'Europe/Lisbon' }));
      let diff = Math.floor((target - now) / 1000);

      if (diff <= 0) {
        lockOfferUI();
        if (timerId) clearInterval(timerId);
        return;
      } // <--- A CORREÇÃO ESTÁ AQUI. Esta '}' estava em falta.

      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60); diff -= m * 60;
      
      dd.textContent = String(d).padStart(2, '0');
      hh.textContent = String(h).padStart(2, '0');
      mm.textContent = String(m).padStart(2, '0');
      ss.textContent = String(diff).padStart(2, '0');
    }

    tick(); // Corre imediatamente
    timerId = setInterval(tick, 1000); // Atualiza a cada segundo
  }

  /**
   * Módulo: Scroll Suave
   * Faz o scroll para âncoras (links com #) de forma suave.
   */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        try {
          const target = $(href);
          if (target) {
            e.preventDefault();
            // Calcula a posição do target - 80px para o header fixo
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        } catch (err) {
          // Se o seletor for inválido (ex: href="#"), ignora o erro
        }
      });
    });
  }

  /**
   * Módulo: Popups
   * Controla a lógica de abrir/fechar todos os popups.
   */
  function initPopups() {
    
    // --- Lógica de fechar (comum a todos) ---
    $$('.exit-popup__overlay, .exit-popup__close').forEach(el => {
      el.addEventListener('click', (e) => {
        const popup = e.target.closest('.exit-popup');
        if (popup) closePopup(popup);
      });
    });

    // Fechar com a tecla 'Escape'
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup(exitPopup);
        closePopup(successPopup);
        closePopup(agencyPopup);
      }
    });

    // --- 1. Popup de Saída (Exit Intent) ---
    if (exitPopup) {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitPopupShown && !formSubmitted && window.innerWidth > 768) {
          openPopup(exitPopup);
          exitPopupShown = true;
          // dataLayer.push... (se necessário)
        }
      });

      // Botão Primário (ir para o formulário)
      $('#exitPopupPrimary')?.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(exitPopup);
        // Encontra o link 'a[href="#formulario"]' e simula um clique
        // para ativar o smooth scroll
        $('a[href="#formulario"]')?.click();
      });

      // Botão Secundário (abrir popup da agência)
      $('#exitPopupSecondary')?.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(exitPopup);
        openPopup(agencyPopup);
        // dataLayer.push... (se necessário)
      });
    }

    // --- 2. Popup de Sucesso (Success) ---
    if (successPopup) {
      $('#successPopupSecondaryClose')?.addEventListener('click', () => closePopup(successPopup));
    }
    
    // --- 3. Popup de Agência (Agency) ---
    if (agencyPopup) {
      $('#agencyDismiss')?.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(agencyPopup);
      });
    }
  }

  /**
   * Módulo: Formulário
   * Controla a validação e envio do formulário de lead.
   */
  function initForm() {
    if (!leadForm) return;

    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = $('button[type="submit"]', leadForm);
      const btnTxt = btn ? btn.innerHTML : '';

      // 1. Validar
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      // 2. Preparar (desativar botão, normalizar dados)
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';
      }

      const wa = $('#whatsapp', leadForm); 
      if (wa) wa.value = wa.value.replace(/[^\d]/g,'').slice(0,12);
      
      const ig = $('#instagram', leadForm); 
      if (ig) ig.value = ig.value.replace(/[@\s]/g,'').toLowerCase();

      // 3. Montar Payload (os dados a enviar)
      const usa = $('input[name="usa_automacao"]:checked', leadForm)?.value || '';
      const inv = $('#investimento_ferramentas', leadForm)?.value || '';
      const des = $('#desafio_principal', leadForm)?.value?.trim() || '';

      const payload = {
        nome: $('#nome', leadForm)?.value || '',
        email: $('#email', leadForm)?.value || '',
        whatsapp: $('#whatsapp', leadForm)?.value || '',
        instagram: $('#instagram', leadForm)?.value || '',
        origem: $('input[name="origem"]', leadForm)?.value || 'chatbot-estetica',
        usa_automacao: usa,
        investimento_ferramentas: inv,
        desafio_principal: des,
        timestamp: new Date().toISOString(),
        url_origem: location.href,
        url_referrer: document.referrer || 'Direto',
        tipo_dispositivo: getDeviceType(), 
        navegador: getBrowser(), 
        sistema_operacional: getOS(),
        resolucao_tela: `${screen.width}x${screen.height}`, 
        idioma_navegador: navigator.language || 'N/A'
      };

      // 4. Ação Imediata (UX-first)
      openPopup(successPopup);
      formSubmitted = true; // Marca que o form foi enviado (para o exit-intent)

      // 5. Enviar Tracking (não bloqueia)
      try {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'form_submission',
            form_name: 'chatbot-estetica-lead',
            usa_automacao: usa,
            investimento_ferramentas: inv
          });
        }
      } catch(_) {}

      // 6. Envio Resiliente dos Dados (para n8n)
      const url = 'https://mjrmkt.app.n8n.cloud/webhook/chatbot-estetica';
      let done = false;

      try {
        // Método 1: sendBeacon (ideal, não bloqueia, funciona ao fechar a página)
        if (navigator.sendBeacon) {
          done = navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], {type:'application/json'}));
        }
      } catch(_) {}

      if (!done) {
        try {
          // Método 2: fetch (fallback, mas com 'keepalive')
          fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            keepalive: true,
            headers: { 'Content-Type': 'text/plain' }, // 'text/plain' é comum para 'no-cors'
            body: JSON.stringify(payload),
            cache: 'no-store',
            referrerPolicy: 'no-referrer'
          });
          done = true;
        } catch(_) {}
      }

      // 7. Restaurar UI (após um pequeno delay)
      setTimeout(() => {
        try { leadForm.reset(); } catch(_) {}
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = btnTxt || 'Enviar Candidatura';
        }
      }, 800);
    });
  }


  // ========================================
  // 4. INICIALIZAÇÃO
  // ========================================

  // Inicializa todas as funcionalidades após o DOM estar completamente carregado.
  initSmoothScroll();
  initForm();
  initStickyCta();
  initCountdown();
  initPopups(); // Esta função contém a lógica do exit-intent para desktop.

}); // Fim do 'DOMContentLoaded'


/* ==== AMJ Mobile Exit-Intent Module (non-breaking) v1 ==== */
// Este módulo é auto-executável e deve permanecer como está,
// mas vamos garantir que ele aponta para o pop-up correto.
(function(){
  if (typeof window === 'undefined') return;
  var isMobile = (window.innerWidth || 1024) <= 768;
  if (!isMobile) return;

  var hasShown = (sessionStorage.getItem('exit_shown') === '1');
  var markShown = function(){ hasShown = true; try{ sessionStorage.setItem('exit_shown','1'); }catch(e){} };

  var _openPopup = function(el){
    if (!el) return;
    // Usa a função global showChatbotPopup para manter a consistência e a gestão de foco.
    if (typeof window.showChatbotPopup === 'function') {
        window.showChatbotPopup();
    } else {
        el.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
  };

  var isAnyPopupOpen = function(){
    var open = document.querySelector('.popup.active, .popup.show, .exit-popup[style*="display: flex"]');
    return !!open;
  };

  var showExit = function(){
    if (hasShown || isAnyPopupOpen()) return;
    // CORREÇÃO: O ID correto do popup de chatbot é 'exitPopupChatbot'.
    var el = document.getElementById('exitPopupChatbot');
    if (!el) return;
    _openPopup(el);
    markShown();
  };

  var onReady = function(fn){
    if (document.readyState === 'complete' || document.readyState === 'interactive') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn, { once: true }); }
  };

  onReady(function(){
    var EXIT_IDLE_MS = 20000;
    var idleTimer;
    var resetIdle = function(){
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showExit, EXIT_IDLE_MS);
    };
    ['touchstart','scroll','keydown','mousemove'].forEach(function(evt){
      window.addEventListener(evt, resetIdle, { passive: true });
    });
    resetIdle();

    var lastY = window.scrollY || 0;
    window.addEventListener('scroll', function(){
      var y = window.scrollY || 0;
      var goingUpFast = (lastY - y) > 80;
      var nearTop = y < 120;
      if (goingUpFast && nearTop) showExit();
      lastY = y;
    }, { passive: true });

    try{
      history.pushState({ amjGuard: 1 }, '');
      window.addEventListener('popstate', function(){
        if (!hasShown && !isAnyPopupOpen()){
          showExit();
          try{ history.pushState({ amjGuard: 1 }, ''); }catch(e){}
        }
      });
    }catch(e){ /* ignore */ }
  });
})();
/* ==== /AMJ Mobile Exit-Intent Module ==== */

