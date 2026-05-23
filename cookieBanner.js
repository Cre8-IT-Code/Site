(function () {
  var STORAGE_KEY = (window.Cre8itConsent && window.Cre8itConsent.storageKey) || "cre8it.cookieConsent";

  function isNl() {
    return document.documentElement.lang === "nl";
  }

  function t(en, nl) {
    return isNl() ? nl : en;
  }

  function alreadyDecided() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function persist(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) { /* ignore */ }
  }

  function makeButton(label, primary) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    var base = "padding:0.55rem 1.2rem;border-radius:9999px;font-weight:700;cursor:pointer;font-size:0.9rem;";
    btn.style.cssText = primary
      ? base + "background:#12d5db;color:#0f3541;border:0;"
      : base + "background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.4);font-weight:600;";
    return btn;
  }

  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.id = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", t("Cookie consent", "Cookie toestemming"));
    wrap.style.cssText = [
      "position:fixed",
      "left:1rem",
      "right:1rem",
      "bottom:1rem",
      "z-index:9999",
      "max-width:42rem",
      "margin:0 auto",
      "background:#0f3541",
      "color:#fff",
      "border-radius:1rem",
      "box-shadow:0 10px 30px rgba(0,0,0,0.25)",
      "padding:1.25rem 1.5rem",
      "font-family:'Open Sans',system-ui,sans-serif",
      "font-size:0.95rem",
      "line-height:1.45"
    ].join(";");

    var text = document.createElement("p");
    text.style.margin = "0 0 0.9rem 0";
    var beforeLink = t(
      "We use Microsoft Clarity to understand how visitors use this site. No tracking cookies are set until you accept. See ",
      "We gebruiken Microsoft Clarity om te begrijpen hoe bezoekers deze site gebruiken. Er worden geen tracking cookies geplaatst totdat je akkoord gaat. Zie "
    );
    var linkText = t("Clarity's cookie list", "Clarity's cookie-overzicht");
    var afterLink = t(" for details.", " voor details.");

    text.appendChild(document.createTextNode(beforeLink));
    var link = document.createElement("a");
    link.href = "https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-list";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = linkText;
    link.style.cssText = "color:#12d5db;text-decoration:underline;";
    text.appendChild(link);
    text.appendChild(document.createTextNode(afterLink));
    wrap.appendChild(text);

    var btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:flex-end;";

    var declineBtn = makeButton(t("Decline", "Weigeren"), false);
    var acceptBtn = makeButton(t("Accept", "Accepteren"), true);

    declineBtn.addEventListener("click", function () {
      persist("declined");
      if (window.Cre8itConsent) window.Cre8itConsent.revoke();
      wrap.remove();
    });
    acceptBtn.addEventListener("click", function () {
      persist("accepted");
      if (window.Cre8itConsent) window.Cre8itConsent.grant();
      wrap.remove();
    });

    btnRow.appendChild(declineBtn);
    btnRow.appendChild(acceptBtn);
    wrap.appendChild(btnRow);
    return wrap;
  }

  function init() {
    if (alreadyDecided()) return;
    document.body.appendChild(buildBanner());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
