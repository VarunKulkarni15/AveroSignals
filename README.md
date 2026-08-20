<div align="center">
  <img src="https://img.icons8.com/fluency/96/bell.png" alt="Avero Signals Logo" width="80" height="80">
  <h1 align="center">Avero Signals 🚀</h1>
  <p align="center">
    <strong>The Modern Web Push Notification SaaS</strong>
    <br/>
    <a href="https://averosignals.dpdns.org">Live Demo (averosignals.dpdns.org)</a>
  </p>
</div>

Avero Signals is a blazing-fast, developer-first SaaS platform that makes integrating Web Push Notifications into any website effortless. Built with a sleek Supabase-inspired UI, it allows you to manage subscribers, preview notifications on multiple operating systems natively, and broadcast campaigns instantly.

## ✨ How It Works

Avero Signals provides a **Drop-in JavaScript SDK** that works universally across *any* framework (React, Vue, Next.js, WordPress, Webflow, or pure HTML). 

1. **Install the SDK:** Add a single `<script>` tag to your website's `<head>`.
2. **Auto-Sync:** When a user clicks "Accept & Notify", the SDK automatically scrapes their device OS, Browser, Timezone, and your website's high-res icon and syncs it to the Avero Signals Dashboard.
3. **Broadcast:** Log into the Avero Signals Dashboard, type your message, see a 100% accurate native OS preview, and hit send!

## 🚀 Key Features

- **Universally Compatible SDK:** Works on literally every framework. No complex service worker configuration required for your users.
- **Auto-Metadata Extraction:** Automatically fetches your site's favicon/icon, name, and URL to build the notification payload.
- **Cinematic UX:** Pitch black, Supabase-style "Tinted Dark Mode" UI built for premium developer experiences.
- **Multi-OS Native Live Preview:** See exactly how your push notification will look natively on Windows 11, macOS, iOS, and Android before you broadcast.
- **Advanced Targeting:** Broadcast to everyone, or filter specifically by Operating System.
- **Real-Time Analytics:** Track total broadcasts sent and audience growth.

## 🗺️ Roadmap & Future Goals

We are aggressively building Avero Signals to rival enterprise tools like OneSignal. Here is what we are launching next to attract more developers:

- [ ] **API Keys Engine:** Generate secret `PUSH_HUB_SECRET_KEY`s to programmatically trigger push notifications from your backend servers (Node.js, Python, etc.) when events happen (e.g., "New Sale!").
- [ ] **Resend Email Integration:** Automated transactional welcome emails for new developers who sign up for Avero Signals.
- [ ] **Campaign Analytics:** Deep insights into "Sent", "Delivered", and "Clicked" metrics for every broadcast.
- [ ] **Automated Workflows (Journeys):** Send automated push notifications 3 days after a user subscribes.
- [ ] **Auto-Cleanup:** Edge Functions to automatically purge temporary notification assets after 2 days to save server storage.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS v4
- **Backend:** Next.js Route Handlers, Web-Push API
- **Database & Auth:** Supabase (PostgreSQL, RLS Policies, OAuth)
- **Deployment:** Vercel

## ⚙️ Local Development

Clone the repo and configure your `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public
VAPID_PRIVATE_KEY=your_vapid_private
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Run the development server:
```bash
npm install
npm run dev
```
