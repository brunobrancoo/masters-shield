D&D 5e App — Visual Design System

Purpose: This document defines the visual language for the entire D&D 5e application. A code agent should use this to configure globals.css, Tailwind theme extensions, and component-level styling across all pages. Every color, texture, and effect decision here is intentional — do not deviate without reason.

---

1. Foundation: CSS Custom Properties

All colors below must be defined as HSL values in globals.css under :root and .dark. The app defaults to dark mode — D&D is played in dimly-lit rooms, and screens glow. Light mode is secondary.

    /* globals.css */

    :root {
      /* ========== BASE PALETTE ========== */
      --bg-primary: 30 15% 10%;        /* Deep warm brown-black */
      --bg-secondary: 30 12% 14%;      /* Slightly lighter */
      --bg-surface: 30 10% 18%;        /* Card surfaces */
      --bg-elevated: 30 8% 22%;        /* Modals, popovers, hover states */
      --bg-inset: 30 15% 8%;           /* Sunken areas, input backgrounds */

      --text-primary: 40 30% 88%;      /* Warm off-white */
      --text-secondary: 35 15% 60%;    /* Muted, labels */
      --text-tertiary: 30 10% 42%;     /* Disabled, placeholder */

      --border-default: 30 12% 25%;
      --border-strong: 35 15% 35%;
      --border-subtle: 30 10% 18%;

      /* ========== ARCHETYPE PALETTES ========== */

      /* Arcane / Magic — purples and blues */
      --arcane-50: 270 60% 95%;
      --arcane-100: 270 55% 85%;
      --arcane-200: 270 50% 72%;
      --arcane-300: 270 55% 60%;
      --arcane-400: 270 60% 50%;
      --arcane-500: 270 65% 42%;
      --arcane-600: 270 65% 32%;
      --arcane-700: 270 55% 22%;
      --arcane-glow: 270 80% 65%;

      /* Divine / Healing — golds and warm whites */
      --divine-50: 45 80% 95%;
      --divine-100: 45 75% 85%;
      --divine-200: 45 70% 72%;
      --divine-300: 45 70% 60%;
      --divine-400: 45 75% 50%;
      --divine-500: 45 80% 42%;
      --divine-600: 45 70% 32%;
      --divine-700: 45 60% 22%;
      --divine-glow: 45 90% 60%;

      /* Martial / Fighter — steel, iron, blood reds */
      --martial-50: 0 20% 95%;
      --martial-100: 0 25% 82%;
      --martial-200: 0 35% 65%;
      --martial-300: 0 45% 52%;
      --martial-400: 0 55% 45%;
      --martial-500: 0 60% 38%;
      --martial-600: 0 50% 28%;
      --martial-700: 0 40% 18%;
      --martial-steel: 220 8% 55%;
      --martial-iron: 220 5% 40%;
      --martial-glow: 0 70% 55%;

      /* Dexterity / Rogue — teals, dark greens, shadow */
      --dex-50: 170 40% 92%;
      --dex-100: 170 35% 78%;
      --dex-200: 170 40% 60%;
      --dex-300: 170 50% 45%;
      --dex-400: 170 55% 35%;
      --dex-500: 170 50% 28%;
      --dex-600: 170 40% 20%;
      --dex-700: 170 35% 14%;
      --dex-shadow: 200 20% 12%;
      --dex-glow: 170 70% 50%;

      /* Nature / Druid — earthy greens, bark browns */
      --nature-50: 100 35% 92%;
      --nature-100: 100 35% 78%;
      --nature-200: 105 40% 60%;
      --nature-300: 110 45% 45%;
      --nature-400: 115 50% 35%;
      --nature-500: 120 40% 28%;
      --nature-600: 120 35% 20%;
      --nature-700: 120 30% 14%;
      --nature-bark: 30 40% 25%;
      --nature-moss: 90 30% 30%;
      --nature-glow: 100 60% 50%;

      /* Monster / Enemy — sickly greens, dark reds, charcoal */
      --monster-50: 0 30% 90%;
      --monster-100: 355 40% 70%;
      --monster-200: 350 50% 55%;
      --monster-300: 345 55% 42%;
      --monster-400: 340 50% 32%;
      --monster-500: 0 60% 25%;
      --monster-accent: 80 50% 45%;   /* Sickly yellow-green for poison etc */
      --monster-glow: 0 80% 45%;

      /* ========== SEMANTIC / GAME MECHANIC COLORS ========== */

      /* Buff — warm gold-green, empowering */
      --buff: 85 55% 55%;
      --buff-subtle: 85 30% 20%;
      --buff-text: 85 60% 75%;

      /* Debuff — sickly purple-red, oppressive */
      --debuff: 310 45% 45%;
      --debuff-subtle: 310 25% 18%;
      --debuff-text: 310 50% 70%;

      /* Healing */
      --healing: 140 50% 50%;
      --healing-subtle: 140 30% 18%;
      --healing-text: 140 55% 72%;

      /* Damage — bright red-orange */
      --damage: 10 80% 55%;
      --damage-subtle: 10 40% 18%;
      --damage-text: 10 80% 72%;

      /* Temporary / Shield — cool blue */
      --temp: 210 60% 55%;
      --temp-subtle: 210 30% 18%;
      --temp-text: 210 55% 72%;

      /* ========== DAMAGE TYPE COLORS ========== */
      --dmg-fire: 15 85% 50%;
      --dmg-cold: 200 70% 60%;
      --dmg-lightning: 55 90% 55%;
      --dmg-thunder: 250 40% 55%;
      --dmg-acid: 80 70% 45%;
      --dmg-poison: 100 50% 35%;
      --dmg-necrotic: 280 40% 30%;
      --dmg-radiant: 45 90% 65%;
      --dmg-psychic: 290 60% 60%;
      --dmg-force: 220 60% 55%;
      --dmg-bludgeoning: 30 10% 50%;
      --dmg-piercing: 220 8% 60%;
      --dmg-slashing: 0 15% 55%;

      /* ========== RARITY COLORS ========== */
      --rarity-common: 30 10% 60%;
      --rarity-uncommon: 120 45% 45%;
      --rarity-rare: 220 65% 55%;
      --rarity-very-rare: 270 60% 55%;
      --rarity-legendary: 40 85% 55%;
      --rarity-artifact: 350 70% 50%;

      /* ========== CONDITION COLORS ========== */
      --condition-blinded: 30 5% 35%;
      --condition-charmed: 330 60% 55%;
      --condition-frightened: 45 70% 45%;
      --condition-paralyzed: 55 60% 45%;
      --condition-poisoned: 100 50% 35%;
      --condition-stunned: 55 70% 55%;
      --condition-unconscious: 0 0% 25%;
      --condition-restrained: 25 50% 35%;
      --condition-invisible: 200 30% 65%;
      --condition-exhaustion: 20 40% 30%;

      /* ========== SPACING / SIZING ========== */
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-card: 6px;
    }

