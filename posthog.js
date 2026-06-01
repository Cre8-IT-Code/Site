// PostHog (EU) loader with explicit consent gating.
// Mirrors clarity.js: nothing leaves the browser until the visitor accepts.
// Loads AFTER clarity.js (which defines window.Cre8itConsent), and decorates
// that object's grant/revoke so a single Accept/Decline drives both tools.
(function () {
  var PROJECT_TOKEN = "phc_zo2c9o5HEViLb2eajW5AP6AfMaXRRsU8gQoeNxSF7jfq"; // Cre8-it.nl (190730)
  var API_HOST = "https://eu.i.posthog.com";
  var STORAGE_KEY = "cre8it.cookieConsent";

  var started = false;

  function startPostHog() {
    if (started) return;
    started = true;
    // Official posthog-js snippet (loads array stub, then the CDN bundle).
    !function (t, e) {
      var o, n, p, r;
      e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]);
          t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
        }
        (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0,
        p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js",
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
        var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [],
        u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e; },
        u.people.toString = function () { return u.toString(1) + ".people (stub)"; },
        o = "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "), n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a]);
      }, e.__SV = 1);
    }(document, window.posthog || []);

    window.posthog.init(PROJECT_TOKEN, {
      api_host: API_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      // Core Web Vitals → PostHog Web Vitals dashboard (project flag also on).
      capture_performance: { web_vitals: true },
      respect_dnt: true,
      // Replay stays off — Microsoft Clarity owns session replay here.
      disable_session_recording: true,
    });
  }

  function stopPostHog() {
    try { if (window.posthog && window.posthog.opt_out_capturing) window.posthog.opt_out_capturing(); }
    catch (e) { /* ignore */ }
  }

  // Decorate the consent API clarity.js installed, so Accept/Decline drives both.
  function wire() {
    var existing = window.Cre8itConsent || { storageKey: STORAGE_KEY, grant: function () {}, revoke: function () {} };
    var priorGrant = existing.grant;
    var priorRevoke = existing.revoke;
    window.Cre8itConsent = {
      storageKey: existing.storageKey || STORAGE_KEY,
      grant: function () { try { priorGrant && priorGrant(); } finally { startPostHog(); } },
      revoke: function () { try { priorRevoke && priorRevoke(); } finally { stopPostHog(); } },
    };
  }

  wire();

  // Honor a previously stored decision on load.
  try {
    if (localStorage.getItem(STORAGE_KEY) === "accepted") startPostHog();
  } catch (e) { /* localStorage unavailable — keep off */ }
})();
