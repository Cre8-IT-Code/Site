// Microsoft Clarity loader with explicit consent gating.
// Per Clarity docs, calling clarity("consent", false) before the tag fires
// keeps Clarity from writing cookies. We additionally defer injecting the
// remote script until the user has accepted, so nothing leaves the browser
// until consent is granted.
(function () {
  var CLARITY_PROJECT_ID = "nz66u58gnb";
  var STORAGE_KEY = "cre8it.cookieConsent";

  // Initialize the queue and consent state up-front so any calls made before
  // the remote script loads are queued and consent defaults to false.
  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  window.clarity("consent", false);

  function injectClarityScript() {
    if (document.getElementById("clarity-script")) return;
    var s = document.createElement("script");
    s.id = "clarity-script";
    s.async = 1;
    s.src = "https://www.clarity.ms/tag/" + CLARITY_PROJECT_ID;
    var first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(s, first);
  }

  function grantConsent() {
    injectClarityScript();
    // Tell Clarity it has permission to write cookies / persistent IDs.
    window.clarity("consent");
  }

  function revokeConsent() {
    // Ensure Clarity (if it was previously loaded) does not write cookies.
    window.clarity("consent", false);
  }

  // Expose API the cookie banner can call.
  window.Cre8itConsent = {
    storageKey: STORAGE_KEY,
    grant: grantConsent,
    revoke: revokeConsent,
  };

  // Apply any previously stored decision on page load.
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") {
      grantConsent();
    }
  } catch (e) {
    // localStorage may be unavailable (private mode, etc); keep consent off.
  }
})();
