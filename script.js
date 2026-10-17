/* ===================================
   SMOOTH SCROLL TO SECTION
=================================== */
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

/* ===================================
   INTERACTIVE GALAXY BACKGROUND
=================================== */
(function () {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    buildGalaxy();
  });

  // Mouse tracking
  let mouseX = W / 2;
  let mouseY = H / 2;
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let currentOffsetX = 0;
  let currentOffsetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // How far from center as a ratio, max ±1
    targetOffsetX = ((e.clientX - W / 2) / W) * 120;
    targetOffsetY = ((e.clientY - H / 2) / H) * 80;
  });

  // Star colors mimicking galaxy: blue-white, warm white, orange-amber
  const STAR_COLORS = [
    'rgba(220,240,255,',  // cool blue-white
    'rgba(255,255,255,',  // pure white
    'rgba(200,220,255,',  // icy blue
    'rgba(255,220,180,',  // warm orange
    'rgba(255,200,140,',  // amber
    'rgba(180,210,255,',  // pale blue
  ];

  let stars = [];
  let bgStars = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function buildGalaxy() {
    stars = [];
    bgStars = [];

    const cx = W / 2;
    const cy = H / 2;
    const ARMS = 3;
    const STARS_PER_ARM = 380;
    const ARM_SPREAD = 0.38;
    const MAX_RADIUS = Math.min(W, H) * 0.42;

    // Spiral arms
    for (let arm = 0; arm < ARMS; arm++) {
      const armOffset = (arm / ARMS) * Math.PI * 2;

      for (let i = 0; i < STARS_PER_ARM; i++) {
        const t = i / STARS_PER_ARM; // 0..1
        const angle = armOffset + t * Math.PI * 4.5;
        const radius = t * MAX_RADIUS;
        const spread = rand(-ARM_SPREAD, ARM_SPREAD) * radius * 0.5;

        const x = cx + (radius + spread) * Math.cos(angle) + rand(-4, 4);
        const y = cy + (radius + spread) * Math.sin(angle) * 0.55 + rand(-4, 4); // slight ellipse

        // Size: brighter/bigger near center
        const size = rand(0.4, 1.2) + (1 - t) * rand(0, 2.5);
        const colorBase = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        const alpha = rand(0.5, 1.0);
        const twinkleSpeed = rand(0.005, 0.025);
        const twinkleOffset = rand(0, Math.PI * 2);

        stars.push({ x, y, origX: x, origY: y, size, colorBase, alpha, twinkleSpeed, twinkleOffset, arm });
      }
    }

    // Core glow cluster
    for (let i = 0; i < 120; i++) {
      const r = rand(0, MAX_RADIUS * 0.1);
      const a = rand(0, Math.PI * 2);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a) * 0.55;
      const size = rand(0.5, 3.5);
      const colorBase = STAR_COLORS[Math.floor(Math.random() * 2)];
      stars.push({ x, y, origX: x, origY: y, size, colorBase, alpha: rand(0.7, 1), twinkleSpeed: rand(0.01, 0.03), twinkleOffset: rand(0, Math.PI * 2), arm: -1 });
    }

    // Background scatter stars
    for (let i = 0; i < 200; i++) {
      bgStars.push({
        x: rand(0, W),
        y: rand(0, H),
        size: rand(0.3, 1.2),
        alpha: rand(0.1, 0.4),
        twinkleSpeed: rand(0.002, 0.01),
        twinkleOffset: rand(0, Math.PI * 2),
      });
    }
  }

  buildGalaxy();

  let tick = 0;

  function drawGalaxy() {
    ctx.clearRect(0, 0, W, H);

    // Smooth cursor tracking
    currentOffsetX += (targetOffsetX - currentOffsetX) * 0.04;
    currentOffsetY += (targetOffsetY - currentOffsetY) * 0.04;

    const cx = W / 2 + currentOffsetX;
    const cy = H / 2 + currentOffsetY;
    const shiftX = currentOffsetX;
    const shiftY = currentOffsetY;

    // Central glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.12);
    grd.addColorStop(0, 'rgba(255,250,240,0.85)');
    grd.addColorStop(0.3, 'rgba(200,230,255,0.25)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Outer halo
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.38);
    halo.addColorStop(0, 'rgba(160,200,255,0.06)');
    halo.addColorStop(0.5, 'rgba(56,100,200,0.03)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.38, 0, Math.PI * 2);
    ctx.fill();

    tick += 1;

    // Background stars
    for (const s of bgStars) {
      const a = s.alpha * (0.7 + 0.3 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset));
      ctx.beginPath();
      ctx.arc(s.x + shiftX * 0.1, s.y + shiftY * 0.1, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${a})`;
      ctx.fill();
    }

    // Spiral stars
    for (const s of stars) {
      const tw = 0.75 + 0.25 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset);
      const a = s.alpha * tw;

      // Parallax shift: stars further from center shift more
      const dx = s.origX - W / 2;
      const dy = s.origY - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const parallaxFactor = 0.3 + (dist / (Math.min(W, H) * 0.5)) * 0.7;
      const px = s.origX + shiftX * parallaxFactor;
      const py = s.origY + shiftY * parallaxFactor * 0.6;

      // Draw glow for bigger stars
      if (s.size > 1.5) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, s.size * 4);
        g.addColorStop(0, s.colorBase + (a * 0.7) + ')');
        g.addColorStop(1, s.colorBase + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, s.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core star dot
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.colorBase + a + ')';
      ctx.fill();
    }

    requestAnimationFrame(drawGalaxy);
  }

  drawGalaxy();
})();


/* ===================================
   TYPING ANIMATION (Hero)
=================================== */
const nameEl  = document.getElementById('typed-name');
const roleEl  = document.getElementById('typed-role');

const name  = 'Meet';
const roles = ['Software Developer', 'AI / ML Enthusiast', 'Problem Solver'];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Type the name first, then start role cycling
function typeName() {
  if (charIndex < name.length) {
    nameEl.textContent += name[charIndex++];
    setTimeout(typeName, 110);
  } else {
    setTimeout(typeRole, 400);
  }
}

function typeRole() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    roleEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeRole, 1600);
      return;
    }
  } else {
    roleEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeRole, isDeleting ? 55 : 90);
}

typeName();

/* ===================================
   CUSTOM CURSOR
=================================== */
const cursor   = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale follower on interactive elements
document.querySelectorAll('a, button, .project-card, .experience-card, .skill, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.background = 'transparent';
    follower.style.borderColor = 'rgba(255, 255, 255, 0.8)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.background = 'transparent';
    follower.style.borderColor = 'rgba(255, 255, 255, 0.4)';
  });
});

/* ===================================
   DARK / LIGHT MODE TOGGLE
=================================== */
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  toggleBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
  // Persist preference
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Restore preference on load
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
}

/* ===================================
   HAMBURGER MENU
=================================== */
const menuToggle = document.getElementById('menu-toggle');
const navLinks   = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ===================================
   ACTIVE NAV LINK ON SCROLL
=================================== */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ===================================
   SCROLL REVEAL (Intersection Observer)
=================================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards slightly
      const delay = entry.target.classList.contains('reveal-card') ? i * 80 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ===================================
   BACK TO TOP BUTTON
=================================== */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================
   KEYBOARD ACCESSIBILITY (Project cards)
=================================== */
document.querySelectorAll('.project-card[tabindex]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});