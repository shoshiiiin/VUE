# Troubleshooting Expert

## Beschreibung

Ein Skill zur systematischen Analyse und Behebung von Laufzeitfehlern und Bugs.

## Wann verwenden

Wenn der Benutzer sagt: "Fix diesen Bug" oder "Es funktioniert nicht" [8].

## Workflow

1. **Fehleranalyse:**
   - Identifiziere den Fehlertyp (Exception, Logic Error, State Issue).
   - Prüfe, ob Fehler "gracefully" abgefangen werden (Result Types, Error Propagation) [9].

2. **Isolierung:**
   - Erstelle (wenn möglich) einen minimalen Reproduktions-Case oder ein Test-Skript.

3. **Lösung:**
   - Wende Best Practices für die spezifische Sprache an (z. B. Try/Catch in JS/TS nur dort, wo nötig).
   - Stelle sicher, dass der Fix keine neuen Regressionen verursacht.
