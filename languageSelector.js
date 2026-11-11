// languageSelector.js
// Language handling for cre8-it.nl. Loaded in <head>, so a redirect happens before the page paints.
//  - English pages send Dutch-language visitors to the Dutch version, unless they chose English before.
//  - Clicking EN or NL in the header remembers that choice.
// Every page names its counterpart with <link rel="alternate" hreflang="...">.
(function () {
  var KEY = 'cre8it-lang';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable: fall back to the browser language */ }

  if ((document.documentElement.lang || 'en') === 'en') {
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var wantsDutch = saved ? saved === 'nl' : browserLang.indexOf('nl') === 0;
    var alternate = document.querySelector('link[rel="alternate"][hreflang="nl"]');
    if (wantsDutch && alternate) {
      // Path only, so this also works on a preview host. Keeps #anchors such as /#ai.
      var a = document.createElement('a');
      a.href = alternate.getAttribute('href');
      location.replace(a.pathname + location.hash);
      return;
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a[data-lang]') : null;
    if (!link) return;
    try { localStorage.setItem(KEY, link.getAttribute('data-lang')); } catch (e) { /* ignore */ }
  });
})();
