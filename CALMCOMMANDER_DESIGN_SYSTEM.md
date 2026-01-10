# CalmCommander Design System
## For Neurodivergent Professionals

*A sensory-friendly, low-overwhelm interface designed for executive function support*

---

## Design Philosophy

CalmCommander serves high-level neurodivergent professionals who need **clarity without chaos**. Every design decision should answer: *"Does this reduce cognitive load?"*

### Core Principles

1. **Calm over flashy** — No competing for attention
2. **Predictable over surprising** — Same patterns everywhere
3. **Spacious over cramped** — Room to breathe
4. **Clear over clever** — Obvious beats impressive
5. **Forgiving over punishing** — Easy to undo, hard to break

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Calm** | `#5B4B8A` | Primary buttons, headers, key actions |
| **Soft Lavender** | `#8B7BB5` | Secondary elements, hover states |
| **Whisper Purple** | `#E8E4F0` | Backgrounds, cards |
| **Cloud White** | `#FAFAFA` | Page background |
| **Pure White** | `#FFFFFF` | Card backgrounds, inputs |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Gentle Green** | `#6B9B7A` | Success, completed tasks, positive feedback |
| **Soft Amber** | `#C4A35A` | Warnings, "soon" tasks, medium priority |
| **Muted Coral** | `#C27B7B` | Errors, crisis mode, high priority (never bright red) |
| **Calm Blue** | `#6B8B9B` | Information, links, neutral actions |

### Energy Level Colors

| Level | Hex | Usage |
|-------|-----|-------|
| **Low Energy** | `#A8D5BA` | Soft sage green — gentle, achievable |
| **Medium Energy** | `#F5D89A` | Warm honey — moderate effort |
| **High Energy** | `#E8B4B4` | Dusty rose — significant effort |

### Spoon Indicators

| State | Hex | Usage |
|-------|-----|-------|
| **Full Spoon** | `#6B9B7A` | Available capacity |
| **Used Spoon** | `#D4D4D4` | Spent capacity |
| **Debt Spoon** | `#C27B7B` | Over capacity (muted, not alarming) |

### Dark Mode (Optional Future)

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Night** | `#1A1625` | Background |
| **Soft Dark** | `#2D2640` | Cards |
| **Muted Lavender** | `#9B8BC4` | Text |
| **Cream** | `#F0EDE5` | Primary text |

---

## Typography

### Font Stack

```css
/* Primary Font - Clean, readable, slightly warm */
font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;

/* Alternative for dyslexia-friendly option (user toggle) */
font-family: 'Atkinson Hyperlegible', 'Inter', sans-serif;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display** | 32px / 2rem | 600 | 1.2 | Page titles only |
| **H1** | 24px / 1.5rem | 600 | 1.3 | Section headers |
| **H2** | 20px / 1.25rem | 500 | 1.3 | Card titles |
| **H3** | 16px / 1rem | 500 | 1.4 | Subsections |
| **Body** | 16px / 1rem | 400 | 1.6 | Main content |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | Secondary info |
| **Caption** | 12px / 0.75rem | 400 | 1.4 | Timestamps, hints |
| **Button** | 14px / 0.875rem | 500 | 1 | All buttons |

### Typography Rules

1. **Never use font-weight below 400** — thin fonts strain ND brains
2. **Minimum 16px for body text** — smaller is harder to track
3. **Line height 1.5+ for paragraphs** — breathing room between lines
4. **Maximum 65 characters per line** — prevents eye fatigue
5. **Left-align text** — centered text is harder to scan
6. **No all-caps except single words** — harder to read

---

## Spacing System

### Base Unit: 8px

All spacing should be multiples of 8px for visual consistency.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight spacing (icon gaps) |
| `--space-sm` | 8px | Related elements |
| `--space-md` | 16px | Standard padding |
| `--space-lg` | 24px | Section separation |
| `--space-xl` | 32px | Major sections |
| `--space-2xl` | 48px | Page sections |
| `--space-3xl` | 64px | Page margins (desktop) |

### Spacing Principles

1. **More whitespace than feels necessary** — ND brains need breathing room
2. **Consistent gutters** — 16px minimum between unrelated elements
3. **Group related items tightly** — 8px between related things
4. **Generous padding inside cards** — 24px minimum
5. **Touch targets minimum 44px** — easy to tap without precision

---

## Component Designs

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #5B4B8A;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  min-height: 44px;
  min-width: 44px;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #4A3D73;
}

.btn-primary:focus {
  outline: 3px solid #8B7BB5;
  outline-offset: 2px;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #5B4B8A;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #5B4B8A;
  min-height: 44px;
}
```

