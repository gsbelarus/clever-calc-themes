import { useI18n } from "@/lib/i18n/I18nProvider";

export const Footer = () => {
  const { tStr } = useI18n();
  return (
    <footer className="no-print mt-12 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-end gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:gap-4 sm:px-6">
        <a href="#" className="hover:text-foreground">{tStr("barrierefreiheit")}</a>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:text-foreground">{tStr("datenschutz")}</a>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:text-foreground">{tStr("cookies")}</a>
        <span className="hidden sm:inline">|</span>
        <span>© 2026 WKO</span>
      </div>
    </footer>
  );
};
