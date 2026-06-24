(function () {
  "use strict";

  /* ============ Footer year ============ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ Theme toggle (persists for this session only) ============ */
  var body = document.body;
  var themeToggle = document.getElementById("themeToggle");
  var themeLabel = themeToggle ? themeToggle.querySelector(".theme-toggle__label") : null;

  function setTheme(theme) {
    body.setAttribute("data-theme", theme);
    if (themeToggle) {
      var isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", "Switch to " + (isLight ? "dark" : "light") + " theme");
      if (themeLabel) themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
    }
  }

  // Respect OS preference on first load, but let the user override during the session.
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = body.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ============ Mobile nav rail toggle ============ */
  var navToggle = document.getElementById("navToggle");
  var railNav = document.getElementById("railNav");
  var railBackdrop = document.getElementById("railBackdrop");

  function closeNav() {
    railNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    railBackdrop.hidden = true;
  }
  function openNav() {
    railNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    railBackdrop.hidden = false;
  }
  if (navToggle && railNav && railBackdrop) {
    navToggle.addEventListener("click", function () {
      var isOpen = railNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    railBackdrop.addEventListener("click", closeNav);

    // Close nav after choosing a section (mobile)
    railNav.querySelectorAll(".stage-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 900) closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ============ Active section highlighting in nav ============ */
  var stageLinks = Array.prototype.slice.call(document.querySelectorAll(".stage-link"));
  var sections = stageLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActiveLink(id) {
    stageLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        // Pick the entry most visible in the viewport
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (visible.length) {
          visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
          setActiveLink(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ============ Collapsible role panels ============ */
  var roleTriggers = document.querySelectorAll(".role__trigger");
  roleTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      var panelId = trigger.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ============ Scroll-triggered funnel bars ============ */
  var funnelBars = document.querySelectorAll(".funnel__bar");
  funnelBars.forEach(function (bar) {
    var w = bar.getAttribute("data-width");
    bar.style.setProperty("--w", w + "%");
  });

  var langBars = document.querySelectorAll(".lang__bar");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    funnelBars.forEach(function (bar) { revealObserver.observe(bar); });
    langBars.forEach(function (bar) { revealObserver.observe(bar); });
  } else {
    funnelBars.forEach(function (bar) { bar.classList.add("is-visible"); });
    langBars.forEach(function (bar) { bar.classList.add("is-visible"); });
  }

  /* ============ Commercial Performance report tabs ============ */
  var dealTabs = document.querySelectorAll(".deal__tab");
  var dealSlides = document.querySelectorAll(".deal__slide");

  function activateSlide(index) {
    dealTabs.forEach(function (tab) {
      var match = tab.getAttribute("data-slide") === String(index);
      tab.classList.toggle("is-active", match);
      tab.setAttribute("aria-selected", String(match));
    });
    dealSlides.forEach(function (slide) {
      slide.classList.toggle("is-active", slide.getAttribute("data-slide") === String(index));
    });
  }

  dealTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateSlide(tab.getAttribute("data-slide"));
    });
  });

  /* ============ Dashboard lightbox ============ */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocusedTrigger = null;

  var lightboxSources = {
    "sales-revenue": {
      src: "assets/dashboards/sales-revenue.jpg",
      alt: "Sales and revenue dashboard showing 1.04M total revenue, 18K sales quantity, 5K sold orders, revenue by year trend line, revenue by category and segment pie charts, monthly revenue and profit bars, and top 5 customers by name."
    },
    "hr-attrition": {
      src: "assets/dashboards/hr-attrition.jpg",
      alt: "HR Attrition Report dashboard with filters for Job Role, Age, Marital Status and Department, showing 6.50K average salary, 17.5% attrition rate, and breakdowns by job role, travel, marital status, department, and gender."
    }
  };
  var commercialSlideSources = [
    { src: "assets/dashboards/commercial-overview.jpg", alt: "Commercial Performance Overview page with total revenue, customers, units sold, growth profit and profit margin KPIs, revenue by category, and revenue by channel." },
    { src: "assets/dashboards/commercial-market-dynamics.jpg", alt: "Market Dynamics and Trends page showing monthly average revenue, growth margin, revenue and unique customers by month, discount by quarter, and revenue by city." },
    { src: "assets/dashboards/commercial-demographics.jpg", alt: "Customer Demographics page showing revenue by age, a regional map, growth profit by season, a customer segment table, and revenue by gender." },
    { src: "assets/dashboards/commercial-promotion.jpg", alt: "Promotion page showing growth profit and revenue by category, total discount amount, a promotion performance table, and growth revenue by channel." }
  ];

  function openLightbox(src, alt, triggerEl) {
    lightboxImg.setAttribute("src", src);
    lightboxImg.setAttribute("alt", alt);
    lightbox.hidden = false;
    lastFocusedTrigger = triggerEl || null;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.setAttribute("src", "");
    document.body.style.overflow = "";
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  document.querySelectorAll("[data-lightbox-target]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var key = trigger.getAttribute("data-lightbox-target");
      if (key === "commercial") {
        var activeTab = document.querySelector(".deal__tab.is-active");
        var idx = activeTab ? parseInt(activeTab.getAttribute("data-slide"), 10) : 0;
        var slide = commercialSlideSources[idx] || commercialSlideSources[0];
        openLightbox(slide.src, slide.alt, trigger);
      } else if (lightboxSources[key]) {
        openLightbox(lightboxSources[key].src, lightboxSources[key].alt, trigger);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });


  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("contactStatus");

  function showError(fieldId, message) {
    var errorEl = document.getElementById(fieldId + "-error");
    if (errorEl) errorEl.textContent = message;
  }
  function clearErrors() {
    ["cf-name", "cf-email", "cf-message"].forEach(function (id) {
      showError(id, "");
    });
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var name = document.getElementById("cf-name").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var message = document.getElementById("cf-message").value.trim();
      var valid = true;

      if (!name) {
        showError("cf-name", "Please enter your name.");
        valid = false;
      }
      if (!email) {
        showError("cf-email", "Please enter your email.");
        valid = false;
      } else if (!isValidEmail(email)) {
        showError("cf-email", "Please enter a valid email address.");
        valid = false;
      }
      if (!message) {
        showError("cf-message", "Please add a short message.");
        valid = false;
      }

      if (!valid) {
        statusEl.textContent = "";
        return;
      }

      var subject = "Portfolio inquiry from " + name;
      var body =
        message +
        "\n\n---\nFrom: " + name + "\nReply to: " + email;

      var mailto =
        "mailto:nsdawoud@outlook.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
      statusEl.textContent = "Opening your email app to send this message…";
      form.reset();
    });
  }
})();
