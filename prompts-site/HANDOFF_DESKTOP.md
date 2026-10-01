# HANDOFF: Deploy the "1,000 Medical Prompts" finder to Firebase (Claude Code on desktop)

Paste this whole file into Claude Code on your desktop. You are continuing work started in a cloud session.
The website is already built. Your job is to deploy it to Firebase Hosting from this computer, where the
user (Dr. Abhishek J. Benur) is signed in to Google in Chrome, and then connect it to his domain.

## What exists
- Repo: `kabirthapar31/abg-interpreter`, branch **`claude/medical-prompts-pdf-qsg4x1`**.
- Folder `prompts-site/`:
  - `public/index.html`: the finished site (about 1.2 MB, all 1,000 prompts embedded, no server, no API keys).
  - `firebase.json`: Hosting config. Serves `public/`; `/prompts` and `/prompts/**` rewrite to `index.html`.
  - `src/app.html`: page source. `src/export.py` + `src/build.py`: rebuild `public/index.html` from
    `medical-prompts/prompts/vol*/*.txt` (`python3 src/build.py`, needs Python 3.9+, no extra packages).
  - `README.md`: same steps in short form.
- What the site does: a search box ("give me a prompt for introduction of thesis") returns the matching prompt
  with Copy / Open in ChatGPT / Open in Claude buttons; when nothing fits it suggests questions to ask instead;
  a dropdown browses all 27 topics. Deep links: `#p415` (prompt), `#s1-3` (section).

## Steps

### 1. Get the code
```
git clone https://github.com/kabirthapar31/abg-interpreter.git
cd abg-interpreter
git checkout claude/medical-prompts-pdf-qsg4x1
cd prompts-site
```
(If the repo is already cloned, `git fetch origin claude/medical-prompts-pdf-qsg4x1` and check it out.)

### 2. Check the site locally (optional, 1 minute)
```
python3 -m http.server 8080 --directory public
```
Open http://localhost:8080 and try "introduction of my thesis". Stop the server afterwards.

### 3. Install the Firebase CLI and sign in
```
npm install -g firebase-tools
firebase login
```
`firebase login` opens Chrome. The user picks his Google account and approves. Needs Node.js 18+;
if `npm` is missing, ask the user to install Node.js LTS from nodejs.org first.

### 4. Create the Firebase project
```
firebase projects:create parabox-prompts --display-name "Parabox Prompts"
```
- If the ID `parabox-prompts` is taken, try `parabox-prompts-1000` or ask the user for a preferred ID,
  and use that ID in the commands below.
- If the user already has a Firebase project he wants to use, run `firebase projects:list` and ask which one.
- Do not deploy into an existing project that already hosts another website without asking first:
  a deploy replaces that site's files.

### 5. Deploy
```
firebase deploy --only hosting --project parabox-prompts
```
The CLI prints the live URL: `https://parabox-prompts.web.app`. Open it and confirm the search works.
Also check `https://parabox-prompts.web.app/prompts`.

### 6. Connect the domain
paraboxai.com is hosted outside Firebase (its DNS points to another website host), so Firebase cannot serve
`paraboxai.com/prompts` directly. Recommended setup:
1. Firebase console → project **parabox-prompts** → Hosting → **Add custom domain** → `prompts.paraboxai.com`.
2. Firebase shows DNS records (a TXT record for verification, then A records). The user adds them at his
   domain registrar or DNS provider. SSL is issued automatically; it can take a few minutes up to 24 hours.
3. In the website builder that hosts paraboxai.com, add a redirect: `/prompts` → `https://prompts.paraboxai.com`.

Guide the user through the console and registrar screens; you can't click them yourself.
If the user later moves all of paraboxai.com to Firebase, merge this site into that project's `public/prompts/`
and the `/prompts` path will work directly.

### 7. Report back to the user
Tell him: the live Firebase URL, whether the custom domain is connected or waiting on DNS, and which steps
(if any) he still has to do himself.

## Updating the site later
After any prompt edits in `medical-prompts/prompts/`:
```
cd prompts-site
python3 src/build.py
firebase deploy --only hosting --project parabox-prompts
```
Commit and push changes to branch `claude/medical-prompts-pdf-qsg4x1`.

## Rules
- Never paste tokens, passwords or keys into chat or into the repo.
- Don't create a pull request unless the user asks.
- Don't change the prompt content or design unless the user asks; this task is deployment only.