---

2. Tailwind Theme Extension

   // tailwind.config.ts — extend theme with the CSS vars above
   // Map each group to Tailwind utility classes.
   // e.g., `bg-arcane-500`, `text-buff`, `border-martial-steel`
   // The code agent should generate the full mapping from the vars above.

All archetype palettes (arcane, divine, martial, dex, nature, monster) must be available as bg-{name}-{weight}, text-{name}-{weight}, border-{name}-{weight}. Damage types as text-dmg-{type}, rarity as text-rarity-{level}, etc.

---

3. Class-to-Archetype Mapping

When rendering anything class-specific, use this mapping to pick the right palette:

Archetype Classes Accent Color Var
arcane Sorcerer, Wizard, Warlock, Artificer --arcane-400
divine Cleric, Paladin --divine-400
martial Fighter, Barbarian, Monk --martial-400
dex Rogue, Ranger --dex-400
nature Druid, Ranger (secondary) --nature-400
bard Bard (unique — blend of arcane + divine) Use --arcane-300 with --divine-400 accents
When a class is selected, derive a --class-accent variable and apply it to:

- Active tab indicators

- Section header underlines

- Spell slot fill color

- Ability check highlight borders

- HP bar fill gradient

  /_ Example: dynamically set on a parent element via JS _/
  [data-archetype="arcane"] {
  --class-accent: hsl(var(--arcane-400));
  --class-glow: hsl(var(--arcane-glow));
  --class-surface: hsl(var(--arcane-700));
  }

