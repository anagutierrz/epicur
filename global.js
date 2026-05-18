/* ════════════════════════════════════════════
   EPICUR CONCEPT — Global JS v2
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll
  const navbar = document.getElementById('navbar');
  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Active nav
  const cur = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === cur || a.getAttribute('href') === cur.replace('.html','')) a.classList.add('active');
  });
});

// Mobile menu
let _menuOpen = false;
window.toggleMenu = () => {
  _menuOpen = !_menuOpen;
  document.getElementById('mob-menu')?.classList.toggle('open', _menuOpen);
  document.body.style.overflow = _menuOpen ? 'hidden' : '';
};
window.closeMenu = () => {
  _menuOpen = false;
  document.getElementById('mob-menu')?.classList.remove('open');
  document.body.style.overflow = '';
};

// Reveal helper for dynamically added elements
window.initReveal = () => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
};

// Format date
window.fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(day)} de ${meses[parseInt(m)-1]}, ${y}`;
};

// WA SVG icon
window.WA_SVG = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

// Footer renderer
window.renderFooter = async () => {
  try {
    const [cfg, ctc] = await Promise.all([EpicurCMS.getConfig(), EpicurCMS.getContacto()]);
    const wa = ctc.whatsapp || cfg.whatsapp;
    document.querySelectorAll('.f-logo').forEach(el => el.textContent = cfg.nombre.split(' ')[0]);
    document.querySelectorAll('.f-copy').forEach(el => el.textContent = `© ${cfg.anio} ${cfg.nombre} · ${cfg.ciudad}`);
    document.querySelectorAll('[data-wa]').forEach(el => { el.href = `https://wa.me/${wa}`; });
    document.querySelectorAll('#wa-float').forEach(el => { el.href = `https://wa.me/${wa}`; el.innerHTML = WA_SVG; });
  } catch(e) {}
};

// NAV renderer (shared)
window.renderNav = (active = '') => {
  const pages = [
    { label:'Inicio', href:'../index.html' },
    { label:'Catálogo', href:'../catalogo/catalogo.html' },
    { label:'Blog', href:'../blog/blog.html' },
    { label:'Contacto', href:'../index.html#contacto' }
  ];
  const ul = document.querySelector('.nav-links');
  const mob = document.getElementById('mob-menu');
  if (ul) ul.innerHTML = pages.map(p =>
    `<li><a href="${p.href}" ${p.label === active ? 'class="active"' : ''}>${p.label}</a></li>`
  ).join('');
  if (mob) {
    const close = mob.querySelector('.mob-close');
    mob.innerHTML = '';
    if (close) mob.appendChild(close);
    pages.forEach(p => {
      const a = document.createElement('a');
      a.href = p.href; a.textContent = p.label;
      a.onclick = () => closeMenu();
      mob.appendChild(a);
    });
  }
};
