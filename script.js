/* ===================================
   SMOOTH SCROLL TO SECTION
=================================== */
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}


/* ===================================
   INTERACTIVE AURORA ORB BACKGROUND
   (OpenAI Astra-style fluid glow)
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
    buildStars();
  });

  // Smooth mouse tracking
  let mouseX = W / 2, mouseY = H / 2;
  let easeX  = W / 2, easeY  = H / 2;

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('touchmove', e => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }, { passive: true });

  // Orbs — OpenAI Astra palette: deep violet, electric cyan, warm rose, indigo, seafoam
  const orbs = [
    { bx:0.50, by:0.46, r:0.52, c:['rgba(90,50,210,0.60)','rgba(60,30,160,0.22)','rgba(0,0,0,0)'],  ph:0.0, sp:0.00022, px:0.030, pa:0.06, ddx:0.00012, ddy:0.00008 },
    { bx:0.18, by:0.22, r:0.38, c:['rgba(0,200,255,0.50)','rgba(0,130,220,0.18)','rgba(0,0,0,0)'],  ph:1.2, sp:0.00030, px:0.055, pa:0.08, ddx:0.00018, ddy:0.00014 },
    { bx:0.82, by:0.76, r:0.44, c:['rgba(220,50,130,0.45)','rgba(180,30,90,0.16)','rgba(0,0,0,0)'],  ph:2.5, sp:0.00026, px:0.048, pa:0.07, ddx:-0.00015, ddy:0.00010 },
    { bx:0.80, by:0.20, r:0.36, c:['rgba(70,30,200,0.42)','rgba(50,20,150,0.14)','rgba(0,0,0,0)'],  ph:0.7, sp:0.00020, px:0.062, pa:0.05, ddx:0.00020, ddy:-0.00012 },
    { bx:0.14, by:0.78, r:0.34, c:['rgba(10,195,175,0.40)','rgba(5,150,135,0.14)','rgba(0,0,0,0)'], ph:3.8, sp:0.00028, px:0.052, pa:0.09, ddx:-0.00010, ddy:-0.00018 },
    { bx:0.50, by:0.48, r:0.13, c:['rgba(210,190,255,0.70)','rgba(150,110,255,0.25)','rgba(0,0,0,0)'],ph:1.0,sp:0.00038, px:0.018, pa:0.10, ddx:0.00005, ddy:0.00005 },
    { bx:0.35, by:0.60, r:0.28, c:['rgba(40,100,255,0.38)','rgba(20,60,200,0.12)','rgba(0,0,0,0)'],  ph:4.5, sp:0.00024, px:0.042, pa:0.06, ddx:0.00014, ddy:0.00016 },
    { bx:0.65, by:0.35, r:0.30, c:['rgba(255,100,80,0.30)','rgba(200,60,40,0.10)','rgba(0,0,0,0)'],  ph:5.2, sp:0.00020, px:0.038, pa:0.07, ddx:-0.00012, ddy:0.00010 },
  ];

  // Pre-render background star field onto an offscreen canvas
  let starCanvas;
  function buildStars() {
    starCanvas = document.createElement('canvas');
    starCanvas.width = W;
    starCanvas.height = H;
    const sc = starCanvas.getContext('2d');
    for (let i = 0; i < 320; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 0.8 + 0.15;
      const a = Math.random() * 0.45 + 0.08;
      sc.beginPath();
      sc.arc(x, y, r, 0, Math.PI * 2);
      sc.fillStyle = `rgba(210,225,255,${a})`;
      sc.fill();
    }
  }
  buildStars();

  let t = 0;

  function loop() {
    t++;
    easeX += (mouseX - easeX) * 0.042;
    easeY += (mouseY - easeY) * 0.042;

    const offX = easeX - W / 2;
    const offY = easeY - H / 2;

    ctx.clearRect(0, 0, W, H);

    // Star dust base
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(starCanvas, 0, 0);

    // Draw each orb with additive blending for luminous overlap
    for (const o of orbs) {
      const driftX = Math.sin(t * o.ddx * 1000 + o.ph) * W * 0.055;
      const driftY = Math.cos(t * o.ddy * 1000 + o.ph + 1.3) * H * 0.045;
      const pulse  = 1 + Math.sin(t * o.sp * 1000 + o.ph) * o.pa;
      const r      = o.r * Math.min(W, H) * pulse;
      const cx     = o.bx * W + driftX + offX * o.px;
      const cy     = o.by * H + driftY + offY * o.px;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   o.c[0]);
      g.addColorStop(0.5, o.c[1]);
      g.addColorStop(1,   o.c[2]);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(loop);
  }

  loop();
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