# TrainerRadar – Projektübersicht (Stand: Version 51, 09.11.2026)

Diese Datei ist das Gedächtnis des Projekts. Sie fasst zusammen, was gebaut wurde und warum.
**Maßgeblich ist immer der Code im Repository** – bei Widersprüchen gilt der Code, nicht diese Datei.

## Eckdaten
- **App:** TrainerRadar – Web-App (PWA) für Kinderfußball-Trainer, entstanden für die U10 von Wacker Mecklenbeck
- **Adresse:** https://cschwarte82.github.io/Wacker/ (großes W! Kleingeschrieben führt der Link ins Leere. QR-Code im Flyer zeigt dorthin)
- **Repository:** github.com/cschwarte82/wacker (öffentlich, GitHub Pages aus Branch `main`, Wurzelverzeichnis)
- **Claude-Zugriff:** Die Claude-GitHub-App ist für das Repo „Wacker“ freigegeben (Schreibrechte)
- **Zielgerät:** hauptsächlich iPhone, als App auf dem Home-Bildschirm

## Technik
- Alles in **einer Datei `index.html`** (HTML, CSS, JavaScript ohne Framework)
- `sw.js`: Service Worker, Cache zuerst + Aktualisierung im Hintergrund; bei neuer Version lädt sich die App einmal selbst neu
- `manifest.webmanifest`, Icons (`icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`)
- `jspdf.min.js` (jsPDF 2.5.2) für die Spielerprofil-PDFs, wird erst bei Bedarf geladen
- `TrainerRadar-Anleitung.pdf`: Benutzerhandbuch, in den Einstellungen verlinkt
- `TrainerRadar-Flyer.pdf`: Werbeflyer als PDF (aus `materialien/werbeflyer.html`), öffentlich unter cschwarte82.github.io/Wacker/TrainerRadar-Flyer.pdf – bei Flyer-Änderungen neu erzeugen
- `materialien/`: Quellen für Flyer und Handbuch, Screenshot-Skript, fiktive Demodaten

### Daten (nur lokal auf dem Gerät, localStorage)
- Schlüssel `u10-leistungsprofil-v2`: `{current, teams:{id:{name, players, sessions, lu, cfg, live, archive}}}`
- `cfg.src`: Werte-Quelle für Aufstellung und Ranglisten (`trainer` | `app` | `mix`, Standard `trainer`)
- `archive`: Liste archivierter Saisons `{id, name, created, from, to, players (Kopie), sessions}`; Archiv-Dateien haben das Sicherungsformat und werden beim Einlesen ins Archiv übernommen (archivierte Bewertungen kommen dabei nicht zurück in die laufende Saison)
- Schlüssel `u10-meta-v1`: `{lastBackup, lastChange, seenVersion}`
- Älterer Schlüssel `u10-leistungsprofil-v1` wird beim Start einmalig in Team „U10“ übernommen
- **Bewertungsarten** (`sessions`, Feld `type`): ohne type = Testtag (nur Messwerte), `eval` = Trainereinschätzung, `game` = Spiel (mit `live`-Daten aus der Live-Erfassung)
- **Live-Spiel** im Team gespeichert (`live`): Positionen, Bank, Uhr, Plus/Minus, Aktionen mit Kategorie (V50: Minus-only „Abspiel verpasst“ `verp` → Passspiel 1 + Übersicht 1; V51: „Großchance vergeben“ `gross` → Abschluss 2 + Technik 1; Kategorien mit `p:null` erscheinen nur beim Minus), Tore, Karten, Wechsel-Log, Einsatzzeiträume, Spielzeit-Einteilung
- Sicherung: JSON-Datei über Teilen-Menü; Einlesen ergänzt nur (nichts wird gelöscht)
- Es gibt **keine Cloud/Synchronisierung** – Co-Trainer tauschen Sicherungsdateien aus

### Pflicht bei jeder Änderung (Ablauf)
1. Änderung in `index.html`
2. `APP_VERSION` erhöhen und Cache-Namen in `sw.js` (`u10-profil-vXX`) angleichen
3. Eintrag in `CHANGELOG` (Was-ist-neu-Fenster) ergänzen
4. Kurzanleitung `GUIDE` in `index.html` anpassen, falls Bedienung betroffen
5. Handbuch (`materialien/handbuch.html`) **und Flyer** (`materialien/werbeflyer.html`) prüfen und anpassen (ausdrücklicher Wunsch des Trainers), Screenshots mit `materialien/shots_live.js`, PDFs neu erzeugen; Handbuch als `TrainerRadar-Anleitung.pdf` ablegen
6. Testen (Syntax-Check, Ablauf-Tests mit jsdom, Screenshots mit headless Chrome in iPhone-Größe 375 px), dann committen und pushen
7. Achtung CSS: keine generischen Klassennamen doppelt vergeben (Fehler in V27: `.dot` kollidierte mit `ul.dot`)

