export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">API Documentation</h1>
        <p className="text-zinc-400 text-lg">Learn how to integrate Avero Signals into your application and trigger push notifications programmatically.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1: Client SDK */}
        <section>
          <h2 className="text-2xl font-medium text-white mb-4 flex items-center gap-2">
            <span className="text-brand">1.</span> Client SDK Integration
          </h2>
          <div className="bg-bg-card border border-border-main rounded-xl p-6 shadow-xl">
            <p className="text-zinc-400 mb-4">
              To enable push notifications on your website, simply include our lightweight JavaScript SDK in the <code className="text-brand bg-bg-input px-1.5 py-0.5 rounded">{'<head>'}</code> of your HTML.
              It works universally across all frameworks (React, Next.js, Vue, WordPress, etc.).
            </p>
            
            <div className="bg-bg-input border border-border-main rounded-lg overflow-hidden">
              <div className="border-b border-border-main px-4 py-2 bg-bg-main flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">HTML / Next.js / React</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-zinc-300 font-mono">
                {`<script src="https://pushhub.varunkulkarni.dpdns.org/api/sdk" data-project-id="YOUR_PROJECT_ID"></script>`}
              </pre>
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              Once added, the SDK will automatically prompt users to subscribe when they interact with your site, and it will auto-sync your site's favicon and URL to the Avero Signals dashboard!
            </p>
          </div>
        </section>

        {/* Section 2: REST API */}
        <section>
          <h2 className="text-2xl font-medium text-white mb-4 flex items-center gap-2">
            <span className="text-brand">2.</span> Sending Notifications via API
          </h2>
          <div className="bg-bg-card border border-border-main rounded-xl p-6 shadow-xl">
            <p className="text-zinc-400 mb-4">
              You can trigger push notifications automatically from your own backend (e.g., when a user makes a purchase, or a new chat message arrives) using the REST API.
            </p>
            
            <div className="mb-6 flex gap-4">
              <div className="bg-bg-input px-4 py-3 rounded-lg border border-border-main flex-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Endpoint</p>
                <p className="font-mono text-sm text-white">POST /api/v1/notify</p>
              </div>
              <div className="bg-bg-input px-4 py-3 rounded-lg border border-border-main flex-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Authentication</p>
                <p className="font-mono text-sm text-white">Bearer &lt;SECRET_API_KEY&gt;</p>
              </div>
            </div>

            <h3 className="text-white font-medium mb-3">cURL Example</h3>
            <div className="bg-bg-input border border-border-main rounded-lg overflow-hidden mb-6">
              <pre className="p-4 overflow-x-auto text-sm text-zinc-300 font-mono whitespace-pre-wrap">
{`curl -X POST https://pushhub.varunkulkarni.dpdns.org/api/v1/notify \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Payment Successful! 🎉",
    "body": "Your order #1234 has been confirmed.",
    "targetOS": "All"
  }'`}
              </pre>
            </div>

            <h3 className="text-white font-medium mb-3">Node.js (Fetch) Example</h3>
            <div className="bg-bg-input border border-border-main rounded-lg overflow-hidden mb-6">
              <pre className="p-4 overflow-x-auto text-sm text-zinc-300 font-mono whitespace-pre-wrap">
{`const response = await fetch('https://pushhub.varunkulkarni.dpdns.org/api/v1/notify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SECRET_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "New Message Received",
    body: "Alex just sent you a message.",
    targetOS: "Mac",          // Optional: 'Windows', 'Mac', 'iOS', 'Android', 'All'
    targetRegion: "America"   // Optional: 'America', 'Europe', 'Asia', 'All'
  })
});

const data = await response.json();
console.log(data); // { success: true, sent: 42 }`}
              </pre>
            </div>

            <div className="bg-brand/10 border border-brand/20 rounded-lg p-4">
              <h4 className="text-brand font-medium mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Security Notice
              </h4>
              <p className="text-sm text-brand/80">Never expose your Secret API Key in frontend client code (like React components). Always keep it hidden on your server-side environment.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
