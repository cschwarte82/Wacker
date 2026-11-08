# TrainerRadar – Projektübersicht (Stand: Version 28, 08.11.2026)

Diese Datei ist das Gedächtnis des Projekts. Sie fasst zusammen, was gebaut wurde und warum.
**Maßgeblich ist immer der Code im Repository** – bei Widersprüchen gilt der Code, nicht diese Datei.

## Eckdaten
- **App:** TrainerRadar – Web-App (PWA) für Kinderfußball-Trainer, entstanden für die U10 von Wacker Mecklenbeck
- **Adresse:** https://cschwarte82.github.io/wacker/ (bleibt so, QR-Code im Flyer zeigt dorthin)
- **Repository:** github.com/cschwarte82/wacker (öffentlich, GitHub Pages aus Branch `main`, Wurzelverzeichnis)
- **Claude-Zugriff:** Die Claude-GitHub-App ist für das Repo „Wacker“ freigegeben (Schreibrechte)
- **Zielgerät:** hauptsächlich iPhone, als App auf dem Home-Bildschirm

## Technik
- Alles in **einer Datei `index.html`** (HTML, CSS, JavaScript ohne Framework)
- `sw.js`: Service Worker, Cache zuerst + Aktualisierung im Hintergrund; bei neuer Version lädt sich die App einmal selbst neu
- `manifest.webmanifest`, Icons (`icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`)
- `jspdf.min.js` (jsPDF 2.5.2) für die Spielerprofil-PDFs, wird erst bei Bedarf geladen
- `TrainerRadar-Anleitung.pdf`: Benutzerhandbuch, in den Einstellungen verlinkt
- `materialien/`: Quellen für Flyer und Handbuch, Screenshot-Skript, fiktive Demodaten

### Daten (nur lokal auf dem Gerät, localStorage)
- Schlüssel `u10-leistungsprofil-v2`: `{current, teams:{id:{name, players, sessions, lu, cfg, live}}}`
- Schlüssel `u10-meta-v1`: `{lastBackup, lastChange, seenVersion}`
- Älterer Schlüssel `u10-leistungsprofil-v1` wird beim Start einmalig in Team „U10“ übernommen
- **Bewertungsarten** (`sessions`, Feld `type`): ohne type = Testtag (nur Messwerte), `eval` = Trainereinschätzung, `game` = Spiel (mit `live`-Daten aus der Live-Erfassung)
- **Live-Spiel** im Team gespeichert (`live`): Positionen, Bank, Uhr, Plus/Minus, Aktionen mit Kategorie, Tore, Karten, Wechsel-Log, Einsatzzeiträume, Spielzeit-Einteilung
- Sicherung: JSON-Datei über Teilen-Menü; Einlesen ergänzt nur (nichts wird gelöscht)
- Es gibt **keine Cloud/Synchronisierung** – Co-Trainer tauschen Sicherungsdateien aus

### Pflicht bei jeder Änderung (Ablauf)
1. Änderung in `index.html`
2. `APP_VERSION` erhöhen und Cache-Namen in `sw.js` (`u10-profil-vXX`) angleichen
3. Eintrag in `CHANGELOG` (Was-ist-neu-Fenster) ergänzen
4. Kurzanleitung `GUIDE` in `index.html` anpassen, falls Bedienung betroffen
5. Handbuch (`materialien/handbuch.html`) aktualisieren, PDF neu erzeugen und als `TrainerRadar-Anleitung.pdf` ablegen
6. Testen (Syntax-Check, Ablauf-Tests mit jsdom, Screenshots mit headless Chrome in iPhone-Größe 375 px), dann committen und pushen
7. Achtung CSS: keine generischen Klassennamen doppelt vergeben (Fehler in V27: `.dot` kollidierte mit `ul.dot`)

## Funktionen (Reiter)
- **Bewertung:** „+ Spiel“, „+ Testtag“ (nur messen, 14 Tests mit Anleitung + Stoppuhr), „+ Trainereinschätzung“; Trainingsschwerpunkte-Karte; im Spiel Reiter Bewertung, Verlauf, Aktionen, Export
- **Aufstellung:** 4+1/5+1/6+1, Formationen, „Stärkste“/„Ausgewogen“, Torwart fest oder automatisch, per Antippen anpassbar (bleibt gespeichert), Spielzeit-Einteilung, „▶ Live mit dieser Aufstellung“
- **Live:** Uhr mit Halbzeiten/Vierteln und Nachspielzeit, Plus/Minus mit Kategorie (5 s), Tor zählt sofort + Torschütze (7 s), Gegentor, Gelb/Gelb-Rot/Rot, Wechsel und Positionstausch per Antippen, wieder einwechseln mit addierten Einsätzen, Spielzeit-Ampel (33/50/66 %), Spielverlauf, ↶ Zurück für alle Aktionen
- **Ranglisten:** Bestwerte/Fortschritt je Test, Bereich, Einschätzung, Torwart, Tore, Tor-Bilanz auf dem Feld; „Aktuell vorne je Bereich“
- **Kader:** Spieler, Profil (Stärkenprofil-Radar, Messwerte, Trainer vs. App, Live-Bilanz, Entwicklungsziele), Stärkenkarte fürs Kind, Datensicherung
- **Einstellungen (⚙︎):** Spielerprofile als PDF, Anleitung (PDF + Kurzfassung), Was ist neu, Datensicherung, Versionsnummer
- **Mehrere Mannschaften** über das Feld „U10 ▾“ im Kopf

## Bewertungslogik
- Einschätzung 1–5: Spielverständnis, Freilaufen, Zweikampf, Passspiel, Dribbling, Übersicht, Mut, Kommunikation; Athletik (Schnelligkeit, Dynamik, Ausdauer) **nur in der Trainereinschätzung**; Torwart-Kategorien optional
- Es zählt der Schnitt der letzten 3 Bewertungen je Kind; Testwerte relativ zum Teamschnitt (3 = Schnitt)
- App-Wert aus Live-Aktionen der letzten 8 Spiele: 3 + 2 × (Plus − Minus) / (Plus + Minus + 4); Abweichung Trainer vs. App wird ab 5 Aktionen markiert
- Spielminuten wie im Fußball: erste Minute = 1′, Nachspielzeit „15+1′“, nächster Abschnitt beginnt fest (z. B. 16′)

## Entscheidungen des Trainers
- Positionshinweise ursprünglich verworfen, später Aufstellungsvorschlag ausdrücklich gewünscht
- Ranglisten ausdrücklich gewünscht (nur für den Trainer sichtbar)
- Testtag nur messen; Spaß-Abfrage entfernt
- Dribbling und Mut getrennt; Mut ohne Live-Kategorie
- Name „TrainerRadar“, Adresse bleibt `/wacker/`
- Daten bleiben auf dem Gerät; nur fiktive Namen in Flyer, Handbuch und Repo

## Offene Ideen (noch nicht umgesetzt)
- Aufstellung und Ranglisten wahlweise mit **Trainer-, App- oder Mischwerten** rechnen – sobald genug Live-Daten vorliegen
- Automatischer Hinweis kurz vor Spielende, wer unter dem Spielzeit-Ziel liegt
- Archiv-Funktion für alte Saisons (Speicherplatz)
- Echte Synchronisierung mit dem Co-Trainer (bräuchte Server, Datenschutz klären)
- Saisonauswertung durch Claude aus der Sicherungsdatei

## Materialien
- Werbeflyer (1 Seite) und Benutzerhandbuch (5 Seiten) als PDF; Quellen in `materialien/`
