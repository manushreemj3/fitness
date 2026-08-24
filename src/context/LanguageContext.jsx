import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, TRANSLATIONS } from "../data/i18n";

const STORAGE_KEY = "fitbuddy.language";
const LanguageContext = createContext(null);

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.some((item) => item.id === saved)) return saved;
  } catch {}
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, language); } catch {}
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    languages: LANGUAGES,
    t(key, fallback) {
      return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? fallback ?? key;
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
