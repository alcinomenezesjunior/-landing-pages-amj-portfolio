/* =========================================================
   AMJ Tráfego Pago — Clínicas Estética (v14)
   ---------------------------------------------------------
   • Smooth scroll
   • Validação formulário
   • Contador até fim do mês (Europe/Lisbon)
   • WhatsApp com UTM params
   • Exit Intent Pop-up
   • GTM Tracking
   ========================================================= */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    smoothScroll();
    formValidation();
    initCountdown();
    initWhatsAppUTM();
    initExitIntent();
    initGTMTracking();
  
    initCertLightbox();
  });

  /* Smooth scroll */
  function smoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        const el = id && id.length > 1 ? $(id) : null;
        if (el) { 
          e.preventDefault(); 
          el.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
      });
    });
  }

  /* Validação formulário */
  function formValidation() {
    const form = $('#leadForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      let ok = true;
      $$('input[required], select[required]', form).forEach(el => {
        const invalid = (el.type === 'checkbox' && !el.checked) || (!el.value && el.type !== 'checkbox');
        el.classList.toggle('is-invalid', invalid);
        if (invalid) ok = false;
      });
      if (!ok) {
        e.preventDefault();
        
        // GTM tracking
        pushToDataLayer({
          event: 'form_validation_error',
          form_name: 'leadForm'
        });
      } else {
        // GTM tracking sucesso
        pushToDataLayer({
          event: 'form_submit_success',
          form_name: 'leadForm',
          lead_source: 'trafego_pago_estetica'
        });
      }
    });

    form.addEventListener('input', (e) => {
      const t = e.target;
      if (t.classList.contains('is-invalid') && (t.value || (t.type==='checkbox' && t.checked))) {
        t.classList.remove('is-invalid');
      }
    });
  }

  /* Contador fim do mês (Europe/Lisbon) */
  /* Contador Black November (Europe/Lisbon) até 30/11/2025 23:59:59 + estado de expiração */
function initCountdown() {
  const dd = document.querySelector('#dd'),
        hh = document.querySelector('#hh'),
        mm = document.querySelector('#mm'),
        ss = document.querySelector('#ss');
  if (!dd || !hh || !mm || !ss) return;

  const lisbonNow = () =>
    new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));

  // 30/11/2025 23:59:59 Europe/Lisbon (Novembro ~ UTC+0)
  const target = new Date(Date.UTC(2025, 10, 30, 23, 59, 59)); // mês 10 = Novembro

  const heading = document.querySelector('#urgencia h2');
  const ofertaBtn = document.querySelector('#oferta .btn');

  let ended = false;
  function renderEndedState(){
    if (ended) return;
    ended = true;
    dd.textContent = hh.textContent = mm.textContent = ss.textContent = '00';
    if (heading) heading.textContent = 'Oferta encerrada';
    if (ofertaBtn) {
      ofertaBtn.textContent = 'Oferta encerrada';
      ofertaBtn.setAttribute('aria-disabled', 'true');
      ofertaBtn.style.pointerEvents = 'none';
      ofertaBtn.style.filter = 'grayscale(1)';
      ofertaBtn.style.opacity = '0.7';
    }
  }

  function tick() {
    const now = lisbonNow();
    let diff = Math.floor((target.getTime() - now.getTime()) / 1000);

    if (diff <= 0) {
      renderEndedState();
      return;
    }

    const d = Math.floor(diff / 86400); diff %= 86400;
    const h = Math.floor(diff / 3600);  diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;

    dd.textContent = String(d).padStart(2,'0');
    hh.textContent = String(h).padStart(2,'0');
    mm.textContent = String(m).padStart(2,'0');
    ss.textContent = String(s).padStart(2,'0');
  }

  tick();
  const iv = setInterval(() => {
    tick();
    if (ended) clearInterval(iv);
  }, 1000);
}

