(() => {
  const updateCountdown = (container) => {
    const target = container.getAttribute("data-countdown");
    if (!target) return;

    const targetTime = new Date(target).getTime();
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      container.classList.add("live");
      const card = container.closest(".countdown-card");
      const badge = card ? card.querySelector(".live-badge") : null;
      if (badge) badge.hidden = false;
      container.querySelectorAll(".number").forEach((el) => {
        el.textContent = "00";
      });
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remaining = seconds % 60;

    const setValue = (selector, value) => {
      const el = container.querySelector(selector);
      if (el) el.textContent = String(value).padStart(2, "0");
    };

    setValue("[data-days]", days);
    setValue("[data-hours]", hours);
    setValue("[data-minutes]", minutes);
    setValue("[data-seconds]", remaining);
  };

  const bindTabs = () => {
    document.querySelectorAll("[data-tabs]").forEach((tabs) => {
      const group = tabs.getAttribute("data-tabs");
      const buttons = tabs.querySelectorAll(".tab");
      const panels = document.querySelectorAll(`[data-tab-content='${group}']`);

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const target = button.getAttribute("data-tab");
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          panels.forEach((panel) => {
            const panelName = panel.getAttribute("data-tab-panel");
            panel.classList.toggle("hidden", panelName !== target);
          });
        });
      });
    });
  };

  const bindButtonLinks = () => {
    document.querySelectorAll("[data-button-link]").forEach((button) => {
      const url = button.getAttribute("data-button-link");
      if (!url) return;
      button.addEventListener("click", () => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    });
  };

  const bindShareButtons = () => {
    document.querySelectorAll("[data-share]").forEach((button) => {
      const title = button.getAttribute("data-share-title") || document.title;
      const url = button.getAttribute("data-share-url") || window.location.href;
      button.addEventListener("click", async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch (error) {
            // User cancelled or share failed; no action needed.
          }
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(url);
            button.dataset.shareStatus = "copied";
            const original = button.innerHTML;
            button.innerHTML = "Link Copied";
            window.setTimeout(() => {
              button.innerHTML = original;
              button.removeAttribute("data-share-status");
            }, 2000);
            return;
          } catch (error) {
            // Continue to fallback prompt.
          }
        }
        window.prompt("Copy this link:", url);
      });
    });
  };

  const bindNavToggle = () => {
    const nav = document.querySelector(".nav-actions");
    const toggle = document.querySelector(".nav-toggle-label");
    const links = nav ? nav.querySelector(".nav-links") : null;
    if (!nav || !toggle || !links) return;

    const setExpanded = (expanded) => {
      toggle.setAttribute("aria-expanded", String(expanded));
      nav.classList.toggle("is-open", expanded);
    };

    toggle.addEventListener("click", () => {
      setExpanded(!nav.classList.contains("is-open"));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setExpanded(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && nav.classList.contains("is-open")) {
        setExpanded(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setExpanded(false);
      }
    });
  };

  const init = () => {
    const countdowns = document.querySelectorAll(".countdown");
    if (countdowns.length) {
      countdowns.forEach(updateCountdown);
      setInterval(() => {
        countdowns.forEach(updateCountdown);
      }, 1000);
    }
    bindTabs();
    bindButtonLinks();
    bindShareButtons();
    bindNavToggle();
    document.querySelectorAll(".newsletter-form").forEach((form) => {
      const message = form.parentElement.querySelector(".form-success");
      const nameInput = form.querySelector("[data-newsletter-name]");
      const emailInput = form.querySelector("[data-newsletter-email]");
      const nameError = form.querySelector("[data-error-for='name']");
      const emailError = form.querySelector("[data-error-for='email']");

      const showError = (input, error, text) => {
        if (error) {
          error.textContent = text;
          error.hidden = false;
        }
        if (input) {
          input.setAttribute("aria-invalid", "true");
        }
      };

      const clearError = (input, error) => {
        if (error) {
          error.hidden = true;
        }
        if (input) {
          input.removeAttribute("aria-invalid");
        }
      };

      if (nameInput) {
        nameInput.addEventListener("input", () => {
          if (nameInput.validity.valid) {
            clearError(nameInput, nameError);
          }
          if (message) {
            message.hidden = true;
          }
        });
      }

      if (emailInput) {
        emailInput.addEventListener("input", () => {
          if (emailInput.validity.valid) {
            clearError(emailInput, emailError);
          }
          if (message) {
            message.hidden = true;
          }
        });
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let hasError = false;
        let firstInvalid = null;

        if (nameInput && !nameInput.checkValidity()) {
          showError(nameInput, nameError, "Enter your name.");
          hasError = true;
          firstInvalid = firstInvalid || nameInput;
        } else {
          clearError(nameInput, nameError);
        }

        if (emailInput && !emailInput.checkValidity()) {
          showError(emailInput, emailError, "Enter a valid email address.");
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        } else {
          clearError(emailInput, emailError);
        }

        if (hasError) {
          if (firstInvalid) {
            firstInvalid.focus();
          }
          return;
        }
        const action = form.getAttribute("action");
        if (!action) {
          return;
        }
        if (form.dataset.submitting === "true") {
          return;
        }
        form.dataset.submitting = "true";
        const payload = new FormData(form);
        fetch(action, {
          method: "POST",
          body: payload,
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Subscribe failed");
            }
            if (message) {
              message.hidden = false;
            }
            form.reset();
          })
          .catch(() => {
            form.dataset.submitting = "false";
            form.submit();
          })
          .finally(() => {
            form.dataset.submitting = "false";
          });
      });
    });
  };

  const runWhenReady = () => {
    const onReady = () => {
      window.setTimeout(init, 0);
    };
    if (document.readyState === "complete") {
      onReady();
      return;
    }
    window.addEventListener("load", onReady, { once: true });
  };

  runWhenReady();
})();
