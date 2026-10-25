import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { company, primaryActions, quickActions } from './constants';
import './styles.css';

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Modal({ action, onClose }) {
  if (!action) return null;
  const copy = async () => {
    await navigator.clipboard?.writeText(action.value || '');
    onClose('Copied to clipboard');
  };
  return (
    <div className="modal-wrap" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="close" onClick={() => onClose()} aria-label="Close">×</button>
        <div className="modal-icon"><Icon>{action.icon}</Icon></div>
        <h2 id="modal-title">{action.label}</h2>
        <p className="eyebrow">{action.key === 'location' ? 'Office address' : 'Details'}</p>
        <div className="modal-value">{action.value}</div>
        <div className="modal-actions">
          <button className="button secondary" onClick={copy}>Copy</button>
          <a className="button primary" href={action.href} target={action.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => onClose()}>
            Open <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function createVCard() {
  const escape = (value) => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  return [
    'BEGIN:VCARD', 'VERSION:3.0', `N:;${escape(company.name)};;;`, `FN:${escape(company.name)}`,
    `ORG:${escape(company.name)}`, `NOTE:${escape(company.tagline)}`, `TEL;TYPE=WORK,VOICE:${escape(company.phone)}`,
    `EMAIL;TYPE=INTERNET,WORK:${escape(company.email)}`, `URL:${escape(company.website)}`,
    `ADR;TYPE=WORK:;;${escape(company.address)};;;;`, 'END:VCARD',
  ].join('\r\n');
}

function downloadContact() {
  const blob = new Blob([createVCard()], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${company.shortName || 'company'}-contact.vcf`;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('company-card-theme') || 'dark');
  const [modalAction, setModalAction] = useState(null);
  const [toast, setToast] = useState('');
  const availableActions = useMemo(() => primaryActions.filter((action) => action.key === 'contact' || action.key === 'share' || action.href), []);

  useEffect(() => document.documentElement.dataset.theme = theme, [theme]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('company-card-theme', next);
  };

  const share = async () => {
    const data = { title: company.name, text: company.tagline, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (error) { if (error.name !== 'AbortError') setToast('Sharing was not available'); }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      setToast('Card link copied');
    }
  };

  const handlePrimary = (action) => {
    if (action.key === 'contact') { downloadContact(); setToast('Contact card downloaded'); }
    if (action.key === 'share') share();
  };

  return (
    <div className="page-shell">
      <div className="decor decor-one" /><div className="decor decor-two" /><div className="grid-glow" />
      <main className="card" aria-label={`${company.name} digital visiting card`}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? '☼' : '☾'}
        </button>
        <header className="header">
          <div className="brand-mark" aria-label={`${company.name} logo`}>{company.shortName}</div>
          <div className="identity">
            <p className="overline">Digital visiting card</p>
            <h1>{company.name}</h1>
            <p className="tagline">{company.tagline}</p>
          </div>
        </header>
        <p className="description">{company.description}</p>

        <section className="quick-actions" aria-label="Quick contact actions">
          {quickActions.map((action) => (
            <button key={action.key} className={`quick-tile quick-${action.key}`} onClick={() => setModalAction(action)} aria-label={action.label}>
              <Icon>{action.icon}</Icon><span>{action.label}</span>
            </button>
          ))}
        </section>

        <section className="primary-actions" aria-label="Primary actions">
          {availableActions.map((action) => action.href ? (
            <a key={action.key} className="action-card" href={action.href} target="_blank" rel="noreferrer">
              <span className="action-icon"><Icon>{action.icon}</Icon></span><span className="action-copy"><strong>{action.title}</strong><small>{action.subtitle}</small></span><span className="arrow">↗</span>
            </a>
          ) : (
            <button key={action.key} className={`action-card ${action.key === 'contact' ? 'featured' : ''}`} onClick={() => handlePrimary(action)}>
              <span className="action-icon"><Icon>{action.icon}</Icon></span><span className="action-copy"><strong>{action.title}</strong><small>{action.subtitle}</small></span><span className="arrow">→</span>
            </button>
          ))}
        </section>

        <footer className="footer"><div><strong>{company.name}</strong><span>{company.address}</span></div><span className="footer-note">Let’s build something useful.</span></footer>
      </main>
      <p className="edit-note">Update your details in <code>src/constants.js</code></p>
      <Modal action={modalAction} onClose={(message) => { setModalAction(null); if (message) setToast(message); }} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
