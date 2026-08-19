# PushHub 🚀

A modern, high-performance push notification platform built with Next.js and Supabase.

## Features
- **Custom Drop-in SDK:** A lightweight JavaScript SDK to enable Web Push on any client website.
- **Smart Metadata Extraction:** Automatically scrapes Site Name, Icon, URL, OS, Browser, and Timezone from subscribers.
- **Advanced Segments:** Target users specifically by Operating System (Windows, Mac, iOS, Android).
- **Delivery Scheduling:** Delay and schedule push notifications for future delivery.
- **Multi-OS Live Preview:** See exactly how your push notification will look across different devices before broadcasting.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js Route Handlers, Web-Push API
- **Database:** Supabase (PostgreSQL)

## Deployment
PushHub is designed to be deployed instantly on Vercel. 

**Required Environment Variables:**
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