---

4. Textures & Backgrounds

4.1 Parchment Texture

Apply to card surfaces that represent "in-world" documents (character sheet, spell lists, inventory).

    .texture-parchment {
      background-color: hsl(var(--bg-surface));
      background-image:
        url('/textures/noise-soft.png');  /* 200x200 seamless noise tile */
      background-blend-mode: overlay;
      background-size: 200px 200px;
    }

Generate the noise texture as an inline SVG feTurbulence filter if you don't have a PNG:

    .texture-parchment::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      pointer-events: none;
      border-radius: inherit;
    }

4.2 Dark Leather Texture

Apply to the main page background / app shell. Subtle, dark, warm.

    .texture-leather {
      background-color: hsl(var(--bg-primary));
      background-image:
        radial-gradient(
          ellipse at 20% 50%,
          hsl(30 15% 13%) 0%,
          transparent 70%
        ),
        url('/textures/noise-hard.png');
      background-blend-mode: normal, overlay;
      background-size: cover, 150px 150px;
    }

4.3 Stone Texture

For monster stat blocks, dungeon-related UI, encounter trackers.

    .texture-stone {
      background-color: hsl(220 5% 18%);
      background-image: url('/textures/noise-soft.png');
      background-blend-mode: soft-light;
      background-size: 250px 250px;
    }

---

5. Glow & Effect Utilities

5.1 Magical Glow

Apply to elements representing active magic — concentration spells, magical items, spell slots that are filled.

    .glow-arcane {
      box-shadow:
        0 0 8px hsl(var(--arcane-glow) / 0.3),
        0 0 20px hsl(var(--arcane-glow) / 0.1);
    }

    .glow-divine {
      box-shadow:
        0 0 8px hsl(var(--divine-glow) / 0.3),
        0 0 20px hsl(var(--divine-glow) / 0.1);
    }

    .glow-nature {
      box-shadow:
        0 0 12px hsl(var(--nature-glow) / 0.25),
        0 0 24px hsl(var(--nature-glow) / 0.08);
    }

    .glow-danger {
      box-shadow:
        0 0 8px hsl(var(--monster-glow) / 0.4),
        0 0 20px hsl(var(--monster-glow) / 0.15);
    }

    /* Generic — inherits from --class-accent */
    .glow-class {
      box-shadow:
        0 0 8px hsl(var(--class-accent) / 0.3),
        0 0 20px hsl(var(--class-accent) / 0.1);
    }

5.2 Pulse Animation

For things requiring attention: low HP, death saves in progress, concentration checks.

    @keyframes pulse-danger {
      0%, 100% { box-shadow: 0 0 4px hsl(var(--damage) / 0.3); }
      50% { box-shadow: 0 0 16px hsl(var(--damage) / 0.6); }
    }

    @keyframes pulse-subtle {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }

    .pulse-danger {
      animation: pulse-danger 2s ease-in-out infinite;
    }

    .pulse-subtle {
      animation: pulse-subtle 3s ease-in-out infinite;
    }

5.3 HP Thresholds

HP bars and current HP displays must change color based on percentage:

Threshold Color Extra
100–76% --healing —
75–51% --divine-400 (warm yellow) —
50–26% 40 80% 50% (orange) —
25–1% --damage Apply pulse-danger
0% (unconscious) --condition-unconscious Desaturate the entire stat block
Temp HP present Render temp HP portion of bar with --temp Striped pattern overlay

    .hp-bar-segment-temp {
      background: repeating-linear-gradient(
        135deg,
        hsl(var(--temp)) 0px,
        hsl(var(--temp)) 4px,
        hsl(var(--temp) / 0.6) 4px,
        hsl(var(--temp) / 0.6) 8px
      );
    }

