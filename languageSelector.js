// languageSelector.js
// Handles language detection, redirect, and dropdown switching for Cre8-it
(function() {
  var userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  var savedLang = localStorage.getItem('cre8it-lang');
  var isRoot = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '/index.html';
  if (!savedLang && isRoot) {
    if (userLang.startsWith('nl')) {
      window.location.href = '/index-nl.html';
    }
  }
  var switcher = document.getElementById('lang-switcher');
  if (switcher) {
    switcher.value = location.pathname.includes('nl') ? 'nl' : 'en';
    switcher.addEventListener('change', function() {
      localStorage.setItem('cre8it-lang', switcher.value);
      if (switcher.value === 'nl') {
        window.location.href = '/index-nl.html';
      } else {
        window.location.href = '/index.html';
      }
    });
    // For Chrome/Edge, show flag in selected
    switcher.addEventListener('input', function() {
      var selected = switcher.options[switcher.selectedIndex];
      switcher.classList.remove('flag-nl', 'flag-en');
      if (selected.value === 'nl') switcher.classList.add('flag-nl');
      if (selected.value === 'en') switcher.classList.add('flag-en');
    });
  }
})();
