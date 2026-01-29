# Glass UI Designer

## Beschreibung

Stellt sicher, dass alle neuen UI-Komponenten dem projekt-spezifischen Glassmorphism-Designsystem folgen.

## Wann verwenden

Wenn der Benutzer neue UI-Elemente, Karten, Modals oder Buttons anfordert.

## Design Regeln (Style Guide)

### 1. Container & Karten

Nutze IMMER die vordefinierten Klassen statt "rohem" Tailwind:

- `glass-panel`: Für Header, Sidebars oder große Container.
- `glass-card`: Für abgrenzbare Inhaltsbereiche (Cards).
- `app-canvas`: Für den Haupthintergrund.

### 2. Farben & Variablen

Nutze CSS-Variablen für Konsistenz:

- Hintergrund: `bg-[var(--surface-1)]` bis `bg-[var(--surface-3)]`.
- Text: `text-[var(--text-strong)]` (Headlines) oder `text-[var(--text-muted)]` (Labels).
- Akzent: `text-accent-500` oder `bg-accent-500`.

### 3. Interaktionen

- Buttons müssen Hover-States haben (`hover:scale-[1.02]`, `active:scale-[0.98]`).
- Nutze `framer-motion` für Einblendungen (`AnimatePresence`).

### 4. Icons

- Nutze `lucide-react`.
- Icons sollten oft einen leichten Hintergrund haben (`bg-accent-500/10 p-2 rounded-full`).

## Anti-Patterns (Vermeiden!)

- ❌ Harte Schatten (`shadow-xl`) -> Nutze `shadow-[var(--shadow-elev-1)]`.
- ❌ Reines Schwarz/Weiß -> Nutze Variablen.
- ❌ Standard HTML Borders -> Nutze `border-[var(--border)]`.

## Beispiel Code

```tsx
<Card className="glass-card hover:border-accent-500/50 transition-colors">
  <CardHeader>
    <CardTitle className="text-[var(--text-strong)] flex items-center gap-2">
      <Sparkles className="text-accent-500" />
      Premium Feature
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-[var(--text-muted)]">Content goes here...</p>
  </CardContent>
</Card>
```
