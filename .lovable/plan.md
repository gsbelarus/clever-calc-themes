
# Break-Even-Rechner (WKO) — План реализации

Калькулятор точки безубыточности для австрийских ИП с полной логикой расчётов из спецификации, в стиле макетов WKO.

## Языки и темы
- **DE / EN** переключатель в шапке (по умолчанию DE). Все UI-тексты, валидация, метки субсидий локализованы. Числа всегда в формате `de-AT` (`1.234,56 €`) — это стандарт WKO.
- **Светлая / тёмная** тема, переключатель в шапке (по умолчанию светлая). Тёмная адаптирует фоновую палитру (правая панель результатов остаётся в фирменном персиковом оттенке, в тёмной — приглушённый аналог).

## Экраны
1. **StartPage** — приветствие WKO с логотипом, заголовок «Break-Even-Rechner», краткое описание, кнопка «Berechnung starten».
2. **Calculator (Page1)** — основной экран по образцам (Desktop_01–09):
   - Шапка: красный логотип WKO с австрийским флагом, переключатели языка/темы.
   - Заголовок «Break Even Rechner» с inline help-иконкой.
   - **Левая колонка — карточка «Allgemein»**: Branche (dropdown 5 отраслей), Umsatz / Aufwand / Verrechnete Stunden (или Wareneinsatz / Provision — по отрасли), inline-ошибка валидации красным под полем.
   - Под ней зелёная карточка слайдера **«Erzielbarer Gewinn»** (1–1 000 000, шаг 100, разблокирована после первого расчёта).
   - 4 разворачиваемые карточки **«Daten Mitarbeiter:in 1–4»** с тогглом активации. При активации карточка разворачивается и показывает: Beschäftigungsform (5 типов), Bruttoentgelt, Wochenstunden, Beschäftigungsmonate, Zusatzkosten (мес/год), и для Dienstleistung/Gewerbe — секцию «Verkaufbare Stunden» (% + Stundensatz), для Gastro/Handel/Provision — «Umsatzsteigerung %». Кнопки Zurücksetzen и удалить.
   - Карточка **«EPU Lohnnebenkostenförderung»** (фиолетовый акцент по макету): тоггл, чекбоксы выбора сотрудника (только MA1, остальные disabled), список условий-чеклиста и Hinweis-блок. Аналогично Beschäftigungsbonus и aws StartUp-Förderung — взаимоисключаемые по сотруднику, со всеми правилами доступа из спецификации.
   - **Правая колонка — персиковая панель результатов** (sticky):
     - «Potenzial inkl. neuer Mitarbeiter» с 4 иконками силуэтов (заполненные сотрудники = красные, последовательно), колонки «inkl. zzgl Mitarbeiter» / «Break Even», строки Gesamtumsatzpotenzial и Gesamtstunden (для Dienst/Gewerbe).
     - «Umsatz Inkl. Neuer Mitarbeiter» с monatlich/jährlich: Gesamtumsatz (Provision), Break-Even-Umsatz, − Wareneinsatz, − Aufwand, − Personalkosten (с раскрытием → Details по каждому MA), + Förderungen gesamt, = Gewinn.
     - «Ausgangssituation (ohne Mitarbeiter)» — те же строки без сотрудников.
     - Кнопка «Zusammenfassung» → Page3.
3. **Page3 (Summary / Print)** — Stammdaten + все три блока всегда раскрыты, без интерактива, кнопка «Drucken» (`window.print()`), `@media print` стили.

## Логика расчётов (полностью на клиенте)
- Все константы 2026 (SV-границы, KommSt, DB FLAF, DZ DB, BV, Kürzungsfaktor, Förderung 24%) вынесены в `lib/calculator/constants.ts`.
- Функции `round0/2/4/6`, `calcLohnnebenkosten` (с/без maxBasis), `svPauschalierungsgrenzeExceeded`, `calcMitarbeiter`, `calculate`, `calculateExtended`, `validateInput` — точно по спецификации §5.
- Поведение по отраслям (видимость полей, дефолтные значения зарплат/часов, тексты Umsatz/Break-Even) — таблица §4.
- Правила субсидий §7.4: EPU только MA1, Bonus требует ≥6 мес и ≤3 MA, StartUp требует ≥3 мес и ≤5 лет с основания, ≤3 MA. Модалка при недоступном StartUp.
- Слайдер §7.5: разблокируется после первого валидного расчёта; любое изменение поля сбрасывает в 0; вычисленные значения отображаются серым.
- Автоматический пересчёт при изменении любого поля (debounce 300 мс).
- Ошибки валидации показываются inline под соответствующим полем + общий ErrorModal для блокирующих случаев.

## Технические решения
- React Context для state (input, result, language, theme, expanded sections).
- `Intl.NumberFormat('de-AT')` для всех чисел независимо от UI-языка.
- shadcn/ui компоненты (Card, Switch, Slider, Select, Checkbox, Dialog, Tooltip) с кастомизацией под фирменный стиль WKO.
- Tooltip с красной «i» иконкой возле каждого поля.
- Адаптивная вёрстка: на <1024px правая панель уходит вниз, на <480px — стек.
- Footer с ссылками: Barrierefreiheitserklärung | Datenschutzerklärung | Cookie-Einstellungen | © 2026 WKO.
- Юнит-тесты на ключевые функции расчёта (Vitest уже настроен).

После имплементации можно проверить расчёты на эталонных значениях из макетов (8.578,94 € / 100.372,77 € и т.д.).
