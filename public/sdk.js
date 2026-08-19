class PushHubSDK {
  constructor(config) {
    this.apiUrl = config.apiUrl || 'http://localhost:3001';
    this.publicKey = config.publicKey || 'BNhA-x3p6YsSrLUIAWaurSjR18fnQuvgdciyrctQ9iYrj6UM7PMBqoRitSLq2-mh7QfYbmIRlm9ySiYARWqWILs';
    this.registration = null;
    this.init();
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
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
      this.registration = await navigator.serviceWorker.register('/pushhub-sw.js');
      console.log('PushHub Service Worker registered successfully.');

      // Auto-update metadata in the background if already subscribed
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        const metadata = this.getSiteMetadata();
        fetch(`${this.apiUrl}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, metadata })
        }).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }
  }

  async promptPush() {
    if (!this.registration) {
      console.log('PushHub: Service worker not registered yet.');
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

      await fetch(`${this.apiUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, metadata })
      });

      console.log('Successfully subscribed to PushHub!');
    } catch (error) {
      console.error('Error during PushHub subscription:', error);
    }
  }
}
window.PushHubSDK = PushHubSDK;
