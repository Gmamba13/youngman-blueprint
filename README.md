# YoungmanBlueprint (YMBP)

Your blueprint for becoming the man you're meant to be.

## What this is
A mobile-first web app (PWA) with onboarding, 10 self-improvement pillars, habit tracking, XP & levels, streaks, and interactive workbooks. All data is stored locally in your browser — no account, no backend required for v1.

## How to run it (zero coding experience required)

### 1. Install Node.js (one time only)
Node.js is the free tool that runs the app on your computer.

1. Go to https://nodejs.org
2. Click the big green "LTS" button to download the installer for Mac
3. Open the downloaded `.pkg` file and click Next → Next → Install (enter your Mac password)

To confirm it worked, open **Terminal** (press Cmd+Space, type "Terminal", hit enter) and paste:
```
node --version
```
You should see something like `v20.x.x`.

### 2. Install the app's dependencies (one time only)
In Terminal, paste these two commands one at a time:
```
cd "/Users/test/project 2026"
npm install
```
This takes 1–2 minutes. It downloads all the free tools the app needs.

### 3. Start the app
```
npm run dev
```
You'll see a message like `Local: http://localhost:3000`. Open that link in your browser (Chrome or Safari) — the app is now running.

To **stop** the app: go back to Terminal and press `Ctrl+C`.
To **start it again** later: run `npm run dev` again from that same folder.

### 4. View it on your phone (optional)
While `npm run dev` is running, look in Terminal for a line like:
```
Network: http://192.168.1.42:3000
```
On your phone, open Safari/Chrome and type that address. You're now using the app on your phone. In Safari tap the share icon → "Add to Home Screen" and it'll install like a real app.

## Folder structure (plain English)
- `app/` — every screen of the app (home, onboarding, pillars, habits, workbooks, profile)
- `components/` — reusable pieces (XP bar, pillar tiles, habit rows, bottom nav)
- `lib/pillars.ts` — **all the content** (intros, resources, habits, workbook prompts). Edit this file to change text for any pillar.
- `lib/levels.ts` — the 10 levels and XP thresholds
- `lib/store.ts` — where progress is saved (on-device, in the browser)

## Editing content
1. Open `lib/pillars.ts` in any text editor (TextEdit works, VS Code is nicer: https://code.visualstudio.com)
2. Find the pillar you want to change
3. Edit the text between the quotes
4. Save. The app reloads automatically if `npm run dev` is running.

## Deploying so others can use it (later)
The easiest way is Vercel (free):
1. Make a free account at https://vercel.com
2. Push this folder to a free GitHub account
3. Click "Import Project" in Vercel, pick your repo, click Deploy
4. You get a real URL like `ymbp.vercel.app` to share with anyone

We can walk through that when you're ready.
