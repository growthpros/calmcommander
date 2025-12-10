# Calm Commander - AuDHD Edition
**v3.0 NEUROCHECK - Spoon-Aware Task Management with Burnout Protection**

A task management system designed specifically for neurodivergent brains. Unlike traditional to-do apps, Calm Commander tracks your actual daily capacity, prevents burnout through accountability systems, and adapts to both productive days and crisis moments.

[![Deploy to Replit](https://replit.com/badge/github/growthpros/calmcommander)](https://replit.com/new/github/growthpros/calmcommander)

---

## 🎯 What Makes This Different

**Traditional To-Do Apps:**
- Assume you have infinite energy
- No understanding of neurodivergent capacity fluctuations
- Allow infinite overcommitment
- Same interface every day regardless of your state

**Calm Commander:**
- ✅ **Tracks daily spoon capacity** based on sleep, mood, burnout indicators
- ✅ **Prevents burnout** with override limits and forced accountability
- ✅ **Adapts to your brain** (ADHD mode, Autism mode, Balanced mode)
- ✅ **AI estimates effort** so you don't have to guess
- ✅ **Crisis mode** for true emergencies
- ✅ **Pattern alerts** when you're heading for burnout (48hr, 5-day warnings)

**Built for brains that:**
- Don't self-monitor reliably
- Push through body signals until crash
- Can rationalize "just one more thing"
- Need external accountability to prevent overcommit

---

## 🌟 Key Features

### 🧠 Daily Neuro-Check System
Calculate realistic spoon capacity based on:
- **Mood + Sleep + Energy** levels (1-5 scales)
- **Brain mode** (ADHD / Autism / Balanced)
- **Burnout indicators** (7 types: sleep disruption, executive dysfunction, sensory overwhelm, etc.)
- **Quick boosters** (6 types, once per day: water, protein, movement, fresh air, connection, stim break)

→ Get honest daily capacity: "🥄 3 spoons remaining today"

### 🛡️ Override Safety System (Burnout Prevention)
**The Core Protection:**
- Try to complete task that costs more spoons than you have? → **Override Modal appears**
- Must **text accountability person** (Holly or Toni) before overriding
- Must enter **reason** (minimum 10 characters)
- **Weekly limit: 5 overrides maximum**
- **Spoon debt** carries to next day and compounds

**Pattern Alerts:**
- **48-hour alert** (2 days in debt) → Yellow warning, action buttons
- **5-day burnout alert** (5 days in debt) → RED ALERT, cannot dismiss without action

**Why this works:**
- External witness (can't hide from accountability partner)
- Hard numerical limit (brain can't negotiate with 5/week)
- Debt tracking (makes consequences visible)
- Pattern detection (notices what your brain won't)

### 🔥 Crisis Mode
**Emergency escape hatch:**
- Removes all spoon limits temporarily
- No override modals when completing tasks
- Still tracks debt (you'll see it when crisis ends)
- Auto-exits tomorrow at 8 AM
- Requires reason (min 10 characters explaining crisis)

**Use for:**
- True emergencies (client crisis, urgent deadline, family emergency)
- When override system blocks genuinely critical work

**Don't use for:**
- Regular work that feels urgent
- Every week (defeats protective purpose)

### 📊 Advanced Task Management

**Two Ways to Add Tasks:**

**1. Quick Add** (3 buttons):
- Low Energy → 1 spoon
- Medium Energy → 2 spoons
- High Energy → 3 spoons
- Time estimate modal (15min, 30min, 1hr, 2hr, custom)

**2. Advanced Add Task** (full metadata):
- Title, Category, Energy Level
- **Urgency** (Critical/Important/Normal/Low)
- **Focus Level** (High/Med/Low - affects spoon cost!)
  - High Focus = 1.5x spoons
  - Low Focus = 0.75x spoons
- **Due Date** (auto-places in correct timeframe)
- **Waiting For** (dependency tracking)
- **Time Estimate** (in hours)
- Client, Billable checkbox

**Everything is inline-editable** - click any field to change it!

### 🎨 Task Organization

**Five Timeframe Views:**
- 🔥 **Today** - Do these today
- 📅 **This Week** - This week's tasks
- 📆 **Next Week** - Next week's tasks
- 🗓️ **This Month** - This month's tasks
- 🌊 **Later** - Someday/maybe

**Auto-placement:**
Set a due date → Task automatically moves to correct view!

### ⏱️ Time & Capacity Tracking

**Daily Capacity Check** (Today view):
- Enter calendar time (meetings/calls)
- System calculates available hours (8hr workday - meetings)
- Compares to total task time estimates
- **Warnings:**
  - 🔵 Good balance (under 4h of tasks)
  - 🟡 Might be overcommitted (tasks > available time)
  - 🔴 Seriously overcommitted (tasks > entire workday)

### 💼 Billing & Client Work
- Mark tasks as **billable**
- Assign to **clients**
- **Monthly billing view** with totals
- Edit completed tasks (client, billable status, time)
- **Export data** (JSON backup)

### 🤖 AI-Powered Features
- **Auto-estimate spoons** based on task description
- **Auto-estimate time** (in minutes)
- **Break down complex tasks** into subtasks
- **Crisis keyword detection** ("overwhelmed", "frozen", "shutdown")

---

## 🚀 Quick Start

### Option 1: Deploy to Replit (Easiest - No Setup!)

1. **Click the Replit badge** above or go to [replit.com/new/github/growthpros/calmcommander](https://replit.com/new/github/growthpros/calmcommander)
2. **Import from GitHub**: Paste `https://github.com/growthpros/calmcommander`
3. **Select branch**: `claude/setup-replit-import-011CUg89Cg7Fd9bnL6PHdXri`
4. **Click "Run"** - app starts automatically on port 5000!
5. **Open in browser** - Replit provides the URL

**That's it!** No API keys needed for basic use, data stored in browser.

### Option 2: Local Development

**Prerequisites:**
- Node.js 16+ ([download here](https://nodejs.org/))
- npm (comes with Node.js)

**Installation:**

```bash
# Clone the repository
git clone https://github.com/growthpros/calmcommander.git
cd calmcommander

# Checkout the latest feature branch
git checkout claude/setup-replit-import-011CUg89Cg7Fd9bnL6PHdXri

# Install dependencies
npm install

# Start the server
npm start
```

**Access:** Open `http://localhost:3000` in your browser

---

## 📖 Documentation

- **[Complete User Guide](USER_GUIDE.md)** - Comprehensive documentation (831 lines!)
- **[Quick Start Card](QUICKSTART.md)** - One-page reference for getting started
- **[Screenshot Guide](SCREENSHOTS.md)** - Visual documentation guide

---

## 💡 How to Use

### First Time

1. **Open the app**
2. **Click "Start Daily Neuro-Check"**
3. **Answer honestly:**
   - Mood (1-5)
   - Sleep quality (1-5)
   - Energy units (1-5)
   - Brain mode (ADHD / Autism / Balanced)
   - Burnout indicators (check all that apply)
4. **Get your spoon capacity** for the day
5. **Add your first task** (Quick Add or Advanced)

### Daily Workflow

**Morning:**
1. Do Neuro-Check to set daily capacity
2. Review Today tasks
3. Use Quick Boosters as you do them (water, protein, etc.)

**During Day:**
4. Complete tasks (green button)
5. If override needed → Text accountability person first
6. Break down complex tasks (AI suggests subtasks)
7. Move tasks between views as priorities shift

**Throughout Week:**
8. Stay under 5 overrides per week
9. Watch for pattern alerts (48hr, 5-day)
10. Enter crisis mode only when truly needed

---

## 🏗️ Project Structure

```
calmcommander/
├── server.js              # Express server (port 5000, cache-control headers)
├── package.json           # Dependencies
├── public/
│   └── index.html         # Single-file React app (4,800+ lines)
├── .replit                # Replit deployment config
├── README.md              # This file
├── USER_GUIDE.md          # Comprehensive user documentation
├── QUICKSTART.md          # One-page quick reference
└── SCREENSHOTS.md         # Screenshot documentation guide
```

**Single-File Architecture:**
- Entire app in one HTML file (React via CDN)
- No build process needed
- Babel transpiles JSX in browser
- All data in localStorage (privacy-first)

---

## 🛠️ Technology Stack

**Frontend:**
- React 18 (UMD build via CDN)
- Babel Standalone (JSX transpilation)
- Tailwind CSS (via CDN)
- localStorage for persistence

**Backend:**
- Node.js + Express
- Cache-control headers (prevents Replit proxy caching)
- `/fresh` route for uncached version
- Static file serving with no-cache headers

**Rendering:**
- React 17-style rendering (ReactDOM.render)
- Works with React 18 UMD builds
- No createRoot needed

**AI Features:**
- Task estimation algorithms
- Spoon calculation formulas
- AI task breakdown (if API configured)

---

## 🔒 Privacy & Data

**What's Stored:**
- ✅ Tasks (localStorage - stays in browser)
- ✅ Neuro-Check data (localStorage)
- ✅ Spoon capacity (localStorage)
- ✅ Override log (localStorage)
- ✅ Crisis mode state (localStorage)
- ✅ Completed tasks (localStorage)

**What's NOT Stored:**
- ❌ No server-side database
- ❌ No cloud sync (optional future feature)
- ❌ No user accounts
- ❌ No tracking/analytics

**localStorage Keys:**
- `calmCommanderTasks` - Active tasks
- `calmCommanderCompletedTasks` - Completed tasks
- `ccNeuroCheck` - Daily neuro-check data
- `ccDailyCapacity` - Spoon capacity
- `ccOverrideLog` - Override history
- `ccCrisisMode` - Crisis mode state
- `ccSpoonDebt` - Debt tracking

**To Clear All Data:**
```javascript
// In browser console (F12):
localStorage.clear();
location.reload();
```

**To Backup Data:**
Click "Export Data" button → Downloads JSON file with all data

---

## 🎯 Use Cases

### For ADHD Brains:
- Daily capacity varies wildly → Neuro-Check adapts
- Hyperfocus can ignore body signals → Override system intervenes
- Time blindness → AI estimates time/effort
- Executive dysfunction → Break down tasks feature
- Novelty seeking → Quick Boosters provide variety

### For Autistic Brains:
- Burnout from masking → Pattern alerts catch it early
- Meltdown/shutdown patterns → 5-day alert forces pause
- Spoon theory visualization → Makes energy concrete
- Routine preference → Consistent daily Neuro-Check
- Need for structure → Clear timeframe organization

### For AuDHD (Combined):
- Variable capacity + masking → Daily honest check-in
- Push through until crash → Hard limits with accountability
- Can't trust internal signals → External tracking system
- Rationalize overcommit → Forces text to accountability partner
- Need escape hatch → Crisis mode for true emergencies

---

## 🐛 Troubleshooting

### App shows purple background only (won't load)

**Cause:** JavaScript error preventing React from rendering

**Fix:**
1. Open browser console (F12)
2. Look for error message
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. If persists, pull latest code: `git pull origin claude/setup-replit-import-011CUg89Cg7Fd9bnL6PHdXri`

### Dates are off by one day

**This was a timezone bug - FIXED in latest version**

**Fix:** Pull latest code with timezone corrections

### Time showing as minutes instead of hours (or vice versa)

**This was a display bug - FIXED in latest version**

**Fix:** Pull latest code - now correctly converts minutes ↔ hours

### "I can't complete a task" (Override modal blocking)

**This is the system working correctly!**

**Options:**
1. Text your accountability person, check box, complete override
2. Defer task to tomorrow/next week
3. Break down task into smaller parts
4. Switch to crisis mode (if truly urgent)

**Remember:** 5 overrides per week maximum - this protects you from burnout

### Tasks disappeared

**Check:**
1. Are they in a different timeframe view? (This Week, Later, etc.)
2. Are they completed? (check completed tasks list)
3. Did you clear browser data? (can't recover without backup)

**Prevention:**
- Export data regularly (weekly backup)
- Don't clear browser data without exporting first

### Want to see override history

**In browser console (F12):**
```javascript
JSON.parse(localStorage.getItem('ccOverrideLog'))
```

Shows all overrides with dates, reasons, debt amounts.

---

## 📊 Version History

**v3.0 - NEUROCHECK** (Current - November 2025)
- Daily Neuro-Check system with spoon calculation
- Override Safety System (accountability + weekly limits)
- Crisis Mode with auto-exit
- Quick Spoon Boosters (6 types)
- Advanced task metadata (urgency, focus, due dates, dependencies)
- Calendar date picker for due dates
- Time capacity warnings
- Pattern alerts (48hr, 5-day burnout warnings)
- Focus level affects spoon calculation
- Due date auto-places tasks in timeframe
- AI task breakdown feature
- Comprehensive inline editing
- Export/Import data
- Monthly billing view
- Timezone fixes for dates
- Time display fixes (minutes/hours)

**v2.0** (October 2025)
- Basic spoon tracking
- Task categories
- Client/billable tracking

**v1.0** (September 2025)
- AI Coach/Crisis modes
- Basic task management
- localStorage persistence

---

## 🤝 Contributing

This project is built for the neurodivergent community. Contributions welcome!

**Guidelines:**
- ✅ Respect neurodivergent needs (clear, calm, protective design)
- ✅ No breaking changes to safety systems
- ✅ Test thoroughly before submitting
- ✅ Update documentation (USER_GUIDE.md)
- ✅ Maintain single-file architecture

**To Contribute:**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature-name`
3. Make changes
4. Test in multiple browsers
5. Update USER_GUIDE.md if adding features
6. Commit with clear messages
7. Submit pull request

---

## 📄 License

MIT License - Free to use, modify, and share.

See [LICENSE](LICENSE) file for full details.

---

## 🙏 Credits

**Built with care for the neurodivergent community.**

**Powered by:**
- React 18
- Express.js
- Spoon Theory (Christine Miserandino)
- Lived experience of the AuDHD community

**Special Thanks:**
- Holly & Toni (accountability partners)
- Neurodivergent beta testers
- Anthropic's Claude (for AI features when configured)

---

## 📞 Support

**Need Help?**
1. Read the [User Guide](USER_GUIDE.md) (comprehensive!)
2. Check the [Quick Start Card](QUICKSTART.md)
3. Review troubleshooting section above
4. Open a [GitHub Issue](https://github.com/growthpros/calmcommander/issues)

**Found a Bug?**
- Open an issue with:
  - What you expected to happen
  - What actually happened
  - Browser console errors (F12 → Console)
  - Steps to reproduce

**Feature Request?**
- Open an issue describing:
  - The problem it solves
  - How it would work
  - Why it's needed for neurodivergent brains

---

## ⚠️ Important Notes

**This is a support tool, not a replacement for:**
- Medical care
- Therapy
- Medication
- Professional diagnosis

**The Override Safety System is protective, not punitive:**
- When it feels annoying → That's often when you need it most
- The limits exist because neurodivergent brains don't self-monitor reliably
- Texting accountability partners creates external witness (can't hide from others)
- 5 overrides per week is empirically where burnout patterns accelerate

**Crisis Mode is an emergency tool:**
- Not for daily use
- Debt still accumulates (you'll pay it back)
- Plan recovery time after crisis
- Review what caused crisis to prevent recurrence

---

**Remember: You're doing great. One spoon at a time. 💜**

---

*Last Updated: November 2025*
*Built for brains that work differently - because that's not broken, just different.*
