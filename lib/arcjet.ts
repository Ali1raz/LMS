import arcjet, {
  detectBot,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
  fixedWindow,
} from "@arcjet/next";

import { env } from "./env";

export {
  detectBot,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
  fixedWindow,
};

export default arcjet({
  key: env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),

    // This rule is live
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 60,
    }),
    // This rule is in dry run mode, so will log but not block
    fixedWindow({
      mode: "DRY_RUN",
      characteristics: ['http.request.headers["x-api-key"]'],
      window: "1h",
      // max could also be a dynamic value applied after looking up a limit
      // elsewhere e.g. in a database for the authenticated user
      max: 600,
    }),
  ],
});
