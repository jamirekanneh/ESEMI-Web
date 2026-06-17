(function initPortalUI() {
  function ensureHost() {
    let host = document.getElementById("pSnackbarHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "pSnackbarHost";
      host.className = "p-snackbar-host";
      host.setAttribute("aria-live", "polite");
      host.setAttribute("aria-atomic", "true");
      document.body.appendChild(host);
    }
    return host;
  }

  function showSnackbar(message, type = "info", duration = 4200) {
    const host = ensureHost();
    const bar = document.createElement("div");
    bar.className = `p-snackbar p-snackbar--${type}`;
    bar.innerHTML = `
      <span class="p-snackbar__dot" aria-hidden="true"></span>
      <span class="p-snackbar__text">${escapeHtml(String(message || ""))}</span>
      <button type="button" class="p-snackbar__close" aria-label="Dismiss">&times;</button>
    `;
    const remove = () => {
      if (!bar.isConnected) return;
      bar.classList.add("is-out");
      window.setTimeout(() => bar.remove(), 220);
    };
    bar.querySelector(".p-snackbar__close").addEventListener("click", remove);
    host.appendChild(bar);
    if (duration > 0) window.setTimeout(remove, duration);
    return remove;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildDialog({ title, message, confirmLabel, cancelLabel, danger, input, placeholder, defaultValue }) {
    const overlay = document.createElement("div");
    overlay.className = "p-modal is-open";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    const inputHtml = input
      ? `<input class="p-input" id="pDialogInput" type="${input === "password" ? "password" : "text"}" placeholder="${escapeHtml(placeholder || "")}" value="${escapeHtml(defaultValue || "")}" style="margin-bottom:var(--p-space-4);" />`
      : "";
    overlay.innerHTML = `
      <div class="p-modal__box">
        <h3>${escapeHtml(title || "Confirm")}</h3>
        ${message ? `<p class="p-dialog__message">${escapeHtml(message)}</p>` : ""}
        ${inputHtml}
        <div class="p-row" style="justify-content:flex-end;">
          <button type="button" class="p-btn p-btn--ghost p-btn--sm" data-action="cancel">${escapeHtml(cancelLabel || "Cancel")}</button>
          <button type="button" class="p-btn p-btn--sm ${danger ? "p-btn--accent" : "p-btn--accent"}" data-action="confirm">${escapeHtml(confirmLabel || "OK")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const inputEl = overlay.querySelector("#pDialogInput");
    if (inputEl) {
      window.setTimeout(() => inputEl.focus(), 50);
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") overlay.querySelector('[data-action="confirm"]').click();
      });
    }
    return overlay;
  }

  function confirmDialog(options = {}) {
    return new Promise((resolve) => {
      const overlay = buildDialog({
        title: options.title || "Are you sure?",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        danger: Boolean(options.danger),
      });
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      overlay.querySelector('[data-action="cancel"]').addEventListener("click", () => finish(false));
      overlay.querySelector('[data-action="confirm"]').addEventListener("click", () => finish(true));
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(false);
      });
    });
  }

  function promptDialog(options = {}) {
    return new Promise((resolve) => {
      const overlay = buildDialog({
        title: options.title || "Enter value",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "Save",
        cancelLabel: options.cancelLabel || "Cancel",
        input: options.inputType || "text",
        placeholder: options.placeholder || "",
        defaultValue: options.defaultValue || "",
      });
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      overlay.querySelector('[data-action="cancel"]').addEventListener("click", () => finish(null));
      overlay.querySelector('[data-action="confirm"]').addEventListener("click", () => {
        const inputEl = overlay.querySelector("#pDialogInput");
        finish(inputEl ? inputEl.value : "");
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(null);
      });
    });
  }

  window.PUI = {
    snackbar: showSnackbar,
    success: (msg, duration) => showSnackbar(msg, "success", duration),
    error: (msg, duration) => showSnackbar(msg, "error", duration),
    info: (msg, duration) => showSnackbar(msg, "info", duration),
    warning: (msg, duration) => showSnackbar(msg, "warning", duration),
    confirm: confirmDialog,
    prompt: promptDialog,
  };
})();
