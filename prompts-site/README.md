# 1,000 Medical Prompts: prompt finder

Static website: type a task ("introduction of my thesis") and get the matching prompt from the
1,000-prompt library, or browse all 27 topics from the dropdown. No server and no API keys: all 1,000
prompts are embedded in `public/index.html` and searched in the browser.

## Rebuild after editing prompts
```
python3 src/build.py      # re-exports medical-prompts/prompts/*.txt and writes public/index.html
```

## Deploy to Firebase Hosting (from your own computer, where you're signed in)
```
npm install -g firebase-tools
firebase login                                   # opens Chrome; pick your Google account
firebase projects:create parabox-prompts --display-name "Parabox Prompts"
firebase deploy --only hosting --project parabox-prompts
```
The site goes live at https://parabox-prompts.web.app (and /prompts on the same site works too).

## Put it on your domain
paraboxai.com is hosted outside Firebase, so Firebase can't serve paraboxai.com/prompts directly.
1. Firebase console → Hosting → Add custom domain → `prompts.paraboxai.com`. Add the DNS records it shows
   at your domain registrar. HTTPS is issued automatically (can take up to 24 hours).
2. In your current website builder for paraboxai.com, add a redirect from `/prompts` to
   `https://prompts.paraboxai.com`.
