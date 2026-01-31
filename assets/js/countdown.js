(() => {
  const updateCountdown = (container) => {
    const target = container.getAttribute("data-countdown");
    if (!target) return;

    const targetTime = new Date(target).getTime();
    const now = Date.now();
    const end = Number(container.getAttribute("data-end"));
    if (Number.isFinite(end) && end > 0 && now >= end * 1000) {
      const card = container.closest(".countdown-card");
      const badge = card ? card.querySelector(".live-badge") : null;
      if (badge) badge.hidden = true;
      container.classList.remove("live");
      container.querySelectorAll(".number").forEach((el) => {
        el.textContent = "00";
      });
      return;
    }
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

  const buildUpcomingSchedule = (card) => {
    const raw = card.dataset.schedule;
    if (!raw) return null;
    let schedule = [];
    try {
      schedule = JSON.parse(raw);
    } catch (error) {
      return null;
    }
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return null;
    }
    const normalize = (item) => ({
      ...item,
      start: Number(item.start),
      end: Number(item.end),
    });
    const normalized = schedule.map(normalize).filter((item) => item.start && item.end);
    if (!normalized.length) return null;

    return {
      card,
      countdown: card.querySelector(".countdown"),
      topic: card.querySelector("[data-upcoming-topic]"),
      subtopic: card.querySelector("[data-upcoming-subtopic]"),
      start: card.querySelector("[data-upcoming-start]"),
      speakerWrap: card.querySelector(".upcoming-speaker"),
      speakerName: card.querySelector("[data-upcoming-speaker-name]"),
      speakerTitle: card.querySelector("[data-upcoming-speaker-title]"),
      cta: card.querySelector("[data-upcoming-cta]"),
      schedule: normalized.sort((a, b) => a.start - b.start),
      currentKey: null,
    };
  };

  const selectUpcomingItem = (items, now) => {
    const live = items.filter(
      (item) => now >= item.start * 1000 && now < item.end * 1000
    );
    if (live.length) {
      return live[0];
    }
    const upcoming = items.filter((item) => now < item.start * 1000);
    if (upcoming.length) {
      return upcoming[0];
    }
    return null;
  };

  const updateUpcomingCard = (state) => {
    const now = Date.now();
    const next = selectUpcomingItem(state.schedule, now);
    if (!next) return;
    const key = `${next.start}-${next.ctaLink}-${next.topic}`;
    if (state.currentKey === key) return;
    state.currentKey = key;

    if (state.topic) state.topic.textContent = next.topic || "";
    if (state.subtopic) {
      state.subtopic.textContent = next.subtopic || "";
      state.subtopic.classList.toggle("hidden", !next.subtopic);
    }
    if (state.start) state.start.textContent = next.startLabel || "";
    if (state.speakerWrap) {
      const hasSpeaker = Boolean(next.speaker);
      state.speakerWrap.classList.toggle("hidden", !hasSpeaker);
      if (state.speakerName) state.speakerName.textContent = next.speaker || "";
      if (state.speakerTitle) {
        state.speakerTitle.textContent = next.speakerTitle ? `- ${next.speakerTitle}` : "";
        state.speakerTitle.classList.toggle("hidden", !next.speakerTitle);
      }
    }
    if (state.cta) {
      state.cta.textContent = next.ctaLabel || "View Details";
      state.cta.setAttribute("href", next.ctaLink || "#");
      if (next.ctaExternal) {
        state.cta.setAttribute("target", "_blank");
        state.cta.setAttribute("rel", "noreferrer");
      } else {
        state.cta.removeAttribute("target");
        state.cta.removeAttribute("rel");
      }
    }
    if (state.countdown) {
      if (next.startISO) {
        state.countdown.setAttribute("data-countdown", next.startISO);
      }
      if (next.end) {
        state.countdown.setAttribute("data-end", String(next.end));
      }
    }
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
      const text = button.getAttribute("data-share-text") || "";
      const url = button.getAttribute("data-share-url") || window.location.href;
      button.addEventListener("click", async () => {
        if (navigator.share) {
          try {
            const payload = text ? { title, text, url } : { title, url };
            await navigator.share(payload);
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
    const upcomingCards = [];
    document.querySelectorAll(".countdown-card[data-schedule]").forEach((card) => {
      const schedule = buildUpcomingSchedule(card);
      if (schedule) {
        upcomingCards.push(schedule);
        updateUpcomingCard(schedule);
      }
    });
    if (countdowns.length) {
      countdowns.forEach(updateCountdown);
      setInterval(() => {
        if (upcomingCards.length) {
          upcomingCards.forEach(updateUpcomingCard);
        }
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
        const submitUrl = form.dataset.submitUrl || form.getAttribute("action");
        if (!submitUrl) {
          return;
        }
        if (form.dataset.submitting === "true") {
          return;
        }
        form.dataset.submitting = "true";
        const payload = new FormData(form);
        const isKitForm = /app\.(kit|convertkit)\.com\/forms\//.test(submitUrl);
        if (isKitForm) {
          let target = form.dataset.kitTarget;
          if (!target) {
            target = `kit-subscribe-${Math.random().toString(36).slice(2)}`;
            const iframe = document.createElement("iframe");
            iframe.name = target;
            iframe.title = "Kit subscribe target";
            iframe.hidden = true;
            iframe.style.position = "absolute";
            iframe.style.left = "-9999px";
            iframe.style.width = "1px";
            iframe.style.height = "1px";
            document.body.appendChild(iframe);
            form.setAttribute("target", target);
            form.dataset.kitTarget = target;
          }
          const originalAction = form.getAttribute("action");
          form.setAttribute("action", submitUrl);
          form.submit();
          if (originalAction) {
            form.setAttribute("action", originalAction);
          } else {
            form.removeAttribute("action");
          }
          if (message) {
            message.hidden = false;
          }
          form.reset();
          form.dataset.submitting = "false";
          return;
        }
        fetch(submitUrl, {
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
            form.setAttribute("action", submitUrl);
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
