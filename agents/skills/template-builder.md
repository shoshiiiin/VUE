# Template Builder

## Beschreibung

Führt den Agenten durch den Prozess, neue Shot-Templates korrekt in die Codebasis (`src/lib/shot-templates.ts`) zu integrieren.

## Wann verwenden

Wenn der Benutzer "Füge ein neues Template hinzu" sagt oder der _Prompt Architect_ einen fertigen Prompt geliefert hat.

## Workflow

1. **Daten-Sammlung:**
   - **ID:** Generiere eine eindeutige ID (z. B. `summer-vibe-01`).
   - **Title:** Ein kurzer, prägnanter Name.
   - **Ratio:** Üblicherweise "16:9" oder "4:3".
   - **Prompt:** Der technische Text vom _Prompt Architect_.

2. **Code Integration:**
   - Öffne `src/lib/shot-templates.ts`.
   - Füge das neue Objekt in das `SHOT_TEMPLATES` Array ein.
   - Achte auf korrekte TypeScript-Typisierung.

3. **Placeholder Handling:**
   - Da wir meist kein echtes Vorschaubild haben, nutze `https://placehold.co/600x400/png?text=TemplateName` als Platzhalter für `previewImage`.
   - Weise den Benutzer darauf hin, dass er später ein echtes Bild hochladen sollte.

## Qualitäts-Check

- [ ] Ist die ID einzigartig?
- [ ] Sind alle Pflichtfelder befüllt?
- [ ] Wurden die Variablen im UI (`variables` Array) korrekt definiert?
