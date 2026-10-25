import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { company, primaryActions, quickActions } from './constants';
import './styles.css';
import logo from '../assets/logo.png';

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" /></>,
    whatsapp: <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.57 7.47L4 20l1.07-3.79A8.5 8.5 0 1 1 20.5 11.5z" /><path d="M8.2 8.1c.2-.45.42-.46.78-.47h.3c.2 0 .42.08.51.38l.61 1.47c.08.2.05.4-.08.57l-.48.61c-.13.16-.27.28-.12.55a6.8 6.8 0 0 0 3.22 3.2c.27.14.42.12.57-.06l.63-.76c.16-.2.33-.2.56-.11l1.43.68c.24.12.4.17.45.27.06.1.06.57-.14 1.08-.2.51-1.16.99-1.6 1.02-.42.04-1.03.19-3.47-.99-2.92-1.42-4.77-4.96-4.91-5.2-.14-.24-1.18-1.98-.26-2.88z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    'map-pin': <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></>,
    linkedin: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6M8 7.5v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" /></>,
    'user-plus': <><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M16 11h6" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 15h2M14 15h2" /></>,
    building: <><path d="M3 21h18M5 21V5l7-3 7 3v16M9 21v-4h6v4M8 8h1M15 8h1M8 12h1M15 12h1" /></>,
    navigation: <><path d="m3 11 18-8-8 18-2-8-8-2z" /></>,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
    'arrow-right': <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    'arrow-up-right': <><path d="M7 17 17 7M8 7h9v9" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></>,
  };
  return <span className="icon" aria-hidden="true"><svg {...common}>{paths[name] || paths.globe}</svg></span>;
}

function QuickActionModal({ action, onClose, onToast }) {
  if (!action) return null;
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(action.value || '');
      onToast('Copied to clipboard');
    } catch { onToast('Copy was not available'); }
    onClose();
  };
  const open = () => {
    if (!action.href) {
      onToast(`Add ${action.key} details in src/constants.js`);
      return;
    }
    onClose();
  };
  return (
    <div className="modal-wrap" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className={`modal-icon modal-${action.key}`}><Icon name={action.icon} /></div>
        <h2 id="modal-title">{action.title}</h2>
        <p className="eyebrow">{action.detailLabel}</p>
        <div className="modal-value">{action.value}</div>
        <div className="modal-actions">
          <button className="button secondary" onClick={copy}>Copy</button>
          {action.href ? <a className="button primary" href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={open}>Open <Icon name="arrow-up-right" /></a> : <button className="button primary" onClick={open}>Configure</button>}
        </div>
      </div>
    </div>
  );
}

