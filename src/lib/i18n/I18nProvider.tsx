import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Lang, translations, TranslationKey } from "./translations";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TranslationKey) => string | readonly string[];
  tStr: (k: TranslationKey) => string;
  tList: (k: TranslationKey) => readonly string[];
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "wko-ber-lang";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "de";
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored === "de" || stored === "en" ? stored : "de";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) { void e; }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((k: TranslationKey) => translations[lang][k], [lang]);
  const tStr = useCallback(
    (k: TranslationKey) => {
      const v = translations[lang][k];
      return Array.isArray(v) ? (v as readonly string[]).join(" ") : (v as string);
    },
    [lang],
  );
  const tList = useCallback(
    (k: TranslationKey) => {
      const v = translations[lang][k];
      return Array.isArray(v) ? (v as readonly string[]) : ([v as string] as readonly string[]);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t, tStr, tList }), [lang, setLang, t, tStr, tList]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used within I18nProvider");
  return v;
};