---

6. Typography

Font Stack

    :root {
      --font-heading: 'Cinzel', 'Georgia', serif;
      --font-body: 'Inter', 'system-ui', sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
      --font-handwritten: 'Caveat', cursive; /* for "in-character" notes */
    }

Install via next/font:

    // app/layout.tsx
    import { Inter } from "next/font/google";
    import { Cinzel } from "next/font/google";
    import { Caveat } from "next/font/google";

Usage Rules

Context Font Weight Size
Page titles, section headers --font-heading 700 text-xl to text-2xl
Card labels ("STRENGTH", "HIT DICE") --font-heading 600 text-[10px] uppercase tracking-widest
Body text, input values --font-body 400 text-sm
Numeric values (scores, HP, AC) --font-body 700 text-2xl to text-4xl
Stat modifiers (+2, -1) --font-mono 500 text-lg
Dice expressions (2d6+3) --font-mono 400 Inherit
Character backstory, notes (optional flavor) --font-handwritten 400 text-base

---

7. Component Styling Patterns

7.1 Cards

Three card tiers:

    /* Primary card — main content sections */
    .card-primary {
      @apply relative rounded-[var(--radius-card)] border overflow-hidden;
      background: hsl(var(--bg-surface));
      border-color: hsl(var(--border-default));
    }

    /* Inset card — nested within a primary card (e.g., ability score box) */
    .card-inset {
      @apply rounded-[var(--radius-sm)] border;
      background: hsl(var(--bg-inset));
      border-color: hsl(var(--border-subtle));
    }

    /* Elevated card — modals, floating panels, tooltips */
    .card-elevated {
      @apply rounded-[var(--radius-lg)] border shadow-xl;
      background: hsl(var(--bg-elevated));
      border-color: hsl(var(--border-strong));
      box-shadow:
        0 8px 32px hsl(0 0% 0% / 0.5),
        0 0 1px hsl(var(--border-strong));
    }

7.2 Section Headers

The PDF uses dark label banners. Replicate with:

    .section-label {
      @apply px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-center;
      font-family: var(--font-heading);
      background: hsl(var(--bg-inset));
      color: hsl(var(--text-secondary));
      border-bottom: 1px solid hsl(var(--border-default));
    }

7.3 Inputs

All form inputs across the app:

    .input-field {
      @apply bg-transparent border-0 border-b px-1 py-0.5 text-sm;
      border-color: hsl(var(--border-default));
      color: hsl(var(--text-primary));
      caret-color: hsl(var(--class-accent, var(--arcane-400)));
    }

    .input-field:focus {
      border-color: hsl(var(--border-strong));
      outline: none;
      box-shadow: 0 1px 0 hsl(var(--class-accent, var(--arcane-400)) / 0.5);
    }

    .input-field::placeholder {
      color: hsl(var(--text-tertiary));
    }

7.4 Checkboxes (Circle Style for D&D)

Death saves, spell slots, resource trackers — all use circle checkboxes, not square.

    .checkbox-circle {
      @apply w-4 h-4 rounded-full border-2 cursor-pointer transition-all duration-150;
      border-color: hsl(var(--border-strong));
      background: transparent;
    }

    .checkbox-circle[data-state="checked"] {
      background: hsl(var(--class-accent, var(--text-primary)));
      border-color: hsl(var(--class-accent, var(--text-primary)));
    }

    /* Death save success */
    .checkbox-circle.save-success[data-state="checked"] {
      background: hsl(var(--healing));
      border-color: hsl(var(--healing));
    }

    /* Death save failure */
    .checkbox-circle.save-failure[data-state="checked"] {
      background: hsl(var(--damage));
      border-color: hsl(var(--damage));
    }

    /* Spell slot — filled = available, empty = used */
    .checkbox-circle.spell-slot[data-state="checked"] {
      background: hsl(var(--arcane-400));
      border-color: hsl(var(--arcane-400));
      box-shadow: 0 0 6px hsl(var(--arcane-glow) / 0.3);
    }