## Funktionen (Reiter)
- **Bewertung:** „+ Spiel“, „+ Testtag“ (nur messen, 14 Tests mit Anleitung + Stoppuhr), „+ Trainereinschätzung“; Trainingsschwerpunkte-Karte; im Spiel Reiter Bewertung, Verlauf, Aktionen, Export
- **Aufstellung:** „🧤 Torwart“-Karte erklärt Herkunft des Torwart-Werts (Bewertungen + Einträge, App-Aktionen) und den Grund (eigene Aufstellung / fest gewählt / bester Wert); Werte aus Trainer/App/Mix wählbar, 4+1/5+1/6+1, Formationen, „Stärkste“/„Ausgewogen“, Torwart fest oder automatisch, per Antippen anpassbar (bleibt gespeichert), Spielzeit-Einteilung, „▶ Live mit dieser Aufstellung“
- **Live:** Wechselvorschlag (💡, ab Minute 3, bis zu 2: wenig gespielt rein ⇄ lange gespielt raus, passende Position; `subSuggest`), kompakter Kopf (Uhr, Spielstand, Pause in einer Zeile; ↶ neben „Halbzeit beenden“), Tor/Gegentor/Karte in einer Zeile, Formation + Spielzeit-Ziel + Tor=Plus unter „Optionen“ (eingeklappt), Plus/Minus-Knöpfe bewusst groß (Wunsch des Trainers); Uhr mit Halbzeiten/Vierteln und Nachspielzeit, Plus/Minus mit Kategorie (5 s), Tor zählt sofort + Torschütze (7 s), Torschütze bekommt automatisch Plus „Guter Abschluss“ (`cfg.goalPlus`, Standard an; Aktion trägt `goal`-Verweis und folgt Torschützen-Änderung/Zurück), Gegentor, Gelb/Gelb-Rot/Rot, Wechsel und Positionstausch per Antippen, wieder einwechseln mit addierten Einsätzen, Spielzeit-Ampel (33/50/66 %), Spielverlauf, ↶ Zurück für alle Aktionen
- **Ranglisten:** bei Einschätzungs-Kategorien (inkl. Spielverhalten, Torwart, Technik) Werte aus Trainer/App/Mix wählbar; Bestwerte/Fortschritt je Test, Bereich, Einschätzung, Torwart, Tore, Tor-Bilanz auf dem Feld; „Aktuell vorne je Bereich“
- **Kader:** Spieler (Fuß, Spielweise `stil`: offensiv/ausgewogen/defensiv, Positionstreue `treue`: hoch/mittel/gering), Profil (Stärkenprofil-Radar, Messwerte, Trainer vs. App, Live-Bilanz, Entwicklungsziele), Stärkenkarte fürs Kind, Datensicherung
- **Zusammenführen (V42):** Spieler (`mergePlayers`/`pidRemap`: ersetzt die Spieler-Kennung in allen Sitzungen, Archiv, Live und Aufstellung; Plus/Minus/Minuten addiert, Listen angehängt, sonst gewinnt der bleibende Eintrag), Hinweis „Doppelt im Kader?“ (`dupPairs`, gleicher Vorname bzw. Namensanfang) mit „Alle zusammenführen“ (behält den Eintrag mit mehr Bewertungen), Mannschaften (`mergeTeams`). Einlesen (V49): Sitzungen, die zu einer archivierten Saison gehören (gleiche Kennung, in ein archiviertes Spiel eingeflossen, gleiches Spiel oder Datum im Archivzeitraum), werden übersprungen. Rechen-Cache (V49): `calcCache` mit Zähler `DV` (steigt bei jedem `saveLocal`/`loadTeam`) speichert `sessionsWith` und `srcVal`; Stresstest 3 Handys × 40 Wochen (242 Sitzungen, 35 Spiele) ≈ 0,54 MB im Speicher. Einlesen (V48): vorhandene Kinder behalten ihre Angaben, nur leere Felder `foot`/`stil`/`treue` werden aus der Sicherung ergänzt. Doppelt erfasste Live-Spiele (V43): `sameGame` = gleicher Tag und Spielzeiten überschneiden sich zu ≥ 50 % (`gameSpan`: `live.t0` = erster Uhrstart, sonst Ende − Dauer − 10 Min.); beim Einlesen werden beide zusammengelegt (`mergeGameRec`): Spielverlauf aus der vorhandenen, Live-Aktionen PRO KIND aus der Erfassung mit mehr Aktionen bei diesem Kind (V47: Torliste bleibt die eigene, offene Torschützen werden aus der anderen Erfassung übernommen, wenn dort ein Tor ±3 Spielminuten passt; danach wird das Tor-Plus neu aus der Torliste gebildet, damit Statistik und Plus immer übereinstimmen) (Christian 09.11.2026: Vater fokussiert evtl. sein Kind, Trainer hat breiten Blick); `merged` merkt sich die übernommene Kennung, damit erneutes Einlesen nichts doppelt, bereits doppelte zeigt „Bewertung“ an (`dupGames`, `A.gameDupKeep` übernimmt fehlende Einschätzungen/Notizen). Neue Spiele tragen `by` = Geräte-Kennung `META.dev`. Schutz: `dupPairs` schlägt keine Kinder vor, die gemeinsam in einer Sitzung vorkommen; exakte Namensgleichheit zuerst. Rückgängig (V43): `snapUndo` speichert vor jedem Zusammenführen/Spiel-Entfernen den Stand unter `u10-undo-v1` (24 h, ein Schritt), `A.undoDo`. „📤 Sicherung teilen“ (V43, `A.backup(true)`: öffnet immer das Teilen-Menü). „Nur Kader teilen“ (`rosterJSON`/`A.shareRoster`, `kind:'kader'`): nur aktive Kinder der aktuellen Mannschaft mit Name/Fuß/Spielweise/Positionstreue, keine Bewertungen, Ziele, Nachrichten; wird normal über „Sicherung einlesen“ eingelesen. Hintergrund: Sicherungen werden über Kennungen abgeglichen, nicht über Namen. Getrennt angelegte Kader von Trainer und Co-Trainer ergeben sonst doppelte Kinder.
- **Einstellungen (⚙︎):** Spielerprofile als PDF, Saisonbericht pro Kind als PDF (aktuelle oder archivierte Saison, fürs Elterngespräch, ohne Ranglisten; `buildSeasonPdf`), Saison-Rückblick für die Kinder (V40, `buildKidPdf`/`kidData`: 2 Seiten, Entwicklungsnetz erste vs. letzte 2 Einschätzungen, Testtag-Rekorde, Highlights wie bestes Spiel/erstes Tor/Markenzeichen, Abzeichen nach eigenen Schwellen, geschaffte und nächste Ziele, Nachricht aus `player.msg` oder Linien zum Reinschreiben; vergleicht nur mit sich selbst), Anleitung (PDF + Kurzfassung), Was ist neu, Saison-Archiv (abschließen, ansehen, als Datei, zurückholen, vom Gerät löschen, Speicheranzeige), Datensicherung, Versionsnummer
- **Mehrere Mannschaften** über das Feld „U10 ▾“ im Kopf

