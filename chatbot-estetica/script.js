// SCRIPT UNIFICADO v1.1 - Refatorado por Ajudante de Programação
// Última atualização: 2024
// v1.1: Corrige um 'SyntaxError' (missing '}') na função initCountdown.

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

  // Sistema de expiração do popup (30 minutos)
  const POPUP_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutos

  // Verifica se está em modo de teste via URL
  const urlParams = new URLSearchParams(window.location.search);
  const isTestMode = urlParams.has('test-popup');

  // Verifica se o popup foi mostrado recentemente
  function wasPopupShownRecently() {
    if (isTestMode) {
      console.log('[Exit-Intent] 🧪 Modo de teste ativo - sessionStorage ignorado');
      return false;
    }

    const lastShown = sessionStorage.getItem('chatbotPopupShown');
    if (!lastShown) return false;

    const timestamp = parseInt(lastShown, 10);
    const now = Date.now();
    const elapsed = now - timestamp;

    if (elapsed > POPUP_COOLDOWN_MS) {
      // Expirou - limpar
      sessionStorage.removeItem('chatbotPopupShown');
      return false;
    }

    console.log(`[Exit-Intent] Popup foi mostrado há ${Math.floor(elapsed / 60000)} minutos`);
    return true;
  }

  let exitPopupShown = wasPopupShownRecently();
  
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
    popupEl.classList.remove('active');
    popupEl.classList.remove('show');
    popupEl.style.display = 'none';
    document.body.style.overflow = '';
  };

  // ========================================
  // SISTEMA DE POPUPS EM CASCATA
  // ========================================

  // Estado global dos popups
  let popupsState = {
    chatbotShown: wasPopupShownRecently(),
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
    console.log('[showChatbotPopup] Chamada recebida', {
      chatbotShown: popupsState.chatbotShown
    });

    if (popupsState.chatbotShown) {
      console.log('[showChatbotPopup] Bloqueado - popup já foi mostrado nesta sessão');
      return;
    }

    const popup = document.getElementById('exitPopupChatbot');
    if (popup) {
      console.log('[showChatbotPopup] Abrindo popup...');

      // Guarda elemento com foco atual
      lastFocusedElement = document.activeElement;

      popup.classList.add('active');
      popup.classList.add('show');
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      popupsState.chatbotShown = true;

      // Guarda timestamp em vez de boolean para permitir expiração
      sessionStorage.setItem('chatbotPopupShown', Date.now().toString());

      console.log('[showChatbotPopup] ✓ Popup aberto com sucesso (expira em 30min)');

      // Ativa focus trap
      trapFocus(popup);
    } else {
      console.error('[showChatbotPopup] Elemento #exitPopupChatbot não encontrado!');
    }
  }

  // Expõe globalmente para permitir chamadas externas e testes
  window.showChatbotPopup = showChatbotPopup;

  // Função de debug para resetar o estado do popup
  window.resetPopupState = function() {
    sessionStorage.removeItem('chatbotPopupShown');
    sessionStorage.removeItem('exit_shown');
    popupsState.chatbotShown = false;
    exitPopupShown = false;
    console.log('✓ Estado do popup resetado - pode testar novamente');
  };

  // Informar ao utilizador sobre o modo de teste
  if (isTestMode) {
    console.log('%c🧪 MODO DE TESTE ATIVO', 'background: #4CAF50; color: white; font-size: 16px; padding: 8px;');
    console.log('→ O popup vai aparecer sempre, ignorando sessionStorage');
    console.log('→ Para sair do modo de teste, remova ?test-popup=1 do URL');
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

    // Lê o deadline do HTML (formato: "2025-11-30T23:59:59")
    const deadlineStr = timerWrap.getAttribute('data-deadline');
    if (!deadlineStr) {
      [dd, hh, mm, ss].forEach(el => el.textContent = '00');
      return;
    }

    // Parse como UTC adicionando 'Z' (Lisbon em novembro está em WET = UTC+0)
    const targetTime = new Date(deadlineStr + 'Z').getTime();
    let timerId = null;

    function lockOfferUI() {
      const sec = $('#pioneiros');
      if (sec) {
        sec.classList.add('is-closed');
        const title = sec.querySelector('.h2');
        if (title) title.textContent = 'Oferta encerrada';
        const btn = sec.querySelector('.btn');
        if (btn) btn.style.display = 'none';
      }
      [dd, hh, mm, ss].forEach(el => el.textContent = '00');
    }

    function tick() {
      const now = Date.now();
      const diffSeconds = Math.floor((targetTime - now) / 1000);

      if (diffSeconds <= 0) {
        lockOfferUI();
        if (timerId) clearInterval(timerId);
        return;
      }

      const days = Math.floor(diffSeconds / 86400);
      const hours = Math.floor((diffSeconds % 86400) / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      dd.textContent = String(days).padStart(2, '0');
      hh.textContent = String(hours).padStart(2, '0');
      mm.textContent = String(minutes).padStart(2, '0');
      ss.textContent = String(seconds).padStart(2, '0');
    }

    tick(); // Executa imediatamente
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
    // Suporta ambas as convenções de nomenclatura: .exit-popup__ e .popup__
    $$('.exit-popup__overlay, .exit-popup__close, .popup__overlay, .popup__close').forEach(el => {
      el.addEventListener('click', (e) => {
        const popup = e.target.closest('.exit-popup, .popup');
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
      console.log('[Exit-Intent] Inicializado para desktop', {
        exitPopupShown,
        formSubmitted,
        windowWidth: window.innerWidth
      });

      // Desktop: mouseleave no topo da página
      document.documentElement.addEventListener('mouseleave', (e) => {
        console.log('[Exit-Intent] mouseleave detectado', {
          clientY: e.clientY,
          exitPopupShown,
          formSubmitted,
          windowWidth: window.innerWidth
        });

        // Verifica se o mouse saiu pelo topo da janela
        if (e.clientY < 0 && !exitPopupShown && !formSubmitted && window.innerWidth > 768) {
          console.log('[Exit-Intent] Condições satisfeitas! Abrindo popup...');
          showChatbotPopup();
          exitPopupShown = true;
        }
      });

      // Alternativa: mouseout do document
      document.addEventListener('mouseout', (e) => {
        // Se o relatedTarget é null, o mouse saiu da janela
        if (!e.relatedTarget && !e.toElement && !exitPopupShown && !formSubmitted && window.innerWidth > 768) {
          console.log('[Exit-Intent] mouseout detectado (fallback)');
          showChatbotPopup();
          exitPopupShown = true;
        }
      });

      // Botão Primário (ir para o formulário)
      const primaryBtn = $('#exitPopupPrimary');
      if (primaryBtn) {
        primaryBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closePopup(exitPopup);
          const formLink = $('a[href="#formulario"]');
          if (formLink) formLink.click();
        });
      }

      // Botão Secundário (abrir popup da agência)
      const secondaryBtn = $('#exitPopupSecondary');
      if (secondaryBtn) {
        secondaryBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closePopup(exitPopup);
          openPopup(agencyPopup);
        });
      }
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
      const url = 'https://n8n.alcinomenezesjunior.com/webhook/webhook-lead-capture';
      let done = false;

      // Método 1: fetch com CORS (preferencial - mais controlo)
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' }, // Evita preflight CORS
          body: JSON.stringify(payload),
          credentials: 'omit', // Não enviar cookies - evita erro CORS
          keepalive: true,
          cache: 'no-store'
        }).catch(err => {
          console.error('[AMJ] Erro ao enviar lead para n8n:', err.message);
        });
        done = true;
      } catch (err) {
        console.error('[AMJ] Erro ao enviar lead para n8n:', err.message);
      }

      // Método 2: sendBeacon como fallback (útil quando a página fecha)
      if (!done) {
        try {
          if (navigator.sendBeacon) {
            // Usar text/plain para evitar preflight CORS
            done = navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
          }
        } catch (err) {
          console.error('[AMJ] Erro no sendBeacon:', err.message);
        }
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

// === Demo bot WhatsApp simulado ===
(function () {
  const DEMO_WEBHOOK_URL =
    "https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp";

  const openBtn = document.getElementById("demo-bot-open");
  const widget = document.getElementById("demo-bot-widget");
  const closeBtn = document.getElementById("demo-bot-close");
  const messagesEl = document.getElementById("demo-bot-messages");
  const form = document.getElementById("demo-bot-form");
  const input = document.getElementById("demo-bot-input");

  if (!openBtn || !widget || !messagesEl || !form || !input) return;

  // ID de sessão fake para a demo
  const demoSessionId = "DEMO-" + Date.now();

  function appendMessage(text, from) {
    const div = document.createElement("div");
    div.className = "msg " + (from === "user" ? "msg-user" : "msg-bot");
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  openBtn.addEventListener("click", () => {
    widget.classList.remove("hidden");
    widget.setAttribute("aria-hidden", "false");
    input.focus();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      widget.classList.add("hidden");
      widget.setAttribute("aria-hidden", "true");
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";
    input.focus();

    try {
      const res = await fetch(DEMO_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: demoSessionId,
          mensagem: text,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Resposta do servidor não é JSON válido");
      }

      const replyText =
        data.reply || data.mensagem || data.message || JSON.stringify(data);

      appendMessage(replyText, "bot");
    } catch (err) {
      console.error(err);
      appendMessage(
        "⚠️ Ocorreu um erro na demo: " + (err.message || "Erro desconhecido"),
        "bot"
      );
    }
  });
})();

