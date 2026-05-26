'use client';

import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' }
];

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Detect currently set language from Google Translate cookie if it exists
    const checkCookie = () => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1]) {
        setCurrentLang(match[1]);
      }
    };
    checkCookie();
    const interval = setInterval(checkCookie, 2000);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    try {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change'));
      } else {
        console.warn('Google Translate combo element not found yet. Retrying via cookies...');
        // Set cookies directly
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${langCode}; path=/;`; // fallback local path
        window.location.reload(); // Reload to trigger translation on load
      }
    } catch (e) {
      console.error('Translation trigger error:', e);
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(29, 78, 216, 0.05)',
          border: '1px solid rgba(29, 78, 216, 0.18)',
          borderRadius: '8px',
          padding: '8px 14px',
          color: '#1d4ed8',
          fontSize: '12.5px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
          outline: 'none'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(29, 78, 216, 0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(29, 78, 216, 0.05)'}
      >
        <Globe size={14} />
        <span>{activeLang.native}</span>
        <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          {/* Overlay to close */}
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          
          {/* Dropdown Menu */}
          <div style={{
            position: 'absolute',
            top: '42px',
            right: 0,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            padding: '6px',
            minWidth: '150px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            zIndex: 999
          }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  background: currentLang === lang.code ? 'rgba(29, 78, 216, 0.06)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: currentLang === lang.code ? 700 : 500,
                  color: currentLang === lang.code ? '#1d4ed8' : '#334155',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s'
                }}
                onMouseOver={e => e.currentTarget.style.background = currentLang === lang.code ? 'rgba(29, 78, 216, 0.08)' : '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = currentLang === lang.code ? 'rgba(29, 78, 216, 0.06)' : 'transparent'}
              >
                <span>{lang.native}</span>
                <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{lang.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
