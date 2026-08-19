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

      if (Notification.permission === 'granted') {
        let subscription = await this.registration.pushManager.getSubscription();
        
        // Seamless Migration: If they have an old subscription (e.g. OneSignal) and haven't migrated to PushHub yet
        if (subscription && !localStorage.getItem('pushhub_migrated')) {
          await subscription.unsubscribe();
          subscription = null;
        }

        if (!subscription) {
          subscription = await this.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.publicKey)
          });
          localStorage.setItem('pushhub_migrated', 'true');
        }

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
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Push notification permission denied.');
        return;
      }

      if (!this.registration) {
        if (!('serviceWorker' in navigator)) {
          console.error('PushHub Error: Service workers are not supported by this browser.');
          return;
        }
        try {
          this.registration = await navigator.serviceWorker.register('/pushhub-sw.js');
        } catch (e) {
          console.error('PushHub Error: Service worker not registered.', e);
          return;
        }
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
    } catch (error) {
      console.error('Error during PushHub subscription:', error);
    }
  }
}
window.PushHubSDK = PushHubSDK;

// Auto-initialize if data-project-id is present on the script tag
(function() {
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

      // Auto-sync project metadata back to PushHub
      const metadata = window.pushhub.getSiteMetadata();
      fetch('${origin}/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, metadata })
      }).catch(() => {});

      // Inject OneSignal-style floating widget if data-auto-widget is NOT false
      const autoWidget = currentScript.getAttribute('data-auto-widget');
      if (autoWidget !== 'false') {
        const widgetHTML = \`
        <div id="pushhub-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex; align-items: center; gap: 12px; font-family: system-ui, -apple-system, sans-serif; background: #111111; border: 1px solid #333333; padding: 10px 16px; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.2s ease;">
          <div style="width: 24px; height: 24px; background: #8BAAA8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <span style="color: #ededed; font-size: 14px; font-weight: 500;">Subscribe to Updates</span>
        </div>
      \`;
      
      const widgetContainer = document.createElement('div');
      widgetContainer.innerHTML = widgetHTML;
      document.body.appendChild(widgetContainer.firstElementChild);

      const widget = document.getElementById('pushhub-widget');
      
      // Hover effects
      widget.addEventListener('mouseenter', () => {
        widget.style.transform = 'translateY(-2px)';
        widget.style.borderColor = '#8BAAA8';
        widget.style.boxShadow = '0 10px 25px -5px rgba(139, 170, 168, 0.2), 0 8px 10px -6px rgba(139, 170, 168, 0.2)';
      });
      widget.addEventListener('mouseleave', () => {
        widget.style.transform = 'translateY(0)';
        widget.style.borderColor = '#333333';
        widget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)';
      });

      // Click to subscribe
      widget.addEventListener('click', async () => {
        const originalText = widget.querySelector('span').innerText;
        widget.querySelector('span').innerText = 'Loading...';
        await window.pushhub.promptPush();
        
        // Hide widget after successful subscription
        if (Notification.permission === 'granted') {
          widget.style.opacity = '0';
          setTimeout(() => widget.remove(), 300);
        } else {
          widget.querySelector('span').innerText = originalText;
        }
      });
      
      // Check if already subscribed to hide widget initially
      if ('Notification' in window && Notification.permission === 'granted') {
        widget.style.display = 'none';
      }
      }
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
