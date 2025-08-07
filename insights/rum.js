import { openobserveRum } from "@openobserve/browser-rum";
import { openobserveLogs } from "@openobserve/browser-logs";

const options = {
  clientToken: "rum638OGCcd6JLIj3Uf",
  applicationId: "cre8-it",
  site: "observability.cre8-it.nl",
  service: "cre8-it-site",
  env: "production",
  version: "0.0.1",
  organizationIdentifier: "30yQ5j22vDROWRcAIJHN98YvXjr",
  insecureHTTP: true,
  apiVersion: "v1",
};

openobserveRum.init({
  applicationId: options.applicationId, // required, any string identifying your application
  clientToken: options.clientToken,
  site: options.site,
  organizationIdentifier: options.organizationIdentifier,
  service: options.service,
  env: options.env,
  version: options.version,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  apiVersion: options.apiVersion,
  insecureHTTP: options.insecureHTTP,
  defaultPrivacyLevel: "allow", // 'allow' or 'mask-user-input' or 'mask'. Use one of the 3 values.
});

openobserveLogs.init({
  clientToken: options.clientToken,
  site: options.site,
  organizationIdentifier: options.organizationIdentifier,
  service: options.service,
  env: options.env,
  version: options.version,
  forwardErrorsToLogs: true,
  insecureHTTP: options.insecureHTTP,
  apiVersion: options.apiVersion,
});

openobserveRum.startSessionReplayRecording();
