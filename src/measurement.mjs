// Google Tag Manager (GTM-TK35KQ2K) is loaded in every page's <head> by scripts/build.mjs,
// together with Consent Mode v2 defaults. This module only updates consent and pushes events.
// GA4 is configured inside the GTM container, so no gtag.js is loaded here.
const preferenceKey = 'ummd-measurement';
const layer = window.dataLayer = window.dataLayer || [];

function gtag() { layer.push(arguments); }

export function getPreference() {
  try { return localStorage.getItem(preferenceKey); }
  catch { return null; }
}
function consent(state) {
  return { analytics_storage: state, ad_storage: state, ad_user_data: state, ad_personalization: 'denied' };
}
export function setPreference(value) {
  try { localStorage.setItem(preferenceKey, value); } catch {}
  gtag('consent', 'update', consent(value === 'allow' ? 'granted' : 'denied'));
}
// Call and WhatsApp clicks reach GTM as dataLayer events; Google tags respect the consent state.
export function track(action, location) {
  layer.push({event: action, cta_location: location});
}
