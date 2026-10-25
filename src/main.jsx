import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { company, primaryActions, quickActions } from './constants';
import './styles.css';
import logo from '../assets/logo.png';

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
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
        <div className={`modal-icon modal-${action.key}`}><Icon>{action.icon}</Icon></div>
        <h2 id="modal-title">{action.title}</h2>
        <p className="eyebrow">{action.detailLabel}</p>
        <div className="modal-value">{action.value}</div>
        <div className="modal-actions">
          <button className="button secondary" onClick={copy}>Copy</button>
          {action.href ? <a className="button primary" href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={open}>Open <span aria-hidden="true">↗</span></a> : <button className="button primary" onClick={open}>Configure</button>}
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
        <div className="modal-icon modal-visit"><Icon>➤</Icon></div>
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
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? '☼' : '☾'}</button>
        <div className="cover"><img src={logo} alt={`${company.name} logo`} /></div>
        <header className="company-header">
          <div className="company-avatar"><img src={logo} alt="" /></div>
          <div className="company-identity"><h1>{company.name}</h1><p>{company.tagline}</p><p>{company.description}</p></div>
        </header>
        <section className="quick-actions" aria-label="Quick contact actions">
          {quickActions.map((action) => <button key={action.key} className={`quick-tile quick-${action.key}`} onClick={() => setModalAction(action)} aria-label={action.label} title={action.title}><Icon>{action.icon}</Icon><span>{action.label}</span></button>)}
        </section>
        <section className="primary-actions" aria-label="Primary actions">
          {primaryActions.map((action) => <button key={action.key} className={`action-card ${action.key === 'contact' ? 'featured' : ''} ${action.key === 'schedule' && scheduleOpen ? 'is-open' : ''}`} onClick={() => handlePrimary(action)} aria-expanded={action.key === 'schedule' ? scheduleOpen : undefined}>
            <span className={`action-icon action-${action.key}`}><Icon>{action.icon}</Icon></span><span className="action-copy"><strong>{action.title}</strong><small>{action.subtitle}</small></span><span className="arrow">{action.key === 'brochure' ? '↗' : '→'}</span>
          </button>)}
        </section>
        {scheduleOpen && company.calendlyUrl && <section className="schedule-embed" aria-label="Schedule a meeting"><iframe title="Schedule a meeting" src={company.calendlyUrl} /></section>}
        <footer className="footer"><div><strong>{company.name}</strong><span>{company.address}</span></div><div className="visits" aria-label="Visitor count"><span aria-hidden="true">◉</span><span>{views} views</span></div></footer>
      </main>
      {/* <p className="edit-note">Update your details in <code>src/constants.js</code></p> */}
      <QuickActionModal action={modalAction} onClose={() => setModalAction(null)} onToast={setToast} />
      {showVisit && <VisitModal onClose={() => setShowVisit(false)} onToast={setToast} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
