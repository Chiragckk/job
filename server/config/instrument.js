// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

 

Sentry.init({
  dsn: "https://7c44e4f97a83558b30ef8ac2e2d91bf7@o4509417590095872.ingest.us.sentry.io/4509417598222336",
  integrations:[
    Sentry.mongoIntegration()
  ],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});