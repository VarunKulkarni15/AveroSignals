import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  
  // The base SDK class
  const sdkCode = `
class PushHubSDK {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.publicKey = config.publicKey;
    this.projectId = config.projectId;
    
    if (!this.publicKey) throw new Error('PushHub: publicKey is required');
    if (!this.projectId) throw new Error('PushHub: projectId is required');
    this.registration = null;
    this.init();
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  getSiteMetadata() {
    let siteName = document.title || 'Unknown Site';
    let siteUrl = window.location.hostname || 'localhost';
    let siteIcon = '/icon.png';
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      siteIcon = link.href;
    }
    
    const metaDesc = document.querySelector("meta[name='description']");
    let siteDescription = metaDesc ? metaDesc.content : '';

    let os = 'Unknown';
    if (navigator.userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (navigator.userAgent.indexOf('Mac') !== -1) os = 'Mac';
    else if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (navigator.userAgent.indexOf('iPhone') !== -1 || navigator.userAgent.indexOf('iPad') !== -1) os = 'iOS';

    let browser = 'Unknown';
    if (navigator.userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) browser = 'Safari';
    else if (navigator.userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return { siteName, siteUrl, siteIcon, siteDescription, os, browser, timezone };
  }

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      // Register service worker using the absolute URL of the PushHub backend
      // Note: For service workers to work on cross-origin, we would technically need the SW hosted on the client's domain.
      // But for this MVP, we will try to register it. If it fails due to cross-origin, the client must host sw.js.
      // A common pattern is to inject an iframe or require the user to download a tiny sw.js file.
      // We will assume the user downloads 'pushhub-sw.js' to their root for now.
      
      this.registration = await navigator.serviceWorker.register('/pushhub-sw.js');
      console.log('PushHub Service Worker registered successfully.');

      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        const metadata = this.getSiteMetadata();
        fetch(\`\${this.apiUrl}/api/subscribe\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, metadata, projectId: this.projectId })
        }).catch(() => {});
      }
    } catch (e) {
      console.error('PushHub init error:', e);
    }
  }

  async promptPush() {
    if (!this.registration) {
      console.log('PushHub: Service worker not registered yet.');
      alert('PushHub Error: Service worker not registered. Ensure pushhub-sw.js is in your root directory.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Push notification permission denied.');
        return;
      }
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicKey)
      });

      const metadata = this.getSiteMetadata();

      await fetch(\`\${this.apiUrl}/api/subscribe\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          subscription,
          metadata,
          projectId: this.projectId
        })
      });

      console.log('Successfully subscribed to PushHub!');
      alert('Successfully subscribed to Push Notifications!');
    } catch (error) {
      console.error('Error during PushHub subscription:', error);
    }
  }
}
window.PushHubSDK = PushHubSDK;

// Auto-initialize if data-project-id is present on the script tag
(function() {
  // Find our script tag
  const scripts = document.getElementsByTagName('script');
  let currentScript = null;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes('/api/sdk')) {
      currentScript = scripts[i];
      break;
    }
  }
  
  if (currentScript) {
    const projectId = currentScript.getAttribute('data-project-id');
    if (projectId) {
      window.pushhub = new PushHubSDK({
        projectId: projectId,
        publicKey: '${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}',
        apiUrl: '${origin}'
      });
      console.log('PushHub SDK auto-initialized for project:', projectId);
    }
  }
})();
  `;

  return new NextResponse(sdkCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
