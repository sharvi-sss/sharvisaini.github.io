document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initRevealAnimations();
  initCounters();
  initStarfield();
  initProjectImageFallbacks();
  initMobileNavClose();
});

function initTypewriter() {
  const target = document.getElementById("typewriter");
  if (!target) return;

  const roles = ["Computer Science Student", "Research Assistant", "Robotics Instructor", "Python Mentor", "Frontier Project Officer", "MARS Competitor"];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];
    target.textContent = deleting
      ? current.slice(0, charIndex - 1)
      : current.slice(0, charIndex + 1);

    charIndex += deleting ? -1 : 1;

    let delay = deleting ? 48 : 82;

    if (!deleting && charIndex === current.length) {
      delay = 1300;
      deleting = true;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  let started = false;

  const runCounter = (counter) => {
    const target = Number(counter.dataset.count || 0);
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(runCounter);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  const aboutSection = document.querySelector("#about");
  if (aboutSection) observer.observe(aboutSection);
}

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let stars = [];
  let rafId = null;

  const colors = ["#ffffff", "#00D4FF", "#9B30FF", "#39FF14"];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = Math.min(Math.floor((width * height) / 5200), 190);
    stars = Array.from({ length: starCount }, () => createStar(true));
  };

  const createStar = (randomY = false) => ({
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -10,
    radius: Math.random() * 2.2 + 1.2,
    speed: Math.random() * 0.32 + 0.08,
    alpha: Math.random() * 0.62 + 0.22,
    twinkle: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  const drawStar = (x, y, radius) => {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius * 0.28, y - radius * 0.28);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x + radius * 0.28, y + radius * 0.28);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius * 0.28, y + radius * 0.28);
    ctx.lineTo(x - radius, y);
    ctx.lineTo(x - radius * 0.28, y - radius * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - radius * 1.75, y);
    ctx.lineTo(x + radius * 1.75, y);
    ctx.moveTo(x, y - radius * 1.75);
    ctx.lineTo(x, y + radius * 1.75);
    ctx.stroke();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const now = performance.now() * 0.003;

    stars.forEach((star, index) => {
      star.y += prefersReducedMotion ? 0 : star.speed;
      star.x += prefersReducedMotion ? 0 : Math.sin(star.y * 0.006) * 0.05;

      if (star.y > height + 10) {
        stars[index] = createStar(false);
      }

      const twinkle = prefersReducedMotion ? 1 : 0.72 + Math.sin(now + star.twinkle) * 0.28;
      ctx.globalAlpha = star.alpha * twinkle;
      ctx.fillStyle = star.color;
      ctx.strokeStyle = star.color;
      ctx.lineWidth = Math.max(star.radius * 0.12, 0.35);
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 10;
      drawStar(star.x, star.y, star.radius);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    rafId = requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}

function initProjectImageFallbacks() {
  const fallbackSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#12001f"/>
          <stop offset="0.48" stop-color="#001722"/>
          <stop offset="1" stop-color="#050008"/>
        </linearGradient>
        <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#9B30FF"/>
          <stop offset="0.5" stop-color="#00D4FF"/>
          <stop offset="1" stop-color="#39FF14"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#bg)"/>
      <g opacity="0.42" stroke="#00D4FF" stroke-width="1">
        <path d="M0 120h1200M0 240h1200M0 360h1200M0 480h1200M0 600h1200"/>
        <path d="M120 0v750M240 0v750M360 0v750M480 0v750M600 0v750M720 0v750M840 0v750M960 0v750M1080 0v750"/>
      </g>
      <g fill="#fff">
        <circle cx="175" cy="130" r="3"/><circle cx="930" cy="110" r="2"/><circle cx="1040" cy="310" r="3"/>
        <circle cx="270" cy="610" r="2"/><circle cx="780" cy="560" r="2"/><circle cx="540" cy="170" r="2"/>
      </g>
      <ellipse cx="600" cy="375" rx="330" ry="115" fill="none" stroke="url(#orbit)" stroke-width="8"/>
      <ellipse cx="600" cy="375" rx="230" ry="78" fill="none" stroke="#9B30FF" stroke-width="3" opacity="0.72"/>
      <circle cx="600" cy="375" r="82" fill="#000" stroke="#39FF14" stroke-width="6"/>
      <path d="M565 385h70M600 350v70" stroke="#00D4FF" stroke-width="10" stroke-linecap="round"/>
      <text x="600" y="548" fill="#F4F7FF" font-family="Orbitron, Arial, sans-serif" font-size="46" font-weight="700" text-anchor="middle">MISSION PREVIEW</text>
    </svg>
  `;

  const fallbackSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

  document.querySelectorAll(".project-card img").forEach((image) => {
    const applyFallback = () => {
      image.src = fallbackSrc;
      image.alt = "Default futuristic project thumbnail";
    };

    image.addEventListener("error", applyFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }
  });
}

function initMobileNavClose() {
  const navbar = document.getElementById("navbarLinks");
  if (!navbar || !window.bootstrap) return;

  const collapse = new bootstrap.Collapse(navbar, { toggle: false });

  navbar.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navbar.classList.contains("show")) {
        collapse.hide();
      }
    });
  });
}