#### Energy Level Buttons
```css
.btn-energy-low {
  background: #A8D5BA;
  color: #2D4A36;
  border: none;
}

.btn-energy-medium {
  background: #F5D89A;
  color: #5C4A1F;
  border: none;
}

.btn-energy-high {
  background: #E8B4B4;
  color: #5C3636;
  border: none;
}
```

#### Button Rules
1. **No ghost buttons for primary actions** — too easy to miss
2. **Icons + text, not icons alone** — clarity over minimalism
3. **Generous padding** — easy to tap
4. **Visible focus states** — keyboard navigation must be obvious
5. **No button should look disabled when it's not**

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(91, 75, 138, 0.08);
  border: 1px solid #E8E4F0;
}

.card-task {
  /* Additional styling for task cards */
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.card-task:hover {
  border-color: #8B7BB5;
  box-shadow: 0 4px 12px rgba(91, 75, 138, 0.12);
}
```

#### Card Rules
1. **Subtle shadows only** — no harsh drop shadows
2. **Rounded corners (12px)** — softer, less aggressive
3. **Clear boundaries** — know where one thing ends, another begins
4. **No cards within cards** — one level of nesting maximum
5. **Consistent padding** — 24px on all sides

### Inputs

```css
.input {
  background: #FFFFFF;
  border: 2px solid #D4D4D4;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px; /* Prevents iOS zoom */
  line-height: 1.5;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #5B4B8A;
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 75, 138, 0.2);
}

.input::placeholder {
  color: #9B9B9B;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #3D3D3D;
  margin-bottom: 8px;
}
```

#### Input Rules
1. **Always use labels** — never placeholder-only
2. **16px minimum font size** — prevents mobile zoom
3. **Visible borders** — know where to click/tap
4. **Clear focus states** — obvious when selected
5. **Error states use muted coral, not bright red**

### Task Items

```css
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 8px;
  border-left: 4px solid transparent;
}

.task-item--low-energy {
  border-left-color: #A8D5BA;
}

.task-item--medium-energy {
  border-left-color: #F5D89A;
}

.task-item--high-energy {
  border-left-color: #E8B4B4;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #8B7BB5;
  border-radius: 6px;
  cursor: pointer;
}

.task-checkbox:checked {
  background: #6B9B7A;
  border-color: #6B9B7A;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(26, 22, 37, 0.6);
  backdrop-filter: blur(4px);
}

.modal {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  /* Large touch target */
}
```

#### Modal Rules
1. **Dim background significantly** — focus on the modal
2. **Large close button** — easy escape route
3. **Never auto-close** — let users control timing
4. **One action per modal** — don't overwhelm
5. **Escape key always works** — keyboard users need out

### Spoon Counter

```css
.spoon-counter {
  display: flex;
  gap: 4px;
  align-items: center;
}

.spoon {
  width: 24px;
  height: 24px;
  transition: opacity 0.3s ease;
}

.spoon--available {
  opacity: 1;
  color: #6B9B7A;
}

.spoon--used {
  opacity: 0.3;
  color: #D4D4D4;
}

.spoon--debt {
  color: #C27B7B;
}
```

---

## Layout Principles

### Grid System

```css
/* Mobile first */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

### Layout Rules

