/* =====================================================================
   Syntax Scripts - shared UI helpers
   Loaded by other resources via: nui://syx-ui/html/ui.js
   Exposes window.SyxUI = { post, icon, toast, showModal, closeMenuKeys }
   ===================================================================== */

window.SyxUI = (function () {
  const resource = (typeof GetParentResourceName === 'function') ? GetParentResourceName() : 'syx-ui-preview';

  function post(endpoint, data) {
    return fetch(`https://${resource}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data || {}),
    }).catch(() => {});
  }

  function icon(map, key, extraClass) {
    const path = map[key] || Object.values(map)[0] || '';
    return `<svg viewBox="0 0 24 24" class="${extraClass || ''}">${path}</svg>`;
  }

  // ---- toast ----
  let toastWrap = null;
  function ensureToastWrap() {
    if (toastWrap) return toastWrap;
    toastWrap = document.createElement('div');
    toastWrap.id = 'syx-toast-wrap';
    document.body.appendChild(toastWrap);
    return toastWrap;
  }
  function toast(message, type) {
    const wrap = ensureToastWrap();
    const el = document.createElement('div');
    el.className = `syx-toast${type === 'error' ? ' error' : ''}`;
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 200);
    }, 2200);
  }

  // ---- modal ----
  // showModal({ title, message, options: [{icon, title, desc, value}], actions: [{label, value, style}] })
  // Resolves with the chosen `value`, or null if dismissed.
  function showModal(cfg) {
    return new Promise(resolve => {
      const backdrop = document.createElement('div');
      backdrop.className = 'syx-modal-backdrop';

      const optionsHtml = (cfg.options || []).map((o, i) => `
        <div class="modal-option" data-i="${i}">
          ${o.icon ? `<svg viewBox="0 0 24 24" class="icon">${o.icon}</svg>` : ''}
          <div class="opt-text"><b>${o.title}</b>${o.desc ? `<span>${o.desc}</span>` : ''}</div>
        </div>
      `).join('');

      const actionsHtml = (cfg.actions || []).map((a, i) => `
        <button class="${a.style === 'accent' ? 'btn-accent' : 'btn-ghost'}" data-a="${i}" style="flex:1">${a.label}</button>
      `).join('');

      backdrop.innerHTML = `
        <div class="syx-modal">
          <h3>${cfg.title || ''}</h3>
          ${cfg.message ? `<p>${cfg.message}</p>` : ''}
          ${optionsHtml ? `<div class="modal-options">${optionsHtml}</div>` : ''}
          ${actionsHtml ? `<div class="modal-actions">${actionsHtml}</div>` : ''}
        </div>
      `;

      function cleanup(value) {
        backdrop.remove();
        resolve(value);
      }

      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) cleanup(null);
      });

      backdrop.querySelectorAll('.modal-option').forEach(el => {
        el.addEventListener('click', () => {
          const opt = cfg.options[Number(el.dataset.i)];
          cleanup(opt.value);
        });
      });
      backdrop.querySelectorAll('[data-a]').forEach(el => {
        el.addEventListener('click', () => {
          const act = cfg.actions[Number(el.dataset.a)];
          cleanup(act.value);
        });
      });

      document.body.appendChild(backdrop);
    });
  }

  return { post, icon, toast, showModal, resource };
})();
