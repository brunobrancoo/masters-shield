D&D 5e Character Sheet — Build Spec

Tech Stack

- Framework: Next.js (App Router)

- UI: React + shadcn/ui components + Tailwind CSS

- State: React Hook Form + Zod for validation

- Persistence: localStorage (read/write on change, hydrate on mount)

---

General Guidelines

- The entire sheet is an editable form. Every field is an input, textarea, or checkbox — not static text.

- Use shadcn Card, Input, Textarea, Checkbox, Label, Separator, and Badge as building blocks.

- The visual style should evoke a parchment/fantasy aesthetic: use a warm off-white background (bg-[#fdf6e3] or similar), dark borders, and a serif or semi-serif font (e.g., font-serif). Decorative corner flourishes are not required — keep it clean.

- Each of the 4 pages is its own route or tab. Use a Tabs component or top-level nav with routes: /sheet, /details, /spells, /companions.

- All number inputs should use type="number" with appropriate min/max.

- Responsive: desktop-first (target ~800–1000px width to mirror the paper sheet), but should scroll gracefully on mobile.

---

Data Model

Define a single TypeScript type for the entire character and store it as one JSON blob. Key shape:

    // types/character.ts

    export interface Character {
      // Page 1 — Core
      name: string;
      classAndLevel: string;
      background: string;
      playerName: string;
      race: string;
      alignment: string;
      experiencePoints: string;

      inspiration: boolean;
      proficiencyBonus: number;
      passivePerception: number;

      abilities: {
        [key in AbilityKey]: {
          score: number;
          modifier: number; // derived, but store for convenience
          savingThrowProficient: boolean;
          savingThrowValue: number;
        };
      };

      skills: {
        [key in SkillKey]: {
          proficient: boolean;
          value: number;
        };
      };

      armorClass: number;
      initiative: number;
      speed: string;
      maxHitPoints: number;
      currentHitPoints: number;
      tempHitPoints: number;
      hitDice: string; // e.g. "11d6"
      hitDiceCurrent: string;
      deathSaves: {
        successes: [boolean, boolean, boolean];
        failures: [boolean, boolean, boolean];
      };

      conditions: string;
      boons: string;

      attacks: {
        name: string;
        atkBonus: string;
        damageType: string;
      }[];

      attacksNotes: string; // free-text area below the table

      classResources: string; // free-text

      currency: {
        cp: number;
        sp: number;
        ep: number;
        gp: number;
        pp: number;
      };

      currentWeight: string;
      maxWeight: string;
      equipment: string;
      equipmentCont: string;

      personalityTraits: string;
      ideals: string;
      bonds: string;
      flaws: string;
      proficienciesAndLanguages: string;
      featuresAndTraits: string;

      // Page 2 — Details
      age: string;
      height: string;
      weight: string;
      eyes: string;
      skin: string;
      hair: string;
      characterAppearance: string;
      alliesAndOrganizations: string;
      alliesOrgName: string;
      alliesOrgSymbol: string; // URL or text
      backstory: string;
      additionalFeaturesAndTraits: string;
      other: string;

      // Page 3 — Spellcasting
      spellcasting: {
        classAbility: string;
        preparedSpellsTotal: number;
        spellSaveDC: number;
        spellAttackBonus: number;
        cantrips: string[]; // list of spell names
        spellLevels: {
          [level: number]: {
            slotsTotal: number;
            slotsRemaining: boolean[]; // array of 6 checkboxes
            spells: {
              prepared: boolean;
              name: string;
            }[];
          };
        };
      };

      // Page 4 — Companions
      companions: Companion[];
    }

    export interface Companion {
      name: string;
      classAndLevel: string;
      race: string;
      relationship: string;
      role: string;
      alignment: string;
      experiencePoints: string;

      abilities: {
        [key in AbilityKey]: {
          score: number;
          modifier: number;
        };
      };

      passivePerception: number;
      currentWeight: string;
      maxWeight: string;

      armorClass: number;
      initiative: number;
      speed: string;
      maxHitPoints: number;
      currentHitPoints: number;
      tempHitPoints: number;
      hitDice: string;
      hitDiceCurrent: string;
      deathSaves: {
        successes: [boolean, boolean, boolean];
        failures: [boolean, boolean, boolean];
      };

      conditions: string;
      boons: string;

      attacks: {
        name: string;
        atkBonus: string;
        damageType: string;
      }[];

      attacksNotes: string;
      classResources: string;
      proficienciesLanguagesFeaturesTraits: string;

      currency: {
        cp: number;
        sp: number;
        ep: number;
        gp: number;
        pp: number;
      };

      equipment: string;
    }

    export type AbilityKey =
      | "strength"
      | "dexterity"
      | "constitution"
      | "intelligence"
      | "wisdom"
      | "charisma";

    export type SkillKey =
      | "acrobatics"
      | "animalHandling"
      | "arcana"
      | "athletics"
      | "deception"
      | "history"
      | "insight"
      | "intimidation"
      | "investigation"
      | "medicine"
      | "nature"
      | "perception"
      | "performance"
      | "persuasion"
      | "religion"
      | "sleightOfHand"
      | "stealth"
      | "survival";

---

Page 1 — Main Character Sheet (/sheet)

Layout: 3-column grid

    ┌──────────────────────────────────────────────────────┐
    │  CHARACTER NAME  │ CLASS & LEVEL │ BACKGROUND │ PLAYER│
    │                  │ RACE          │ ALIGNMENT  │ XP    │
    ├──────────┬───────────────────────┬───────────────────┤
    │ LEFT COL │      CENTER COL       │    RIGHT COL      │
    │ (narrow) │      (wide)           │    (medium)       │
    └──────────┴───────────────────────┴───────────────────┘

Use grid grid-cols-[240px_1fr_280px] gap-4.

Header Bar

- A row of Input fields with Label underneath each (like the PDF).

- Fields: Character Name (wide), Class & Level, Background, Player Name.

- Second row: Race, Alignment, Experience Points.

- Use shadcn Input with variant="ghost" styling — underline-only border to mimic the PDF fields.

Left Column

Ability Score Block (×6: STR, DEX, CON, INT, WIS, CHA)

Each is a Card containing:

1. Score — large centered Input[type=number] (the big number, e.g. 12).

2. Modifier — smaller centered Input[type=number] below (e.g. 1). Auto-derived from score as Math.floor((score - 10) / 2), but editable to allow override.

3. Label — ability name below (e.g. "STRENGTH") in uppercase small text.

To the right of each ability block, display:

- Saving Throw: Checkbox (proficient) + Input[type=number] (value) + label "SAVING THROW".

- Skills (varies per ability):
  - STR: Athletics

  - DEX: Acrobatics, Sleight of Hand, Stealth

  - CON: (none)

  - INT: Arcana, History, Investigation, Nature, Religion

  - WIS: Animal Handling, Insight, Medicine, Perception, Survival

  - CHA: Deception, Intimidation, Performance, Persuasion

Each skill row: Checkbox (proficiency) + Input[type=number] (bonus) + label.

Component: <AbilityBlock ability={...} skills={[...]} />

Below the 6 ability blocks

- Proficiency Bonus: Boxed Input[type=number] + label.

- Passive Wisdom (Perception): Boxed Input[type=number] + label (styled with dark background label like the PDF).

- Current Weight / Max Weight: Two small inputs side by side.

Currency Stack

Vertical stack of 5 labeled Input[type=number] fields:

- CP, SP, EP, GP, PP

- Each with a small round/shield badge label to the left.

Center Column

Top Row (flex row, centered)

- Armor Class: Shield-shaped Card with large Input[type=number] centered. Label "ARMOR CLASS".

- Conditions / Boons: Two small Input fields flanking the shield or below it.

Second Row (flex row)

- Initiative: Input[type=number] with label.

- Temp HP: Input[type=number] with label.

- Speed: Input with label.

Hit Points Section

- Current Hit Points: Large Input[type=number].

- Maximum Hit Points: Input[type=number] (smaller, adjacent or below).

Hit Dice & Death Saves Row

- Hit Dice: Label "HIT DICE", Input for current (e.g. 11d6).

- Death Saves: Two rows of 3 Checkbox each — "SUCCESSES" and "FAILURES". Use shadcn Checkbox.

Attacks & Spellcasting

- A 3-column table header: NAME | ATK BONUS | DAMAGE/TYPE.

- 3 editable rows using Input fields.

- Below: Textarea for free-form notes (where the sample data shows "Dragon touched focus…", "Bloodwell vial…", "Dragoa Saphira").

Component: <AttacksTable />

Class Resources, Ammo & Charges

- A row of ~10 Checkbox circles (inventory tracking checkboxes, styled as empty circles).

- Repeat for ~4–5 rows.

- Below: Textarea for free-form resource notes.

Right Column

Each section is a Card with a label header and a Textarea inside:

1. Inspiration: Checkbox.

2. Personality Traits: Textarea.

3. Ideals: Textarea.

4. Bonds: Textarea.

5. Flaws: Textarea.

6. Proficiencies & Languages: Textarea.

7. Features & Traits: Textarea.

Bottom Row (full width, 2 columns)

- Equipment: Textarea.

- Equipment Cont.: Textarea.

---

Page 2 — Character Details (/details)

Layout: 2-column

    ┌──────────────────────────────────────────────────────┐
    │  CHARACTER NAME  │ AGE │ HEIGHT │ WEIGHT              │
    │                  │ EYES│ SKIN   │ HAIR                │
    ├──────────────────────────┬───────────────────────────┤
    │ CHARACTER APPEARANCE     │ ALLIES & ORGANIZATIONS    │
    │ (tall textarea/image)    │  ┌─ NAME ──────────────┐  │
    │                          │  │ (textarea)           │  │
    │                          │  ├─ SYMBOL ─────────────┤  │
    │                          │  │ (image/upload area)  │  │
    │                          │  └──────────────────────┘  │
    ├──────────────────────────┼───────────────────────────┤
    │ CHARACTER BACKSTORY      │ ADDITIONAL FEATURES &     │
    │ (tall textarea)          │ TRAITS (textarea)         │
    │                          ├───────────────────────────┤
    │                          │ OTHER (textarea)          │
    └──────────────────────────┴───────────────────────────┘

- Use grid grid-cols-2 gap-4.

- Each section: Card with Label header + Textarea.

- Character Appearance can include an optional image upload area (stretch goal — Textarea is fine for v1).

---

Page 3 — Spellcasting (/spells)

Header Row

- Spellcasting Class/Ability: Input.

- Prepared Spells Total: Input[type=number].

- Spell Save DC: Input[type=number].

- Spell Attack Bonus: Input[type=number].

Layout: 3-column grid

    ┌─────────────────┬─────────────────┬─────────────────┐
    │ CANTRIPS (0)    │ Level 3         │ Level 6         │
    │ Level 1         │ Level 4         │ Level 7         │
    │ Level 2         │ Level 5         │ Level 8         │
    │                 │                 │ Level 9         │
    └─────────────────┴─────────────────┴─────────────────┘

Use grid grid-cols-3 gap-4.

Cantrips Section (Level 0)

- Header: badge with "0" + label "CANTRIPS".

- List of ~8 Input fields (spell name), no prepared checkbox, no slots.

Spell Level Block (Levels 1–9)

Each is a Card:

1. Header row: Level badge (number in dark box) + Input[type=number] for Slots Total + 6 Checkbox (circles) for Slots Remaining.

2. Spell list: ~13 rows per level, each row is:
   - Checkbox (circle, indicates prepared) + Input (spell name).

Component: <SpellLevelBlock level={n} />

---

Page 4 — Companions (/companions)

Layout

Up to 2 companion stat blocks stacked vertically (or side-by-side on very wide screens). Each is essentially a mini character sheet.

Companion Stat Block

Use a Card with a header banner "COMPANIONS, FAMILIARS, AND PETS."

Header Row

- Name: Input.

- Class & Level: Input.

- Relationship: Input.

- Role: Input.

- Race: Input.

- Alignment: Input.

- Experience Points: Input.

Body: 2-column grid inside the card

Left sub-column:

- 6 Ability blocks (simplified — just Score + Modifier, no skills, no saving throws).
  - 2 abilities per row: [STR | DEX], [CON | INT], [WIS | CHA].

- Passive Wisdom (Perception): Input[type=number].

- Current Weight / Max Weight: Two small inputs.

Right sub-column:

- Attacks & Spellcasting: Header "NAME | ATK BONUS | DAMAGE/TYPE", 3 Input rows + Textarea for notes.

- Armor Class (shield badge) + Conditions / Boons inputs.

- Temp HP, Initiative, Speed inputs row.

- Hit Dice + Current/Maximum HP inputs.

- Death Saves: 3 success + 3 failure checkboxes.

- Class Resources, Ammo & Charges: Checkbox rows + Textarea.

- Proficiencies & Languages / Features & Traits: Textarea.

- Currency: CP, SP, EP, GP, PP vertical stack.

- Equipment: Textarea.

Add/Remove Companion

- Button: + Add Companion (max 2).

- Each companion card has a × Remove button.

---

Component Tree

    app/
    ├── layout.tsx              // Shell, nav tabs, serif font
    ├── sheet/
    │   └── page.tsx            // Page 1
    ├── details/
    │   └── page.tsx            // Page 2
    ├── spells/
    │   └── page.tsx            // Page 3
    └── companions/
        └── page.tsx            // Page 4

    components/
    ├── character-sheet/
    │   ├── header-bar.tsx          // Name, class, race, etc.
    │   ├── ability-block.tsx       // Single ability + skills
    │   ├── ability-column.tsx      // All 6 abilities stacked
    │   ├── combat-stats.tsx        // AC, initiative, speed, HP, death saves
    │   ├── attacks-table.tsx       // Attack rows + notes textarea
    │   ├── resource-tracker.tsx    // Rows of circle checkboxes
    │   ├── currency-stack.tsx      // CP/SP/EP/GP/PP
    │   ├── personality-column.tsx  // Traits/ideals/bonds/flaws/proficiencies/features
    │   └── equipment-section.tsx   // Equipment textareas
    ├── details/
    │   ├── appearance-section.tsx
    │   ├── allies-section.tsx
    │   ├── backstory-section.tsx
    │   └── other-section.tsx
    ├── spells/
    │   ├── spell-header.tsx
    │   ├── cantrips-block.tsx
    │   └── spell-level-block.tsx
    ├── companions/
    │   └── companion-card.tsx      // Full mini stat block
    └── shared/
        ├── labeled-input.tsx       // Input with underline + label below
        ├── labeled-textarea.tsx    // Textarea with header label
        ├── shield-badge.tsx        // AC shield-shaped display
        ├── death-saves.tsx         // 3+3 checkboxes
        └── circle-checkbox.tsx     // Styled as empty/filled circle

    hooks/
    └── use-character.ts            // localStorage persistence + form state

    lib/
    ├── constants.ts                // Skill-to-ability mapping, defaults
    └── utils.ts                    // Modifier calc, etc.

---

Styling Notes

Element Style
Page background bg-[#fdf6e3] (warm parchment)
Card borders border-2 border-stone-800 rounded-md
Section labels text-[10px] uppercase tracking-widest font-bold text-center — mimics the PDF label style
Input fields Underline-only: border-0 border-b border-stone-400 rounded-none bg-transparent focus:border-stone-800
Ability score box w-16 h-16 text-2xl font-bold text-center border-2 border-stone-800 rounded-lg
Modifier box w-12 h-10 text-lg text-center nested below score
Shield (AC) Clip-path or SVG-shaped div, w-20 h-24, centered number
Circle checkboxes w-4 h-4 rounded-full border-2 border-stone-700 — filled when checked
Death save circles Same circle style, 3 per row
Dark label banners bg-stone-800 text-white text-[10px] uppercase px-2 py-0.5 rounded-sm (like "PASSIVE WISDOM (PERCEPTION)", "DEATH SAVES", "HIT DICE")

---

Behavior

1. Auto-save: Debounce 500ms, write entire character object to localStorage key "dnd-character".

2. Auto-derive modifier: When ability score changes, auto-compute Math.floor((score - 10) / 2) and fill modifier. User can still override.

3. Tab navigation: Tabs at top — "Sheet", "Details", "Spells", "Companions". Use shadcn Tabs or Next.js route-based nav with active styling.

4. Export/Import: Add a small toolbar with "Export JSON" and "Import JSON" buttons for backup. Stretch: "Export PDF" using react-pdf.

5. Reset: "New Character" button with confirmation dialog (shadcn AlertDialog).

---

Build Order

1. Types + localStorage hook + constants.

2. Shared components (labeled-input, circle-checkbox, death-saves, shield-badge, etc.).

3. Page 1 — Main sheet (this is the biggest page, build column by column).

4. Page 3 — Spells (repetitive structure, fast to build).

5. Page 2 — Details (mostly textareas).

6. Page 4 — Companions (reuses many Page 1 components).

7. Polish: styling pass, responsive tweaks, export/import.
