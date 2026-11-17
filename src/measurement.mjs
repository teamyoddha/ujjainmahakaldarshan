const containerId = 'GTM-P49GVZBX';
const measurementId = 'G-1SP9FPG3YE';
const preferenceKey = 'ummd-measurement';
const layer = window.dataLayer = window.dataLayer || [];
let allowed = false;
let loaded = false;

function googleTag() { layer.push(arguments); }

export function getPreference() {
  try { return localStorage.getItem(preferenceKey); }
  catch { return null; }
}
function consent(state) {
  return { analytics_storage: state, ad_storage: state, ad_user_data: state, ad_personalization: 'denied' };
}
function loadTags() {
  loaded = true;
  googleTag('consent', 'default', consent('granted'));
  googleTag('js', new Date());
  googleTag('config', measurementId);
  layer.push({'gtm.start':Date.now(),event:'gtm.js'});
  for (const path of ['gtag/js?id=' + measurementId, 'gtm.js?id=' + containerId]) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/' + path;
    document.head.append(script);
  }
}
export function setPreference(value) {
  allowed = value === 'allow';
  try { localStorage.setItem(preferenceKey, value); } catch {}
  window['ga-disable-' + measurementId] = !allowed;
  if (allowed && !loaded) loadTags();
  else if (loaded) googleTag('consent', 'update', consent(allowed ? 'granted' : 'denied'));
}
export function track(action, location) {
  if (!allowed) return;
  layer.push({event:action,cta_location:location});
  googleTag('event',action,{send_to:measurementId,cta_location:location});
}

