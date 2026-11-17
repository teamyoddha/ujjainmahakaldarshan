import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {getPreference, setPreference, track} from './measurement.mjs';

const name = 'Ujjain Mahakal Darshan';
const phone = '+91 70249 40106';
const tel = 'tel:+917024940106';
const address = '37B, Ambaprasad Tiwari Marg, Anand Ganj Colony, Ujjain, Madhya Pradesh 456006';
const maps = 'https://maps.app.goo.gl/eX7LFwtNZ51NBwiL9';
const whatsappUrl = tour => 'https://wa.me/917024940106?text=' + encodeURIComponent(tour
  ? `Hello, I'm interested in the ${tour}. Could you share the itinerary, availability, inclusions and quote?`
  : "Hello, I'm planning a visit to Ujjain and would like details about your services and availability.");
const photos = [
  {name:'Mahakaleshwar Temple', text:'A sacred stop in the heart of Ujjain.', file:'7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg', author:'Ashverse', focus:'center 54%'},
  {name:'Mahakal Lok', text:'Explore the corridor near the temple.', file:'e/eb/Mahakal_lok.jpg', author:'Nilimajhapate', focus:'center 47%'},
  {name:'Ram Ghat', text:'Make time for the banks of the Shipra.', file:'4/45/Ram_Ghat_ujjain.jpg', author:'Puneet Neeraj 024', focus:'center 57%'},
  {name:'Omkareshwar', text:'Omkareshwar Jyotirlinga, Mamleshwar Temple and the Narmada riverfront.', file:'1/19/Omkareshwar_-_Narmada.jpg', author:'Shampa Chaturvedi', focus:'center'},
  {name:'Maheshwar', text:'Explore Maheshwar Fort and Ahilya Ghat on the Narmada.', file:'9/95/Maheshwar_Fort-Ahilya_Ghat.jpg', author:'Gargiekulkarni', focus:'center'},
  {name:'Indore', text:'Add Rajwada Palace and Indore’s old city to your itinerary.', file:'3/38/Rajwada_indore.jpg', author:'2022maliwal', focus:'center', thumb:960}
];
const imageUrl = photo => photo.thumb
  ? `https://thumb.wikimedia.org/wikipedia/commons/thumb/${photo.file}/${photo.thumb}px-${photo.file.split('/').at(-1)}`
  : 'https://upload.wikimedia.org/wikipedia/commons/' + photo.file;
const heroImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/' + photos[0].file + '/1280px-Mahakaleshwar_Temple%2C_Ujjain.jpg';
const navigation = [['Tour Packages', 'packages'], ['Places to Visit', 'gallery'], ['About', 'about'], ['FAQs', 'faq']];
const filters = ['All packages', 'Ujjain', 'Jyotirlinga', 'Multi-city'];
const tours = [
  {id:'mahakal', name:'Ujjain Mahakal Darshan Tour', category:'Ujjain', photo:photos[0], route:'Ujjain', stops:['Mahakaleshwar Temple', 'Mahakal Lok', 'Harsiddhi Temple', 'Kal Bhairav Temple', 'Ram Ghat']},
  {id:'jyotirlinga', name:'Mahakal & Omkareshwar Jyotirlinga Tour', category:'Jyotirlinga', photo:photos[3], route:'Ujjain → Omkareshwar', stops:['Mahakaleshwar Temple', 'Omkareshwar Jyotirlinga', 'Mamleshwar Temple', 'Narmada riverfront']},
  {id:'four-city', name:'Ujjain, Omkareshwar, Maheshwar & Indore', category:'Multi-city', photo:photos[4], route:'Ujjain → Omkareshwar → Maheshwar → Indore', stops:['Mahakaleshwar Temple', 'Omkareshwar Jyotirlinga', 'Maheshwar Fort and Ahilya Ghat', 'Rajwada Palace']},
  {id:'heritage', name:'Ujjain & Indore Heritage Tour', category:'Multi-city', photo:photos[5], route:'Ujjain → Indore', stops:['Mahakaleshwar Temple', 'Mahakal Lok', 'Rajwada Palace', 'Indore old city']},
  {id:'family', name:'Ujjain Family Pilgrimage', category:'Ujjain', photo:photos[1], route:'Ujjain · Family itinerary', stops:['Mahakaleshwar Temple', 'Harsiddhi Temple', 'Mangalnath Temple', 'Mahakal Lok']},
  {id:'custom', name:'Custom Spiritual Tour', category:'Custom itinerary', photo:photos[2], route:'Choose your destinations', stops:['Pick the temples and ghats you want to visit', 'Share your travel dates and group size', 'Discuss pickup and any practical needs']}
];
const titles = {
  privacy:'Privacy Policy', terms:'Terms & Conditions', disclaimer:'Disclaimer',
  contact:'Contact Information', 'photo-credits':'Photo Credits'
};
const services = [
  ['temple','Mahakaleshwar visit','Discuss your travel dates and what to plan around your temple visit.'],
  ['route','Ujjain temple itinerary','Share the temples and ghats you want to visit and the time you have in the city.'],
  ['group','Family and group enquiries','Tell us your group size, pickup plans and any practical needs so we can discuss available support.']
];
const faqs = [
  ['How do I enquire?', 'Call or WhatsApp the team with your travel dates, group size and places you’d like to visit.'],
  ['Can I book or pay on this website?', 'The site handles enquiries by phone and WhatsApp. Ask the team to confirm availability, inclusions and any charges before arranging a service.'],
  ['Can you guarantee darshan or special entry?', 'The temple administration determines entry, passes, timings and availability. Please check its official channels for current rules and pass details.'],
  ['Where are you located?', address]
];
const icons = {
  phone:<path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a12 12 0 0 1-6-6l2-2-2-5Z"/>,
  chat:<><path d="M20 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.2-4.1A8.5 8.5 0 1 1 20 11.5Z"/><path d="M9 8c0 3.5 2.5 6 6 6"/></>,
  pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  temple:<><path d="M3 21h18M6 21V10h12v11M4 10l8-7 8 7H4Zm6 11v-6h4v6"/></>,
  route:<><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></>,
  group:<><circle cx="9" cy="8" r="3"/><path d="M3 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-14a3 3 0 0 1 0 6m2 3a4 4 0 0 1 3 4v1"/></>,
  arrow:<path d="M6 18 18 6M8 6h10v10"/>,
  menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
  close:<path d="m6 6 12 12M18 6 6 18"/>
};
function Icon({type}) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}
function ContactActions({location, tone = 'light', tour}) {
  return <div className={'actions ' + tone}>
    <a className="button call" href={tel} onClick={() => track('call_click', location)}><Icon type="phone"/>Call now</a>
    <a className="button whatsapp" href={whatsappUrl(tour)} onClick={() => track('whatsapp_click', location)}><Icon type="chat"/>WhatsApp</a>
  </div>;
}
function Logo() {
  return <a className="brand" href="./" aria-label={name + ' homepage'}><img src="assets/logo.webp" alt={name} width="320" height="151"/></a>;
}
function Header({home}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return <>
    <div className="top"><div className="wrap"><span lang="hi">ॐ नमः शिवाय</span><a href={maps}><Icon type="pin"/>Ujjain, Madhya Pradesh</a></div></div>
    <header><div className="wrap header">
      <Logo/>
      {home ? <>
        <button ref={trigger} className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><Icon type={open ? 'close' : 'menu'}/></button>
        <nav id="main-nav" className={open ? 'open' : ''} aria-label="Main navigation">
          {navigation.map(([label,id]) => <a key={id} href={'#' + id} onClick={() => setOpen(false)}>{label}</a>)}
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </nav>
        <a className="button header-call" href={tel} onClick={() => track('call_click','header')}><Icon type="phone"/>{phone}</a>
      </> : <a className="back" href="./">← Back to homepage</a>}
    </div></header>
  </>;
}
function LocationCard(){
  return <address><span className="icon-box"><Icon type="pin"/></span><div><strong>{name}</strong><p>{address}</p><a href={maps}>Get directions <Icon type="arrow"/></a></div></address>;
}
function TourPackages(){
  const [filter, setFilter] = useState(filters[0]);
  const [tour, setTour] = useState(null);
  const dialog = useRef(null);
  const visibleTours = filter === filters[0] ? tours : tours.filter(option => option.category === filter);
  useEffect(() => {
    if (tour && !dialog.current.open) dialog.current.showModal();
  }, [tour]);

  return <section className="section tour-section" id="packages"><div className="wrap">
    <h2>Tour packages</h2>
    <p className="section-intro">Browse Ujjain temple routes and nearby destinations. Share your travel dates and group size to confirm availability, inclusions and pricing.</p>
    <div className="tour-filters" role="group" aria-label="Filter tour packages">
      {filters.map(label => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}
    </div>
    <div className="cards tour-grid">{visibleTours.map(option => <article className="tour-card" key={option.id}>
      <img className="tour-image" src={imageUrl(option.photo)} alt="" loading="lazy" decoding="async" width="480" height="270"/>
      <div className="tour-content">
        <p className="tour-route"><Icon type="pin"/>{option.route}</p>
        <h3>{option.name}</h3>
        <ul>{option.stops.slice(0, 3).map(stop => <li key={stop}>{stop}</li>)}</ul>
        <div className="actions tour-actions">
          <button className="button call" type="button" onClick={() => setTour(option)} aria-label={'View itinerary for ' + option.name}>View itinerary</button>
          <a className="button whatsapp" href={whatsappUrl(option.name)} onClick={() => track('whatsapp_click', 'package_' + option.id)} aria-label={'Enquire on WhatsApp about ' + option.name}><Icon type="chat"/>WhatsApp</a>
        </div>
      </div>
    </article>)}</div>
    <dialog className="tour-dialog" ref={dialog} aria-labelledby="tour-title" onClose={() => setTour(null)}>
      {tour && <>
        <button type="button" className="tour-close" aria-label="Close itinerary" onClick={() => dialog.current.close()}><Icon type="close"/></button>
        <p className="eyebrow">{tour.route}</p>
        <h2 id="tour-title">{tour.name}</h2>
        <h3>Suggested highlights</h3>
        <ul>{tour.stops.map(stop => <li key={stop}>{stop}</li>)}</ul>
        <p>Confirm the final route, transport, stay, pricing and availability with the team before booking. Temple entry follows the temple administration’s rules.</p>
        <ContactActions location={'itinerary_' + tour.id} tour={tour.name}/>
      </>}
    </dialog>
  </div></section>;
}
function Home(){
  return <main id="main">
    <section className="hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">PILGRIMAGE ENQUIRIES IN UJJAIN</p>
        <h1>Plan your visit <em>to Mahakal.</em></h1>
        <p className="lead">Speak with a local team about your Mahakaleshwar visit, the temples you’d like to see, and the support your group needs.</p>
        <ContactActions location="hero" tone="dark"/>
        <p className="independent">Independent travel enquiry service</p>
      </div>
      <figure className="hero-visual">
        <img src={heroImage} alt="The illuminated Mahakaleshwar Temple in Ujjain" width="1280" height="720" fetchPriority="high"/>
        <figcaption><Icon type="pin"/><span>Mahakaleshwar Temple<small>Ujjain, Madhya Pradesh</small></span></figcaption>
      </figure>
    </div></section>
    <TourPackages/>
    <section className="section" id="about"><div className="wrap split">
      <div><p className="eyebrow">ABOUT US</p><h2>A local point of contact for your Ujjain visit</h2></div>
      <div className="body-copy"><p>Tell us when you’re coming, who’s travelling and which places you’d like to see. We’ll discuss the assistance available for your trip so you can plan before you travel.</p><p>Temple entry and darshan arrangements follow the temple administration’s rules.</p></div>
    </div></section>
    <section className="section tint" id="services"><div className="wrap">
      <p className="eyebrow">TRIP ENQUIRIES</p><h2>What can we help you plan?</h2>
      <div className="cards">{services.map(([icon,title,description]) => <article className="service" key={title}>
        <span className="icon-box"><Icon type={icon}/></span><h3>{title}</h3><p>{description}</p>
      </article>)}</div>
      <div className="service-action"><span>Share your dates and group size when you get in touch.</span><ContactActions location="services"/></div>
    </div></section>
    <section className="section benefits"><div className="wrap split">
      <div><p className="eyebrow">WHY CONTACT US</p><h2>Know what to expect before you go</h2></div>
      <ul><li><strong>Speak with a local contact</strong><span>Reach our Ujjain team directly by phone or WhatsApp.</span></li>
      <li><strong>Plan around your travellers</strong><span>Discuss timing, temple stops and the practical needs of your group.</span></li>
      <li><strong>Confirm details in advance</strong><span>Ask about availability, what’s included and any charges before confirming plans.</span></li></ul>
    </div></section>
    <section className="section" id="gallery"><div className="wrap">
      <h2>Places to visit</h2>
      <p className="section-intro">Explore Ujjain’s temples and ghats, then extend your trip to Omkareshwar, Maheshwar or Indore.</p>
      <div className="cards gallery">{photos.map(photo => <figure key={photo.name}>
        <img src={imageUrl(photo)} alt={photo.name} style={{objectPosition:photo.focus}} loading="lazy" decoding="async" width="480" height="320"/>
        <figcaption><h3>{photo.name}</h3><p>{photo.text}</p></figcaption>
      </figure>)}</div>
    </div></section>
    <section className="section tint" id="faq"><div className="wrap split">
      <div><p className="eyebrow">FAQs</p><h2>Before you visit</h2></div>
      <div className="faqs">{faqs.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </div></section>
    <section className="section" id="contact"><div className="wrap contact-panel">
      <div><p className="eyebrow">CONTACT US</p><h2>Planning a trip to Ujjain?</h2><p>Ask about availability, inclusions and quoted charges before confirming your plans.</p><ContactActions location="contact" tone="dark"/></div>
      <LocationCard/>
    </div></section>
  </main>;
}
function Policy({page}){
  const content = {
    privacy:<><h2>Information you share</h2><p>When you call or WhatsApp us, we may receive your number, message and travel information. We use this information to answer your enquiry and discuss arrangements. Avoid sending documents or payment details in an initial message.</p><h2>Optional measurement</h2><p>If you allow measurement, Google Analytics and Google Tag Manager may process page and interaction information, including Call and WhatsApp clicks. Your choice is saved in your browser and can be changed in the footer.</p><h2>External services</h2><p>WhatsApp and Google Maps have their own privacy policies. Contact us about your enquiry data through the <a href="contact.html">contact page</a>.</p></>,
    terms:<><h2>Enquiries and arrangements</h2><p>A call, message or quoted itinerary does not confirm an arrangement. Ask the team to confirm availability, scope, total charges and applicable payment, cancellation and refund terms in writing before accepting a paid service.</p><h2>Temple rules</h2><p>The temple administration controls entry, passes and schedules. Check current requirements through official temple channels.</p></>,
    disclaimer:<><h2>Independent service</h2><p>Ujjain Mahakal Darshan is an independent service provider. It is not an official Mahakaleshwar Temple or government website and does not guarantee darshan, passes or special entry.</p><h2>Destination information</h2><p>Photos illustrate destinations. Verify current schedules and access requirements through official temple channels before travelling.</p></>,
    contact:<><LocationCard/><div className="legal-actions"><ContactActions location="contact_page"/></div></>,
    'photo-credits':<><p>These photographs are available under the <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 license</a>.</p><ul>{photos.map(photo => <li key={photo.name}><a href={'https://commons.wikimedia.org/wiki/File:' + photo.file.split('/').at(-1)}>{photo.name}</a> by {photo.author}.</li>)}</ul></>
  };
  return <main id="main" className="section"><article className="wrap legal"><h1>{titles[page]}</h1>{content[page]}</article></main>;
}
function Footer(){
  const dialog = useRef(null);
  const [preference, updatePreference] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = getPreference();
    if (saved) setPreference(saved);
    updatePreference(saved);
    setReady(true);
  }, []);
  function choose(choice) {
    setPreference(choice);
    updatePreference(choice);
    if (dialog.current?.open) dialog.current.close();
  }
  const options = () => <div className="actions"><button type="button" className="button call" onClick={() => choose('allow')}>Allow measurement</button><button type="button" className="button whatsapp" onClick={() => choose('deny')}>Decline</button></div>;
  return <>
    {ready && !preference && <aside className="privacy-prompt" aria-label="Privacy choices"><div className="wrap"><p>Allow optional analytics and advertising measurement?</p>{options()}</div></aside>}
    <footer><div className="wrap footer"><div><Logo/><p>Independent travel enquiry service.<br/>Ujjain, Madhya Pradesh</p></div>
      <div><strong>Visit or get in touch</strong><p>{address}</p><a href={tel} onClick={() => track('call_click','footer')}>{phone}</a></div>
      <nav aria-label="Policies and resources">{Object.entries(titles).map(([key,label]) => <a href={key + '.html'} key={key}>{label}</a>)}<button type="button" onClick={() => dialog.current.showModal()}>Privacy choices</button></nav>
    </div></footer>
    <dialog ref={dialog} aria-labelledby="privacy-title"><h2 id="privacy-title">Privacy choices</h2><p>Allow optional site measurement. Call, WhatsApp and directions are available with either choice.</p>{options()}<a href="privacy.html">Read the Privacy Policy</a></dialog>
  </>;
}
const page = document.body.dataset.page;
const home = page === 'home';
function App(){
  return <><a className="skip" href="#main">Skip to content</a><Header home={home}/>{home ? <Home/> : <Policy page={page}/>}<Footer/>{home && <div className="sticky"><ContactActions location="sticky"/></div>}</>;
}
createRoot(document.getElementById('root')).render(<App/>);

