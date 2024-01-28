const fs = require("fs");

function createEnvFile(envVariables) {
    fs.writeFileSync(
        ".env.prod",
        Object.entries(envVariables)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n")
    );
}

createEnvFile({
    SUBSCRIBE_TO_NEWSLETTERS_URL: process.env.SUBSCRIBE_TO_NEWSLETTERS_URL,
    CONTACT_FORM_URL: process.env.CONTACT_FORM_URL,
    UNSUBSCRIBE_TO_NEWSLETTERS_URL: process.env.UNSUBSCRIBE_TO_NEWSLETTERS_URL,
    RE_CAPTCHA_SITE_KEY: process.env.RE_CAPTCHA_SITE_KEY,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
});
