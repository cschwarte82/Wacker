# Materialien für Flyer und Handbuch

- `werbeflyer.html`, `handbuch.html`, `common.css` – Quellen der PDFs
- `shots2.py` – erzeugt die Screenshots mit fiktiven Demodaten (`demo.json`) aus `../index.html` (benötigt Google Chrome + Pillow)
- PDF erzeugen: `google-chrome --headless=new --no-pdf-header-footer --print-to-pdf=Handbuch.pdf handbuch.html`
- Das Handbuch-PDF wird als `../TrainerRadar-Anleitung.pdf` in die App gelegt (Einstellungen → Anleitung).

Die Demodaten enthalten nur erfundene Namen – niemals echte Kinderdaten hier ablegen.