function VisitModal({ onClose, onToast }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const send = () => {
    if (!name.trim()) { setStatus('Please enter your name.'); return; }
    if (!company.whatsapp) { setStatus('Add a WhatsApp number in src/constants.js to enable notifications.'); return; }
    setBusy(true);
    const sendMessage = (locationText) => {
      const message = `Hi ${company.name}, I’m ${name.trim()} and I’m on my way to visit.${locationText ? ` My location: ${locationText}` : ''}`;
      window.open(`https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      setBusy(false);
      onClose();
      onToast('Opening WhatsApp');
    };
    if (!navigator.geolocation) { sendMessage('Location sharing is not available on this device.'); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => sendMessage(`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`),
      () => sendMessage('Location was not shared.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="modal-wrap" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal visit-modal" role="dialog" aria-modal="true" aria-labelledby="visit-title">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-icon modal-visit"><Icon name="navigation" /></div>
        <h2 id="visit-title">On your way to visit?</h2>
        <p className="modal-help">Tell us your name and optionally share your current location over WhatsApp.</p>
        <input className="visit-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" maxLength="60" autoFocus />
        {status && <p className="modal-status" role="status">{status}</p>}
        <div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" onClick={send} disabled={busy}>{busy ? 'Locating…' : 'Notify us'}</button></div>
      </div>
    </div>
  );
}

function createVCard() {
  const escape = (value) => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  return ['BEGIN:VCARD', 'VERSION:3.0', `N:;${escape(company.name)};;;`, `FN:${escape(company.name)}`, `ORG:${escape(company.name)}`, `NOTE:${escape(company.tagline)}`, `TEL;TYPE=WORK,VOICE:${escape(company.phone)}`, `EMAIL;TYPE=INTERNET,WORK:${escape(company.email)}`, `URL:${escape(company.website)}`, `ADR;TYPE=WORK:;;${escape(company.address)};;;;`, 'END:VCARD'].join('\r\n');
}

function downloadContact() {
  const url = URL.createObjectURL(new Blob([createVCard()], { type: 'text/vcard;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${company.shortName || 'company'}-contact.vcf`;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('company-card-theme') || 'light');
  const [modalAction, setModalAction] = useState(null);
  const [showVisit, setShowVisit] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [views, setViews] = useState('—');
  const [visited, setVisited] = useState(false);

  const visitorEndpoint = useMemo(() => {
    const { namespace, key } = company.visitorCounter;
    return `https://abacus.jasoncameron.dev/${visited ? 'get' : 'hit'}/${namespace}/${key}`;
  }, [visited]);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    let counted = false;
    try { counted = sessionStorage.getItem('aarambh-card-counted') === '1'; } catch { /* storage can be unavailable */ }
    setVisited(counted);
  }, []);
  useEffect(() => {
    fetch(visitorEndpoint).then((response) => response.json()).then((data) => {
      if (typeof data?.value === 'number') setViews(data.value.toLocaleString());
      if (!visited) { try { sessionStorage.setItem('aarambh-card-counted', '1'); } catch { /* ignore */ } }
    }).catch(() => setViews('—'));
  }, [visitorEndpoint, visited]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('company-card-theme', next);
  };
  const share = async () => {
    const cardUrl = window.location.href;
    const data = { title: company.name, text: company.shareMessage, url: cardUrl };
    if (navigator.share) {
      try { await navigator.share(data); } catch (error) { if (error.name !== 'AbortError') setToast('Sharing was not available'); }
    } else {
      try { await navigator.clipboard?.writeText(`${company.shareMessage}\n\n${cardUrl}`); setToast('Message and card link copied'); } catch { setToast('Sharing was not available'); }
    }
  };
  const handlePrimary = (action) => {
    if (action.key === 'contact') { downloadContact(); setToast('Contact card downloaded'); }
    if (action.key === 'share') share();
    if (action.key === 'visit') setShowVisit(true);
    if (action.key === 'schedule') {
      if (company.calendlyUrl) setScheduleOpen((open) => !open);
      else setToast('Add calendlyUrl in src/constants.js');
    }
    if (action.key === 'brochure') {
      if (company.brochureUrl) window.open(company.brochureUrl, '_blank', 'noopener,noreferrer');
      else setToast('Add brochureUrl in src/constants.js');
    }
  };

  return (
    <div className="page-shell">
      <div className="decor decor-one" /><div className="decor decor-two" /><div className="wave wave-one" /><div className="wave wave-two" /><div className="grid-glow" />
      <main className="card" aria-label={`${company.name} digital visiting card`}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
        <div className="cover"><img src={logo} alt={`${company.name} logo`} /></div>
        <header className="company-header">
          <div className="company-avatar"><img src={logo} alt="" /></div>
          <div className="company-identity"><h1>{company.name}</h1><p>{company.tagline}</p><p>{company.description}</p></div>
        </header>
        <section className="quick-actions" aria-label="Quick contact actions">
          {quickActions.map((action) => <button key={action.key} className={`quick-tile quick-${action.key}`} onClick={() => setModalAction(action)} aria-label={action.label} title={action.title}><Icon name={action.icon} /><span>{action.label}</span></button>)}
        </section>
        <section className="primary-actions" aria-label="Primary actions">
          {primaryActions.map((action) => <button key={action.key} className={`action-card ${action.key === 'contact' ? 'featured' : ''} ${action.key === 'schedule' && scheduleOpen ? 'is-open' : ''}`} onClick={() => handlePrimary(action)} aria-expanded={action.key === 'schedule' ? scheduleOpen : undefined}>
            <span className={`action-icon action-${action.key}`}><Icon name={action.icon} /></span><span className="action-copy"><strong>{action.title}</strong><small>{action.subtitle}</small></span><span className="arrow"><Icon name={action.key === 'brochure' ? 'arrow-up-right' : 'arrow-right'} /></span>
          </button>)}
        </section>
        {scheduleOpen && company.calendlyUrl && <section className="schedule-embed" aria-label="Schedule a meeting"><iframe title="Schedule a meeting" src={company.calendlyUrl} /></section>}
        <footer className="footer"><div><strong>{company.name}</strong><span>{company.address}</span></div><div className="visits" aria-label="Visitor count"><Icon name="eye" /><span>{views} views</span></div></footer>
      </main>
      {/* <p className="edit-note">Update your details in <code>src/constants.js</code></p> */}
      <QuickActionModal action={modalAction} onClose={() => setModalAction(null)} onToast={setToast} />
      {showVisit && <VisitModal onClose={() => setShowVisit(false)} onToast={setToast} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
