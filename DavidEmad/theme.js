document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  const moonSVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  `;
  const sunSVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  function setIcon(isLight){
    if(!toggle) return;
    toggle.innerHTML = isLight ? sunSVG : moonSVG;
    toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    // Arabic label
    toggle.setAttribute('aria-label', isLight ? 'الوضع الفاتح' : 'الوضع الداكن');
    toggle.title = isLight ? 'الوضع الفاتح' : 'الوضع الداكن';
  }

  function apply(theme){
    if(theme === 'light'){
      body.classList.add('light-theme');
      setIcon(true);
    } else {
      body.classList.remove('light-theme');
      setIcon(false);
    }
  }

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(saved || (prefersLight ? 'light' : 'dark'));

  if(toggle){
    toggle.addEventListener('click', () => {
      const isLight = body.classList.contains('light-theme');
      const next = isLight ? 'dark' : 'light';
      // animation
      toggle.classList.add('anim');
      setTimeout(() => toggle.classList.remove('anim'), 420);
      apply(next);
      localStorage.setItem('theme', next);
    });
  }

  window.addEventListener('storage', (e) => {
    if(e.key === 'theme') apply(e.newValue || 'dark');
  });
});
