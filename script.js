/* ===================================
   SMOOTH SCROLL TO SECTION
=================================== */
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

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
    follower.style.background = 'rgba(255, 255, 255, 0.2)';
    follower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.background = 'rgba(255, 255, 255, 0.1)';
    follower.style.borderColor = 'rgba(255, 255, 255, 0.2)';
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