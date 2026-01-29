# Prompt Architect

## Beschreibung

Ein spezialisierter Skill, um hochtechnische und fotorealistische Prompts für das Produkt-Studio zu entwickeln.

## Wann verwenden

Wenn der Benutzer neue "Shot Templates" wünscht oder die Qualität der generierten Bilder verbessern möchte.

## Workflow

1. **Analyse der Anforderung:**
   - Welche Stimmung/Stil wird gewünscht? (z. B. "Sommer", "Luxus", "Minimalistisch")
   - Welche Kameraperspektive? (Frontal, 45°, Top-Down)

2. **Technische Konstruktion:**
   - Nutze IMMER folgende Parameter-Struktur:
     - **Subject:** "Professional product photography of [Product]..."
     - **Lighting:** "Soft studio lighting", "Hard rim light", "Natural sunlight", "Gobo shadows".
     - **Camera:** "85mm lens" (Portrait/Produkt), "f/8" (scharf), "Macro" (Details).
     - **Environment:** "On a podium", "Floating", "On a concrete surface".
3. **Template Formatierung:**
   - Gebe das Ergebnis kompatibel für `shot-templates.ts` aus.
   - Definiere dynamische Variablen in geschweiften Klammern, z. B. `{{material}}` oder `{{lighting}}`, wenn der Benutzer Flexibilität braucht.

## Beispiel

_User:_ "Ich brauche einen Shot am Strand."
_Agent:_

```json
{
  "title": "Sunny Beach Vibe",
  "prompt": "Professional product photography of sunglasses lying on white sand, bright natural sunlight casting sharp shadows, caribbean beach background blurred (bokeh), 50mm lens, f/2.8, hyperrealistic, 8k resolution, summer vibes",
  "variables": ["time of day", "sand type"]
}
```