## Bewertungslogik
- Einschätzung 1–5: Spielverständnis, Freilaufen, Zweikampf, Passspiel, Dribbling, Übersicht, Mut, Kommunikation; Athletik (Schnelligkeit, Dynamik, Ausdauer) **nur in der Trainereinschätzung**; Torwart-Kategorien optional
- Zeitraum (`cfg.per`, Standard `mix`, Wunsch des Trainers): Potenzial = alle Werte der Saison (Einschätzungen: Schnitt, Tests/Bereiche: Bestwert, App: alle Spiele), Form = letzte `cfg.formWeeks` (4/6/8, Standard 6) Wochen (Tests: letzter Wert), Mix = Mittelwert; gilt für Aufstellung, Ranglisten, Profil-Karte „Potenzial & Form“. „Trainer vs. App“ im Profil nutzt weiter den Schnitt der letzten 3 Bewertungen
- Testwerte relativ zum Teamschnitt (3 = Schnitt)
- Quelle V35 (`srcMode`: trainer / app / mix, Standard `mix` = Mittel aus `liveVal` und `appCat`; alter Wert `live` → trainer). „Trainer“ = nur Einschätzungen (keine Tests) plus Live (`trainerVal`: Test-Bereiche über `TR_AREA` auf Athletik-/Dribbling-/Pass-/TW-Einschätzungen abgebildet, sonst `liveVal`): `liveVal` – Live-Aktionen als Zusatzbewertungen (Plus = 5, Minus = 1, je Aktion `LIVE_W`=0,25 einer Bewertung, über `ACT_MAP` anteilig auf Kategorien; `a:spiel`/`a:torwart` summieren die passenden Rating-Keys, `a:technik` die Technik-Aktionen). Deckel `LIVE_CAP`: Live-Gewicht ≤ Anzahl der Basiswerte im Zeitraum (also max. 50 %). Ohne Basiswert zählt Live allein. Zeitraum Mix = Mittel aus Potenzial- und Form-Rechnung. „App“ = App-Wert (`appCat`).
- Gewichte V33: Mittelfeld Passspiel 20 %, Ausdauer 15 %; Sturm mit `r:abschluss` 10 % (Trainer-Einschätzung „Abschluss / Torschuss“, seit V33 in RATINGS; App-Wert aus „Guter Abschluss“/Toren; zählt nicht für das ✓ „fertig bewertet“, damit alte Bewertungen vollständig bleiben), Technik 15 %, Freilaufen 15 %
- App-Wert aus Live-Aktionen (seit V41): (5 × Plus + 1 × Minus + 3 × APP_BUF) / (Plus + Minus + APP_BUF) mit APP_BUF = 2 (Christian: 2 Aktionen sollen wirken wie früher 4), Gewicht im Mix `w` = Anzahl / (Anzahl + 2), Tests w = 1 (`appW`; Mix = (Trainer + w·App) / (1 + w)). Anlass: Finn (Torwart, Einschätzungen > 4) stand im Mix nur bei 4, weil wenige TW-Aktionen den App-Wert Richtung 3 zogen. Vorher: 3 + 2 × (Plus − Minus) / (Plus + Minus + 4); Abweichung Trainer vs. App wird ab 5 Aktionen markiert
- Torwart (V38): Bei „Automatisch“ (Standard, `L.keeper` null/'auto') optimiert `bestLineup` die Feld-Slots plus `'TW'` gemeinsam; `slotFit(…,'TW')` = `a:torwart` (ohne TW-Wert 0). Torwart-Kinder zeigen Feld- und TW-Wert.
- Gastspieler (V37): `players[id]` mit `guest:true` (id `g…`). `plist()` blendet sie überall aus, `glist()` liefert sie für Aufstellung/Live. `slotFit` gibt Gästen v=0 → sie füllen nur Plätze, die sonst frei blieben. Entfernen: gelöscht, oder `active:false`, wenn schon in einem gespeicherten Spiel.
- Aufstellung: Zu-/Abschläge aus Spielweise (offensiv: Sturm +0,2/Abwehr −0,2, defensiv umgekehrt, ausgewogen: Mittelfeld +0,1) und Positionstreue (gering: Abwehr −0,3/Mittelfeld −0,1, hoch: Abwehr +0,1/Mittelfeld +0,05)
- Werte-Quelle: Trainer = Einschätzung + Messwerte (wie bisher); App = Werte aus „Trainer vs. App“; Mix = Mittelwert, fehlt einer, zählt der andere. Was die App nicht misst (Mut, Kommunikation), kommt immer vom Trainer
- Spielminuten wie im Fußball: erste Minute = 1′, Nachspielzeit „15+1′“, nächster Abschnitt beginnt fest (z. B. 16′)

