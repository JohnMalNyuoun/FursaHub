import React, { createContext, useState, useEffect } from 'react';
import { setHtmlDirection } from '../i18n/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load user's language preference from sessionStorage on mount
  useEffect(() => {
    const key = localStorage.getItem('fh_user_role') === 'organisation' 
      ? 'fh_language_org' 
      : 'fh_language_youth';
    const savedLanguage = sessionStorage.getItem(key) || localStorage.getItem(key) || 'en';
    
    setLanguageState(savedLanguage);
    setHtmlDirection(savedLanguage);
    setIsLoading(false);
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    setHtmlDirection(lang);
    
    // Save to both sessionStorage and localStorage
    const key = localStorage.getItem('fh_user_role') === 'organisation' 
      ? 'fh_language_org' 
      : 'fh_language_youth';
    
    sessionStorage.setItem(key, lang);
    localStorage.setItem(key, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