1. **Single column on mobile** — no side-by-side complexity
2. **Maximum 3 columns on desktop** — more is overwhelming
3. **Sticky navigation** — always know where you are
4. **No infinite scroll** — clear pagination instead
5. **Visible scroll indicators** — know there's more content

### Information Hierarchy

```
┌─────────────────────────────────────────┐
│  Header: Mode + Spoons + User          │ ← Fixed, always visible
├─────────────────────────────────────────┤
│                                         │
│  Primary Action Area                    │ ← What can I do RIGHT NOW?
│  (Neuro-check, Quick Add)               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Current Focus                          │ ← ONE thing to focus on
│  (Today's priority task)                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Task Lists                             │ ← Scrollable, secondary
│  (Now / Soon / Later)                   │
│                                         │
├─────────────────────────────────────────┤
│  Chat (Collapsed by default)            │ ← Expandable, not dominant
└─────────────────────────────────────────┘
```

---

## Mobile Considerations

### Touch Targets

- **Minimum 44px × 44px** for all interactive elements
- **8px minimum gap** between touch targets
- **Thumb-friendly zones** — primary actions in bottom half of screen

### Mobile-Specific Rules

1. **Bottom navigation** — easier to reach than top
2. **Swipe actions with undo** — swipe to complete, but allow undo
3. **Pull to refresh** — familiar pattern
4. **No hover states** — design for tap only
5. **Reduce information density** — even more whitespace

### Responsive Breakpoints

```css
/* Mobile first approach */
/* Base: 0-767px (Mobile) */
/* Medium: 768px-1023px (Tablet) */
/* Large: 1024px+ (Desktop) */
```

---

## Screen-by-Screen Guidance

### 1. Login/Signup Screen

**Goal:** Get in fast, no friction

**Design:**
- Centered card on calm background
- Large, clear form fields
- Single primary CTA
- "Forgot password" link (not button)
- No marketing copy — just function

**Colors:**
- Background: Soft gradient from `#E8E4F0` to `#FAFAFA`
- Card: `#FFFFFF`
- CTA: `#5B4B8A`

### 2. Neuro-Check Screen

**Goal:** Quick daily check-in without overwhelm

**Design:**
- One question at a time (wizard pattern)
- Large tap targets for scale ratings (1-5)
- Visual indicators (emoji or icons, not just numbers)
- Progress indicator (subtle dots, not progress bar)
- Skip option always visible

**Interaction:**
- Tap to select, auto-advance after 0.5s delay
- Gentle fade transitions between questions
- Celebratory but subtle completion (checkmark, not confetti)

**Colors:**
- Scale uses energy colors (green → yellow → coral)
- Selected state: filled with slight scale-up animation

### 3. Main Dashboard

**Goal:** Know what to do next without scanning everything

**Design:**
- Spoon count prominently displayed (top)
- ONE highlighted "focus task" 
- Collapsible task sections (Now/Soon/Later)
- Quick-add buttons by energy level
- Collapsed chat at bottom

**Hierarchy:**
1. How much capacity do I have? (spoons)
2. What should I do first? (focus task)
3. What else is there? (task lists)
4. Need help? (chat)

**States:**
- Full capacity: Calm, normal colors
- Low capacity: Subtle warm tint, gentler suggestions
- Crisis mode: Simplified view, muted coral accent

### 4. Task Detail/Edit Screen

**Goal:** All info without overwhelm

**Design:**
- Modal or slide-over (not new page)
- Clear sections with generous spacing
- Editable fields with obvious tap targets
- Delete at bottom with confirmation
- Cancel always visible

**Sections:**
1. Task name (largest, top)
2. Energy level (visual selector)
3. Category (Now/Soon/Later)
4. Time estimate (optional)
5. Notes (expandable)
6. Actions (Complete / Delete)

### 5. Crisis Mode Screen

**Goal:** Maximum calm, minimum decisions

