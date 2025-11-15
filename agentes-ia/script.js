/* =========================================================
   AMJ Automação & IA — /lpagencia/script.js (v16, OPTIMIZED)
   ---------------------------------------------------------
   • Contador até ao fim do mês (Europe/Lisbon)
   • WhatsApp tracking + UTMs + fallback robusto
   • Performance optimizations
   ========================================================= */

(function () {
  'use strict';

  // ---------- Helpers
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function onReady(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  // ---------- Countdown (end of current month, Europe/Lisbon)
  function initCountdown() {
    const dd = $('#dd'), hh = $('#hh'), mm = $('#mm'), ss = $('#ss');
    if (!dd || !hh || !mm || !ss) return;

    const lisbonNow = () =>
      new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));

    function endOfMonthLisbon(ref = lisbonNow()) {
      const y = ref.getFullYear();
      const m = ref.getMonth();
      return new Date(y, m + 1, 0, 23, 59, 59);
    }

    let target = endOfMonthLisbon();

    function tick() {
      const now = lisbonNow();
      let diff = Math.floor((target.getTime() - now.getTime()) / 1000);

      if (diff <= 0) {
        target = endOfMonthLisbon();
        diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      }

      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600);  diff -= h * 3600;
      const m = Math.floor(diff / 60);    diff -= m * 60;
      const s = diff;

      dd.textContent = String(d).padStart(2, '0');
      hh.textContent = String(h).padStart(2, '0');
      mm.textContent = String(m).padStart(2, '0');
      ss.textContent = String(s).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  // ---------- WhatsApp automation & tracking
  const CONFIG = {
    whatsappNumber: '351926698959',
    defaultMsg: 'Olá AMJ! Quero aumentar as minhas vendas.',
    defaultSource: 'cta_final',
    trackingEnabled: true
  };

  function getUTMParams() {
    const src = new URLSearchParams(window.location.search);
    const allowed = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
    const utms = {};
    let hasAny = false;
    for (const k of allowed) {
      if (src.has(k)) { utms[k] = src.get(k); hasAny = true; }
    }
    if (!hasAny) {
      utms.utm_source = 'site';
      utms.utm_medium = 'whatsapp';
      utms.utm_campaign = 'lpagencia';
    }
    return utms;
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    return {
      userAgent: ua,
      isMobile,
      isIOS,
      isAndroid,
      lang: navigator.language || 'pt-PT',
      viewport: { w: window.innerWidth, h: window.innerHeight }
    };
  }

  function generateLeadID() {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `AMJ-${Date.now()}-${rand}`;
  }

  function buildWhatsAppMessage(source, leadID, utms) {
    return (
      `Olá! Quero aumentar as minhas vendas com Automação & IA.\n` +
      `— Tipo: Consultoria/Serviço\n` +
      `— Quando falar: hoje/amanhã\n\n` +
      `Obrigado!`
    );
  }

  function saveLeadTracking(payload) {
    try {
      const key = 'amj_whatsapp_leads';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.unshift(payload);
      while (arr.length > 50) arr.pop();
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(_) {}
  }

  function buildWhatsAppURL(source = CONFIG.defaultSource) {
    const leadID = generateLeadID();
    const utms   = getUTMParams();
    const device = getDeviceInfo();

    const message = buildWhatsAppMessage(source, leadID, utms);

    const url = new URL(`https://wa.me/${CONFIG.whatsappNumber}`);
    url.searchParams.set('text', message);

    Object.entries(utms).forEach(([k,v]) => url.searchParams.set(k, v));

    saveLeadTracking({
      leadID,
      timestamp: new Date().toISOString(),
      source,
      utms,
      device,
      page: window.location.pathname,
      referrer: document.referrer || 'direct'
    });

    window.dataLayer = window.dataLayer || [];
    if (CONFIG.trackingEnabled) {
      window.dataLayer.push({
        event: 'whatsapp_click',
        lead_id: leadID,
        cta_source: source,
        ...utms,
        ...device
      });
    }

    return url.toString();
  }

  function handleWhatsAppClick(e, el) {
    const source = el.getAttribute('data-wa-source') || CONFIG.defaultSource;
    try {
      const url = buildWhatsAppURL(source);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('[AMJ] WhatsApp error:', err);
      return;
    }
    e.preventDefault();
  }

  function initWhatsAppTracking() {
    const targets = [
      ...$$('[data-cta-type="whatsapp"]'),
      ...$$('.js-wa')
    ];

    if (!targets.length) return;

    targets.forEach(el => {
      el.addEventListener('click', (e) => handleWhatsAppClick(e, el));
    });
  }

  function applyWhatsAppHrefDefaults() {
    const targets = [
      ...document.querySelectorAll('[data-cta-type="whatsapp"]'),
      ...document.querySelectorAll('.js-wa')
    ];
    if (!targets.length) return;

    targets.forEach(el => {
      const source = el.getAttribute('data-wa-source') || CONFIG.defaultSource;
      try {
        const url = buildWhatsAppURL(source);
        el.setAttribute('href', url);
        if (!el.getAttribute('target')) el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } catch (e) {
        console.warn('[AMJ] applyWhatsAppHrefDefaults fallback:', e);
      }
    });
  }

  // ---------- Performance: Lazy load images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
            observer.unobserve(img);
          }
        });
      });
      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ---------- Init
  onReady(() => {
    initCountdown();
    applyWhatsAppHrefDefaults();
    initWhatsAppTracking();
    initLazyLoading();
  });

})();