## Entscheidungen des Trainers
- Positionshinweise ursprünglich verworfen, später Aufstellungsvorschlag ausdrücklich gewünscht
- Ranglisten ausdrücklich gewünscht (nur für den Trainer sichtbar)
- Testtag nur messen; Spaß-Abfrage entfernt
- Dribbling und Mut getrennt; Mut ohne Live-Kategorie
- Trainer/App/Mix als Auswahl (V29), Saison-Archiv gewünscht (V29)
- Name „TrainerRadar“, Adresse bleibt `/wacker/`
- Daten bleiben auf dem Gerät; nur fiktive Namen in Flyer, Handbuch und Repo

## Offene Ideen (noch nicht umgesetzt)
- Automatischer Hinweis kurz vor Spielende, wer unter dem Spielzeit-Ziel liegt
- Trainings-Anwesenheit, Gegner-Notizen (Ideen vom 08.11.2026; Wechselvorschlag, Saisonbericht und Sicherung nach Spielende sind seit V31 umgesetzt)
- Echte Synchronisierung mit dem Co-Trainer (bräuchte Server, Datenschutz klären)
- Saisonauswertung durch Claude aus der Sicherungsdatei

## Materialien
- Werbeflyer (1 Seite) und Benutzerhandbuch (5 Seiten) als PDF; Quellen in `materialien/`