**Design:**
- Reduced to essential elements only
- Larger text, more whitespace
- Muted coral accent (not alarming red)
- Single suggested action
- Easy exit to normal mode

**What to HIDE in crisis:**
- Task counts
- Debt indicators
- Complex options
- Chat (unless specifically requested)

**What to SHOW in crisis:**
- One tiny step to take
- Permission to rest
- Exit button
- Breathing/grounding prompt

### 6. Task Completion Feedback

**Goal:** Celebrate without overwhelming

**Design:**
- Brief, satisfying animation (checkmark fills in)
- Optional quick feedback ("How did that feel?")
- Spoon update visible
- Auto-dismiss after 2 seconds OR tap to dismiss

**NOT:**
- Confetti
- Sound effects (unless user-enabled)
- Point counters
- Streak warnings

### 7. Settings Screen

**Goal:** Find and change things without hunting

**Design:**
- Grouped sections with clear headers
- Toggle switches (not checkboxes)
- Changes save automatically
- Confirmation for destructive actions only

**Sections:**
1. Profile (name, email)
2. Appearance (dark mode, font size)
3. Notifications (minimal options)
4. Data (export, clear)
5. Account (logout, delete)

---

## Animations & Transitions

### Principles

1. **Purposeful only** — animation should communicate, not decorate
2. **Short duration** — 150-300ms maximum
3. **Ease-out curves** — feel responsive, not sluggish
4. **Reduce motion option** — respect prefers-reduced-motion

### Timing

```css
--transition-fast: 150ms ease-out;
--transition-normal: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Standard Animations

```css
/* Button press */
.btn:active {
  transform: scale(0.98);
}

/* Card hover (desktop only) */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-2px);
    transition: transform var(--transition-normal);
  }
}

/* Modal enter */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: all var(--transition-normal);
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Requirements

### Color Contrast

- **Normal text:** Minimum 4.5:1 ratio
- **Large text (18px+):** Minimum 3:1 ratio
- **Interactive elements:** Minimum 3:1 ratio
- **Never rely on color alone** — always pair with icons/text

### Keyboard Navigation

- **Tab order:** Logical, top-to-bottom, left-to-right
- **Focus visible:** Always show focus indicator
- **Skip links:** Allow skipping to main content
- **Escape closes:** Modals, dropdowns, menus

### Screen Readers

- **Semantic HTML:** Use proper heading hierarchy
- **Alt text:** All images have descriptions
- **ARIA labels:** Interactive elements have clear labels
- **Live regions:** Announce dynamic changes

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up CSS custom properties (colors, spacing, typography)
- [ ] Implement base component styles (buttons, inputs, cards)
- [ ] Create responsive container and grid
- [ ] Add reduced-motion support

### Phase 2: Components
- [ ] Style all button variants
- [ ] Style task cards with energy indicators
- [ ] Style spoon counter
- [ ] Style modal system
- [ ] Style form elements

### Phase 3: Screens
- [ ] Login/Signup
- [ ] Neuro-check wizard
- [ ] Main dashboard
- [ ] Task detail modal
- [ ] Crisis mode view
- [ ] Settings

### Phase 4: Polish
- [ ] Add micro-animations
- [ ] Test color contrast
- [ ] Keyboard navigation audit
- [ ] Screen reader testing
- [ ] Mobile usability testing

---

## Quick Reference: Do's and Don'ts

### DO ✅

- Use muted, warm colors
- Provide generous whitespace
- Make touch targets large (44px+)
- Show one primary action at a time
- Use consistent patterns throughout
- Provide undo for destructive actions
- Support keyboard navigation
- Respect reduced-motion preferences

### DON'T ❌

- Use bright, saturated colors
- Cram information together
- Make users precision-tap
- Overwhelm with choices
- Surprise users with different patterns
- Delete without confirmation
- Trap keyboard focus
- Add animations for decoration

---

*This design system is a living document. Update as you learn what works for your users.*

*Last updated: January 10, 2026*