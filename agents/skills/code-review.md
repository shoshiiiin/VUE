# Code Review Expert

## Beschreibung

Führt ein umfassendes Code-Review durch, basierend auf Projektstandards und automatisierter Validierung [7].

## Workflow

1. **Validierung (WICHTIG):**
   - Führe zuerst alle Linting-Skripte und Type-Checks aus (z. B. `npm run lint` oder `pnpm validate`) [7].
   - Wenn der Check fehlschlägt, brich ab oder melde die Fehler zuerst.

2. **Kontextualisierung:**
   - Lies die Datei `agents.md` (oder `CONTRIBUTING.md`), um die aktuellen Coding-Guidelines zu verstehen [7].
   - _Hinweis:_ Referenziere spezifische Sektionen der `agents.md`, um Token zu sparen (z. B. Sektion "Naming Conventions") [8].

3. **Analyse:**
   - Analysiere die Änderungen mittels `diff`.
   - Prüfe auf "Drift" (Abweichungen) zwischen Dokumentation und Implementierung [10].

4. **Bericht:**
   - Erstelle einen Bericht mit folgenden Sektionen:
     - ✅ Status der automatischen Tests (muss grün sein) [9].
     - 📋 Zusammenfassung der Änderungen.
     - ⚠️ Kritische Probleme & Architektur-Integrität.
     - 💡 Verbesserungsvorschläge.
