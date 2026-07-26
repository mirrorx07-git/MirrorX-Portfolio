// ==========================================
// MIRRORX PORTFOLIO - MAIN JAVASCRIPT
// FINAL ULTIMATE VERSION v4.0
// ALL ANIMATIONS FIXED & PERFECTED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // DEVICE DETECTION
  // ==========================================
  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ==========================================
  // PARTICLE BACKGROUND
  // ==========================================
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let particleAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 200);
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? "0, 240, 255" : "191, 0, 255";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      if (!isTouchDevice) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    let count;
    if (isMobile) {
      count = 25;
    } else if (isTablet) {
      count = 45;
    } else {
      count = Math.min(75, Math.floor(window.innerWidth * 0.04));
    }
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    if (isMobile) return;
    const maxDist = isTablet ? 100 : 120;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let isPageVisible = true;

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && !particleAnimationId) {
      animateParticles();
    }
  });

  function animateParticles() {
    if (!isPageVisible) {
      particleAnimationId = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    particleAnimationId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  if (!isTouchDevice) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  // ==========================================
  // CURSOR GLOW EFFECT
  // ==========================================
  const cursorGlow = document.getElementById("cursorGlow");

  if (!isTouchDevice && cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
      });
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = "none";
  }

  // ==========================================
  // NAVBAR WITH HOVER ANIMATIONS
  // ==========================================
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navLinksList = document.querySelectorAll(".nav-link");

  // Throttled scroll handler
  let scrollThrottleTimer;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollThrottleTimer) return;
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;

        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }

        const sections = document.querySelectorAll("section[id]");
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute("id");

          if (scrollPos >= top && scrollPos < top + height) {
            navLinksList.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("data-section") === id) {
                link.classList.add("active");
              }
            });
          }
        });
      }, 50);
    },
    { passive: true },
  );

  // Mobile nav toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "";
  });

  navLinksList.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ==========================================
  // NAVBAR LINK HOVER ANIMATIONS
  // ==========================================
  navLinksList.forEach((link) => {
    // Create magnetic hover effect
    link.addEventListener("mouseenter", (e) => {
      link.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
      link.style.transform = "translateY(-2px) scale(1.05)";
      link.style.color = "#00f0ff";
      link.style.textShadow = "0 0 15px rgba(0, 240, 255, 0.5)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transition = "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)";
      link.style.transform = "translateY(0) scale(1)";
      // Only remove color if not active
      if (!link.classList.contains("active")) {
        link.style.color = "";
        link.style.textShadow = "";
      }
    });

    // Ripple click effect
    link.addEventListener("click", function (e) {
      // Create ripple
      const ripple = document.createElement("span");
      ripple.classList.add("nav-ripple");
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================================
  // TYPING EFFECT - HERO GREETING
  // ==========================================
  const greetingText = "Hello, World! I'm";
  const greetingEl = document.getElementById("typingGreeting");
  let greetingIndex = 0;

  function typeGreeting() {
    if (greetingEl && greetingIndex < greetingText.length) {
      greetingEl.textContent += greetingText.charAt(greetingIndex);
      greetingIndex++;
      setTimeout(typeGreeting, 80);
    }
  }

  if (prefersReducedMotion) {
    if (greetingEl) greetingEl.textContent = greetingText;
  } else {
    setTimeout(typeGreeting, 500);
  }

  // ==========================================
  // ROTATING TITLES — FULLY FIXED VERSION
  // ==========================================
  const titles = [
    "Full Stack Developer",
    "Graphics Designer",
    "Video Editor",
    "Photo & Portrait Editor",
    "Discord Bot Developer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
  ];

  const rotatingTitleEl = document.getElementById("rotatingTitle");

  if (rotatingTitleEl) {
    let titleIndex = 0;
    let titleCharIdx = 0;
    let deleting = false;
    let titleTimer = null;

    function runTyping() {
      const current = titles[titleIndex];

      if (!deleting) {
        // — TYPE one character forward
        titleCharIdx++;
        rotatingTitleEl.textContent = current.substring(0, titleCharIdx);

        if (titleCharIdx === current.length) {
          // Finished typing → pause then start deleting
          deleting = true;
          titleTimer = setTimeout(runTyping, 2000);
          return;
        }
        titleTimer = setTimeout(runTyping, 100);
      } else {
        // — DELETE one character backward
        titleCharIdx--;
        rotatingTitleEl.textContent = current.substring(0, titleCharIdx);

        if (titleCharIdx === 0) {
          // Finished deleting → move to next title
          deleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          titleTimer = setTimeout(runTyping, 500);
          return;
        }
        titleTimer = setTimeout(runTyping, 50);
      }
    }

    // Start after the greeting finishes typing
    titleTimer = setTimeout(runTyping, 2000);

    // Pause when tab is hidden, resume when visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearTimeout(titleTimer);
      } else {
        titleTimer = setTimeout(runTyping, 300);
      }
    });
  }

  // ==========================================
  // STATS COUNTER ANIMATION — FIXED
  // ==========================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsCounted = false;

  function animateCounters() {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      const duration = 2500;
      const startTime = performance.now();

      // Ease-out function for natural deceleration
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(easedProgress * target);

        stat.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ==========================================
  // SKILL BARS ANIMATION — FIXED
  // ==========================================
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    const skillFills = document.querySelectorAll(".skill-fill");
    skillFills.forEach((fill, index) => {
      const width = fill.getAttribute("data-width");
      // Stagger each bar with a slight delay
      setTimeout(() => {
        fill.style.transition = "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
        fill.style.width = width + "%";
      }, index * 100);
    });
  }

  // ==========================================
  // POWER BAR ANIMATION — FIXED
  // ==========================================
  let powerBarAnimated = false;

  function animatePowerBars() {
    if (powerBarAnimated) return;
    powerBarAnimated = true;

    const metricFills = document.querySelectorAll(".metric-fill");
    metricFills.forEach((fill, index) => {
      const width = fill.getAttribute("data-width");
      setTimeout(() => {
        fill.style.transition = "width 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
        fill.style.width = width + "%";
      }, index * 150);
    });
  }

  // ==========================================
  // MASTER SCROLL ANIMATION ENGINE
  // ==========================================
  const observerOptions = {
    threshold: isMobile ? 0.05 : 0.12,
    rootMargin: "0px 0px -30px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Trigger stat counters when about section is visible
        if (entry.target.closest(".about") && !statsCounted) {
          setTimeout(animateCounters, 400);
        }

        // Trigger skill bars when skills section is visible
        if (entry.target.closest(".skills") && !skillsAnimated) {
          setTimeout(animateSkillBars, 400);
        }

        // Trigger power bars when advantages section is visible
        if (entry.target.closest(".advantages") && !powerBarAnimated) {
          setTimeout(animatePowerBars, 400);
        }

        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // ==========================================
  // APPLY SCROLL ANIMATIONS TO ALL ELEMENTS
  // ==========================================

  // Section headers — fade up
  document.querySelectorAll(".section-header").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = "0s";
    observer.observe(el);
  });

  // About terminal — slide from left
  document.querySelectorAll(".about-terminal").forEach((el) => {
    el.classList.add("reveal-left");
    observer.observe(el);
  });

  // About stats — slide from right
  document.querySelectorAll(".about-stats").forEach((el) => {
    el.classList.add("reveal-right");
    observer.observe(el);
  });

  // Individual stat cards — stagger fade up
  document.querySelectorAll(".stat-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(el);
  });

  // Skill categories — stagger fade up
  document.querySelectorAll(".skill-category").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = isMobile ? `${i * 0.06}s` : `${i * 0.12}s`;
    observer.observe(el);
  });

  // Advantage cards — stagger fade up
  document.querySelectorAll(".advantage-card").forEach((card, i) => {
    card.classList.add("reveal");
    card.style.transitionDelay = isMobile ? `${i * 0.05}s` : `${i * 0.1}s`;
    observer.observe(card);
  });

  // Power bar — fade up
  document.querySelectorAll(".power-bar").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // Project cards — stagger fade up
  document.querySelectorAll(".project-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = isMobile ? `${i * 0.06}s` : `${i * 0.12}s`;
    observer.observe(el);
  });

  // Contact info — slide from left
  document.querySelectorAll(".contact-info").forEach((el) => {
    el.classList.add("reveal-left");
    observer.observe(el);
  });

  // Contact form — slide from right
  document.querySelectorAll(".contact-form-wrapper").forEach((el) => {
    el.classList.add("reveal-right");
    observer.observe(el);
  });

  // Contact items — stagger fade up
  document.querySelectorAll(".contact-item").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(el);
  });

  // Social icons in hero — stagger pop in
  document.querySelectorAll(".hero-socials .social-icon").forEach((el, i) => {
    el.classList.add("reveal-scale");
    el.style.transitionDelay = `${0.8 + i * 0.08}s`;
    observer.observe(el);
  });

  // Hero CTA buttons — stagger
  document.querySelectorAll(".hero-cta .btn").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${0.6 + i * 0.15}s`;
    observer.observe(el);
  });

  // Filter buttons — stagger
  document.querySelectorAll(".filter-btn").forEach((el, i) => {
    el.classList.add("reveal-scale");
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });

  // Footer elements
  document.querySelectorAll(".footer-content").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // ==========================================
  // PROJECT FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card, index) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category.includes(filter)) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          card.offsetHeight; // Force reflow
          card.style.animation = `fadeInUp 0.5s ease ${index * 0.08}s forwards`;
        } else {
          card.classList.add("hidden");
          card.style.animation = "";
        }
      });
    });
  });

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");
      const btnIcon = submitBtn.querySelector(".fa-paper-plane");

      if (btnText) btnText.style.display = "none";
      if (btnIcon) btnIcon.style.display = "none";
      if (btnLoading) btnLoading.style.display = "inline";
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      try {
        const response = await fetch("https://formspree.io/f/mwvgalan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _replyto: formData.email,
            _subject: `Portfolio Contact: ${formData.subject}`,
          }),
        });

        if (response.ok) {
          formStatus.className = "form-status success";
          formStatus.innerHTML =
            '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
          formStatus.style.display = "block";
          contactForm.reset();
        } else {
          throw new Error("Failed to send");
        }
      } catch (error) {
        formStatus.className = "form-status error";
        formStatus.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try emailing directly.';
        formStatus.style.display = "block";
        console.error("Contact form error:", error);
      }

      if (btnText) btnText.style.display = "inline";
      if (btnIcon) btnIcon.style.display = "inline";
      if (btnLoading) btnLoading.style.display = "none";
      submitBtn.disabled = false;

      setTimeout(() => {
        if (formStatus) formStatus.style.display = "none";
      }, 5000);
    });
  }

  // ==========================================
  // VISITOR COUNTER
  // ==========================================
  function updateVisitorCount() {
    const counterEl = document.getElementById("visitorCount");
    if (!counterEl) return;

    let count = parseInt(localStorage.getItem("mirrorx_visit_count") || "0");
    const lastVisit = localStorage.getItem("mirrorx_last_visit");
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      count++;
      localStorage.setItem("mirrorx_visit_count", count.toString());
      localStorage.setItem("mirrorx_last_visit", today);
    }

    fetch("https://api.countapi.xyz/hit/mirrorx-portfolio/visits")
      .then((response) => {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then((data) => {
        animateVisitorCount(data.value);
      })
      .catch(() => {
        animateVisitorCount(count + 1000);
      });
  }

  function animateVisitorCount(target) {
    const counterEl = document.getElementById("visitorCount");
    if (!counterEl) return;

    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(easedProgress * target);

      counterEl.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counterEl.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  updateVisitorCount();

  // ==========================================
  // ULTRA-SMOOTH 3D TILT & GLOW ENGINE v2.1
  // FULLY FIXED, NO JITTER, NO SNAP
  // ==========================================
  function initSmoothTilt() {
    if (isTouchDevice || isMobile) return;

    const allTiltCards = document.querySelectorAll(
      ".project-card, .advantage-card",
    );

    allTiltCards.forEach((card) => {
      const glow =
        card.querySelector(".project-glow") ||
        card.querySelector(".adv-card-glow");

      // Reset all transforms on init
      card.style.transform = "";
      card.style.transition = "";

      let currentRotateX = 0;
      let currentRotateY = 0;
      let currentTranslateY = 0;

      let targetRotateX = 0;
      let targetRotateY = 0;
      let targetTranslateY = 0;

      let isHovering = false;
      let animationId = null;

      // Lerp function - perfect smooth interpolation
      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      function smoothAnimation() {
        // Stop loop completely when fully at rest
        const isFullyAtRest =
          !isHovering &&
          Math.abs(currentRotateX) < 0.001 &&
          Math.abs(currentRotateY) < 0.001 &&
          Math.abs(currentTranslateY) < 0.001;

        if (isFullyAtRest) {
          // Full reset to native state
          card.style.transform = "";
          currentRotateX = 0;
          currentRotateY = 0;
          currentTranslateY = 0;
          animationId = null;
          return;
        }

        // Smoothness factor - 0.12 = perfect balance
        const lerpFactor = isHovering ? 0.12 : 0.08;

        currentRotateX = lerp(currentRotateX, targetRotateX, lerpFactor);
        currentRotateY = lerp(currentRotateY, targetRotateY, lerpFactor);
        currentTranslateY = lerp(
          currentTranslateY,
          targetTranslateY,
          lerpFactor,
        );

        // Apply transform
        card.style.transform =
          `perspective(1100px) ` +
          `rotateX(${currentRotateX.toFixed(4)}deg) ` +
          `rotateY(${currentRotateY.toFixed(4)}deg) ` +
          `translateY(\({currentTranslateY.toFixed(4)}px)`;

        animationId = requestAnimationFrame(smoothAnimation);
      }

      function startAnimation() {
        if (!animationId) {
          animationId = requestAnimationFrame(smoothAnimation);
        }
      }

      // MOUSE ENTER
      card.addEventListener("mouseenter", () => {
        isHovering = true;
        targetTranslateY = -8;

        // Remove any CSS transition that would fight JS
        card.style.transition = "border-color 0.3s ease, box-shadow 0.3s ease";
        card.style.borderColor = "rgba(0, 240, 255, 0.3)";
        card.style.boxShadow =
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 240, 255, 0.3)";

        if (glow) {
          glow.style.opacity = "1";
          glow.style.transition = "opacity 0.3s ease";
        }

        startAnimation();
      });

      // MOUSE MOVE
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt intensity: 22 = perfect amount, not too much not too little
        targetRotateX = (y - centerY) / 22;
        targetRotateY = (centerX - x) / 22;
        targetTranslateY = -8;

        // Move glow orb
        if (glow) {
          glow.style.left = `\){x - rect.width}px`;
          glow.style.top = `${y - rect.height}px`;
        }

        startAnimation();
      });

      // MOUSE LEAVE
      card.addEventListener("mouseleave", () => {
        isHovering = false;

        // Reset all targets back to zero
        targetRotateX = 0;
        targetRotateY = 0;
        targetTranslateY = 0;

        // Reset card state
        card.style.transition = "border-color 0.5s ease, box-shadow 0.5s ease";
        card.style.borderColor = "";
        card.style.boxShadow = "";

        // Reset glow
        if (glow) {
          glow.style.opacity = "0";
          glow.style.transition = "opacity 0.5s ease";
        }

        startAnimation();
      });
    });
  }

  initSmoothTilt();

  // Re-init on resize from mobile to desktop
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isNowMobile =
        window.innerWidth <= 768 ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (!isNowMobile) {
        initSmoothTilt();
      }
    }, 300);
  });

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPos =
          target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // KONAMI CODE EASTER EGG
  // ==========================================
  let konamiCode = [];
  const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(",") === konamiSequence.join(",")) {
      document.body.style.animation = "rainbow 2s linear";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 2000);
    }
  });

  // ==========================================
  // DYNAMIC STYLES FOR ALL ANIMATIONS
  // ==========================================
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    /* ── Fade Up ── */
    .reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Slide From Left ── */
    .reveal-left {
      opacity: 0;
      transform: translateX(-60px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-left.active {
      opacity: 1;
      transform: translateX(0);
    }

    /* ── Slide From Right ── */
    .reveal-right {
      opacity: 0;
      transform: translateX(60px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-right.active {
      opacity: 1;
      transform: translateX(0);
    }

    /* ── Scale Pop In ── */
    .reveal-scale {
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-scale.active {
      opacity: 1;
      transform: scale(1);
    }

    /* ── Fade In Up Keyframe (for filter) ── */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── Rainbow Easter Egg ── */
    @keyframes rainbow {
      0%   { filter: hue-rotate(0deg);   }
      100% { filter: hue-rotate(360deg); }
    }

    /* ── Navbar Link Ripple Effect ── */
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    .nav-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 240, 255, 0.25);
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* ── Navbar Links Enhanced Hover Line ── */
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 80%;
      height: 2px;
      background: linear-gradient(90deg, #00f0ff, #bf00ff);
      border-radius: 2px;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: center;
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      transform: translateX(-50%) scaleX(1);
    }

    /* ── Accessibility: Reduced Motion ── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .reveal, .reveal-left, .reveal-right, .reveal-scale {
        opacity: 1 !important;
        transform: none !important;
      }
    }

    /* ── Touch Device Card Tap Feedback ── */
    @media (hover: none) and (pointer: coarse) {
      .project-card:active,
      .advantage-card:active {
        transform: scale(0.97) !important;
        border-color: rgba(0, 240, 255, 0.3) !important;
        transition: transform 0.15s ease !important;
      }
      .project-glow,
      .adv-card-glow {
        display: none !important;
      }
      .cursor-glow {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // ==========================================
  // CONSOLE SIGNATURE
  // ==========================================
  console.log(
    "%c MirrorX Portfolio ",
    "background: linear-gradient(135deg, #00f0ff, #bf00ff); color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;",
  );
  console.log(
    "%c Designed & Developed by Sathish (MirrorX) ",
    "color: #00f0ff; font-size: 12px;",
  );
  console.log(
    `%c Device: ${isMobile ? "📱 Mobile" : isTablet ? "📟 Tablet" : "🖥️ Desktop"} | Touch: ${isTouchDevice ? "Yes" : "No"} | Reduced Motion: ${prefersReducedMotion ? "Yes" : "No"}`,
    "color: #bf00ff; font-size: 11px;",
  );
}); // End DOMContentLoaded
