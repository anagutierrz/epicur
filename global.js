// global.js

function toggleMenu() {
  const menu = document.getElementById('mob-menu');
  if (menu) {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}

function closeMenu() {
  const menu = document.getElementById('mob-menu');
  if (menu) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Inicia las animaciones de aparición al hacer scroll
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
        observer.unobserve(entry.target); // Animarlo solo una vez
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// Efecto de desenfoque y fondo oscuro al bajar el Navbar
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});