7.5 Badges

For rarity, conditions, damage types:

    .badge-base {
      @apply inline-flex items-center px-2 py-0.5 rounded-full text-[10px]
             font-semibold uppercase tracking-wider border;
    }

    /* Apply dynamically: */
    /* <span class="badge-base badge-rarity-rare"> */
    .badge-rarity-common    { color: hsl(var(--rarity-common));    border-color: hsl(var(--rarity-common) / 0.3);    background: hsl(var(--rarity-common) / 0.1); }
    .badge-rarity-uncommon  { color: hsl(var(--rarity-uncommon));  border-color: hsl(var(--rarity-uncommon) / 0.3);  background: hsl(var(--rarity-uncommon) / 0.1); }
    .badge-rarity-rare      { color: hsl(var(--rarity-rare));      border-color: hsl(var(--rarity-rare) / 0.3);      background: hsl(var(--rarity-rare) / 0.1); }
    .badge-rarity-very-rare { color: hsl(var(--rarity-very-rare)); border-color: hsl(var(--rarity-very-rare) / 0.3); background: hsl(var(--rarity-very-rare) / 0.1); }
    .badge-rarity-legendary { color: hsl(var(--rarity-legendary)); border-color: hsl(var(--rarity-legendary) / 0.3); background: hsl(var(--rarity-legendary) / 0.1); }
    .badge-rarity-artifact  { color: hsl(var(--rarity-artifact));  border-color: hsl(var(--rarity-artifact) / 0.3);  background: hsl(var(--rarity-artifact) / 0.1); }

Same pattern for conditions and damage types — generate programmatically.

---

8. Page-Specific Guidelines

Character Sheet

- Use texture-parchment on the main card.

- Ability score boxes: card-inset with large centered number.

- Shield (AC): Use an actual SVG shield shape, not a rounded square. Fill with --bg-inset, stroke with --border-strong.

- Apply class-based --class-accent on the outer wrapper.

Combat / Encounter Tracker

- Monsters: texture-stone background, --monster-\* palette for borders and accents.

- Initiative order: Vertical list. Active creature has glow-class (or glow-danger for monsters) + slightly elevated.

- HP bars use the threshold system from Section 5.3.

- Condition badges on each creature using --condition-\* colors.

Spell Management

- Spell slot circles use checkbox-circle.spell-slot.

- Concentration spells get a subtle pulse-subtle border animation while active.

- Prepared spells: filled circle. Known but not prepared: empty circle. Both use archetype color.

- Spell school icons/labels should have a faint color coding:
  - Evocation: --dmg-fire

  - Necromancy: --dmg-necrotic

  - Abjuration: --temp

  - Transmutation: --nature-300

  - Divination: --divine-300

  - Enchantment: --condition-charmed

  - Illusion: --dex-300

  - Conjuration: --arcane-300

Inventory / Equipment

- Item rarity determines the left-border or badge color.

- Attunement slots: 3 circle checkboxes with glow-arcane when filled.

- Equipped items: slightly brighter card background.

- Weight tracking bar: same gradient logic as HP but using --text-secondary to --damage when over encumbrance.

Notes / Journal

- Use --font-handwritten for the content area (optional toggle).

- texture-parchment background.

- Minimal chrome — let the text breathe.

Dice Roller

- Dice results: large --font-mono numbers.

- Natural 20: --divine-glow burst animation + gold text.

- Natural 1: --monster-glow burst + red text.

- Advantage/disadvantage: show both rolls, dim the unused one to --text-tertiary.

---

9. Animations & Transitions

