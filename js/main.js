(() => {
  const body = document.body;
  const loadingScreen = document.getElementById("loading-screen");
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const year = document.getElementById("year");
  const typewriter = document.getElementById("typewriter");
  const canvas = document.getElementById("particles-canvas");
  const leadForm = document.getElementById("lead-form");
  const formNote = document.getElementById("form-note");
  const floatingCta = document.querySelector(".whatsapp-float");

  body.classList.add("loading");

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loadingScreen?.classList.add("is-hidden");
      body.classList.remove("loading");
    }, 420);
  });

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const closeMenu = () => {
    navToggle?.classList.remove("is-active");
    mainNav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = mainNav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    body.classList.toggle("nav-open", Boolean(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const handleHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  handleHeader();
  window.addEventListener("scroll", handleHeader, { passive: true });

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const words = ["tortas ahogadas", "tacos de pescado", "tacos de camarón", "salsas con carácter"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tickTypewriter = () => {
    if (!typewriter) return;
    const current = words[wordIndex];
    typewriter.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      window.setTimeout(tickTypewriter, 72);
      return;
    }

    if (!deleting && charIndex === current.length) {
      deleting = true;
      window.setTimeout(tickTypewriter, 1250);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(tickTypewriter, 38);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(tickTypewriter, 180);
  };

  tickTypewriter();

  const sections = [...document.querySelectorAll("main section[id]")];
  const updateActiveLink = () => {
    const activeOffset = Math.min(280, window.innerHeight * 0.35);
    const current = sections
      .map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }))
      .filter((section) => section.top <= activeOffset)
      .pop();

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id || "inicio"}`);
    });

    const contact = document.getElementById("contacto");
    if (contact && floatingCta) {
      const rect = contact.getBoundingClientRect();
      const isContactVisible = rect.top < window.innerHeight * 0.72 && rect.bottom > 160;
      floatingCta.classList.toggle("is-hidden", isContactVisible);
    }
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });

  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();

    if (!name || !contact) {
      if (formNote) formNote.textContent = "Agrega nombre y un medio de contacto.";
      return;
    }

    if (formNote) formNote.textContent = "Solicitud preparada. Conecta el canal oficial para recibir pedidos.";
    leadForm.reset();
  });

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(28, Math.min(72, Math.floor(width / 22)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      vx: (Math.random() - 0.5) * 0.32,
      vy: Math.random() * -0.34 - 0.08,
      color: Math.random() > 0.5 ? "rgba(248,199,47,0.58)" : "rgba(0,152,173,0.42)"
    }));
  };

  const drawParticles = () => {
    if (!ctx || mediaQuery.matches) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.y < -12) particle.y = height + 12;
      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;

      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = window.requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
  mediaQuery.addEventListener?.("change", () => {
    window.cancelAnimationFrame(animationFrame);
    if (!mediaQuery.matches) drawParticles();
  });
})();