Global Defaults

    /* Apply to all interactive elements */
    * {
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Default transition duration for hover/focus states */
    :root {
      --transition-fast: 100ms;
      --transition-base: 150ms;
      --transition-slow: 300ms;
    }

Specific Animations

    /* Dice roll result entrance */
    @keyframes roll-in {
      0% { transform: scale(0.5) rotate(-180deg); opacity: 0; }
      60% { transform: scale(1.1) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    /* Nat 20 celebration */
    @keyframes crit-glow {
      0% { box-shadow: 0 0 0 hsl(var(--divine-glow) / 0); }
      50% { box-shadow: 0 0 40px hsl(var(--divine-glow) / 0.6); }
      100% { box-shadow: 0 0 8px hsl(var(--divine-glow) / 0.2); }
    }

    /* Damage flash on HP change */
    @keyframes damage-flash {
      0% { background-color: hsl(var(--damage) / 0.3); }
      100% { background-color: transparent; }
    }

    /* Healing flash */
    @keyframes heal-flash {
      0% { background-color: hsl(var(--healing) / 0.3); }
      100% { background-color: transparent; }
    }

    /* Level up / milestone */
    @keyframes level-up {
      0% { box-shadow: 0 0 0 hsl(var(--divine-glow) / 0); transform: scale(1); }
      30% { box-shadow: 0 0 30px hsl(var(--divine-glow) / 0.5); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 hsl(var(--divine-glow) / 0); transform: scale(1); }
    }

    .animate-roll-in   { animation: roll-in 0.5s ease-out; }
    .animate-crit       { animation: crit-glow 0.8s ease-out; }
    .animate-damage     { animation: damage-flash 0.4s ease-out; }
    .animate-heal       { animation: heal-flash 0.4s ease-out; }
    .animate-level-up   { animation: level-up 1.2s ease-out; }

---

10. Accessibility Rules

Even in a dark fantasy theme, accessibility is non-negotiable:

1. Contrast: All text must meet WCAG AA (4.5:1 for body, 3:1 for large text). The palettes above are designed for this — don't reduce opacity on text below 0.6.

2. Focus rings: Every interactive element needs a visible focus ring. Use --class-accent color with a 2px offset ring.

3. Motion: Respect prefers-reduced-motion. Wrap all animations:

   @media (prefers-reduced-motion: reduce) {
   _, _::before, \*::after {
   animation-duration: 0.01ms !important;
   transition-duration: 0.01ms !important;
   }
   }

4. Color alone: Never communicate information by color alone. Pair with icons, text labels, or patterns (e.g., HP bar also shows the number, conditions have text labels, not just colored dots).

---

11. Quick Reference — When To Use What

Scenario Palette Texture Glow/Effect
Sorcerer casts a spell arcane — glow-arcane
Cleric heals divine — animate-heal
Fighter attacks martial — animate-damage on target
Rogue uses stealth dex — Dim surrounding elements
Druid wild shapes nature — glow-nature
Monster stat block monster texture-stone —
Item (by rarity) rarity-_ — glow-arcane for magic items
Buff applied buff — pulse-subtle
Debuff/condition applied debuff / condition-_ — Badge + overlay
HP gained healing — animate-heal
HP lost damage — animate-damage
Temp HP temp Striped bar —
Low HP (<25%) damage — pulse-danger
Death saves healing / damage — pulse-danger on the section
Nat 20 divine-glow — animate-crit
Nat 1 monster-glow — animate-crit (red variant)
Spell concentration arcane-400 border — pulse-subtle
Inventory encumbered damage on weight bar — —
NPC/Companion card Same as class archetype of companion texture-parchment —

---

12. File Checklist for the Code Agent

1. globals.css — Paste all CSS custom properties, texture classes, glow utilities, animations, checkbox styles, and accessibility media queries from this document.

1. tailwind.config.ts — Extend theme.colors to map every --{group}-{weight} var. Extend fontFamily with heading/body/mono/handwritten. Extend animation and keyframes.

1. components/ui/ — Update shadcn component overrides to use the new vars (especially Card, Input, Badge, Checkbox, Button).

1. app/layout.tsx — Apply texture-leather to <body>, load fonts, set data-archetype attribute dynamically based on character class.

1. lib/theme.ts — Export the class-to-archetype mapping and a helper getArchetype(className: string): string so any component can look it up.

1. Scan every page/component — Replace any hardcoded colors (text-red-500, bg-gray-800, etc.) with the semantic vars defined here.
